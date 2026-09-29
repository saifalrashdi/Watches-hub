'use strict';
/**
 * server.js — Watches Hub: multi-vendor watch marketplace API.
 * Express 4 + better-sqlite3. No build step, no external services.
 */
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const express = require('express');
const {
  db, BRANDS, CONDITIONS, CURRENCIES, LISTING_STATUSES, OFFER_STATUSES, CITIES,
  hashPassword, verifyPassword,
} = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'jiwan2026';
const SESSION_SECRET = process.env.SESSION_SECRET ||
  crypto.createHash('sha256').update(`watcheshub:${ADMIN_USERNAME}:${ADMIN_PASSWORD}`).digest('hex');
const USER_COOKIE = 'wh_user';
const ADMIN_COOKIE = 'wh_admin';
const USER_TTL_MS = 7 * 24 * 60 * 60 * 1000;   // 7 days
const ADMIN_TTL_MS = 12 * 60 * 60 * 1000;      // 12 hours

app.disable('x-powered-by');
app.use(express.json({ limit: '12mb' }));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1h', index: 'index.html' }));

/* ------------------------------------------------------------------ */
/* Utilities                                                           */
/* ------------------------------------------------------------------ */
function bad(res, status, message) { return res.status(status).json({ error: message }); }
function s(v, max = 500) { return String(v == null ? '' : v).trim().slice(0, max); }
function n(v) { const x = Number(v); return Number.isFinite(x) ? x : NaN; }
function boolInt(v) { return v ? 1 : 0; }

function parseCookies(req) {
  const out = {};
  for (const part of (req.headers.cookie || '').split(';')) {
    const i = part.indexOf('=');
    if (i > -1) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}
function sign(payload) { return crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex'); }
function timingSafeEq(a, b) {
  const ba = Buffer.from(String(a)), bb = Buffer.from(String(b));
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
}
function makeCookie(name, id, ttl) {
  const exp = Date.now() + ttl;
  const payload = `${id}.${exp}`;
  return `${name}=${encodeURIComponent(`${payload}.${sign(payload)}`)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${ttl / 1000}`;
}
function readSignedCookie(req, name) {
  const raw = parseCookies(req)[name];
  if (!raw) return null;
  const [id, exp, sig] = raw.split('.');
  if (!id || !exp || !sig) return null;
  if (!timingSafeEq(sig, sign(`${id}.${exp}`))) return null;
  if (Number(exp) < Date.now()) return null;
  return id;
}

function currentUser(req) {
  const id = readSignedCookie(req, USER_COOKIE);
  if (!id) return null;
  return db.prepare('SELECT id, name, email, phone, whatsapp, created_at FROM users WHERE id = ?').get(Number(id)) || null;
}
function requireUser(req, res, next) {
  const u = currentUser(req);
  if (!u) return bad(res, 401, 'Please sign in first');
  req.user = u;
  next();
}
function isAdmin(req) { return readSignedCookie(req, ADMIN_COOKIE) === ADMIN_USERNAME; }
function requireAdmin(req, res, next) {
  if (!isAdmin(req)) return bad(res, 401, 'Not authenticated');
  next();
}

function parsePhotos(l) {
  try { l.photos = JSON.parse(l.photos || '[]'); } catch { l.photos = []; }
  return l;
}

/* ------------------------------------------------------------------ */
/* Auth                                                                */
/* ------------------------------------------------------------------ */
app.post('/api/auth/register', (req, res) => {
  const b = req.body || {};
  const name = s(b.name, 80);
  const email = s(b.email, 160).toLowerCase();
  const password = String(b.password || '');
  const phone = s(b.phone, 40);
  const whatsapp = s(b.whatsapp, 40).replace(/[^0-9]/g, '');
  if (!name) return bad(res, 400, 'Name is required');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return bad(res, 400, 'A valid email is required');
  if (password.length < 6) return bad(res, 400, 'Password must be at least 6 characters');
  const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (exists) return bad(res, 409, 'This email is already registered — try signing in');
  const info = db.prepare('INSERT INTO users (name, email, phone, whatsapp, pass_hash) VALUES (?, ?, ?, ?, ?)')
    .run(name, email, phone, whatsapp, hashPassword(password));
  res.setHeader('Set-Cookie', makeCookie(USER_COOKIE, info.lastInsertRowid, USER_TTL_MS));
  res.json({ ok: true, user: { id: info.lastInsertRowid, name, email } });
});

app.post('/api/auth/login', (req, res) => {
  const email = s(req.body && req.body.email, 160).toLowerCase();
  const password = String((req.body && req.body.password) || '');
  const u = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!u || !verifyPassword(password, u.pass_hash)) return bad(res, 401, 'Wrong email or password');
  res.setHeader('Set-Cookie', makeCookie(USER_COOKIE, u.id, USER_TTL_MS));
  res.json({ ok: true, user: { id: u.id, name: u.name, email: u.email } });
});

app.post('/api/auth/logout', (req, res) => {
  res.setHeader('Set-Cookie', `${USER_COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`);
  res.json({ ok: true });
});

function unreadCounts(userId) {
  const convs = db.prepare('SELECT * FROM conversations WHERE buyer_id = ? OR seller_id = ?').all(userId, userId);
  let unread = 0;
  const cnt = db.prepare('SELECT COUNT(*) AS c FROM messages WHERE conversation_id = ? AND id > ? AND sender_id != ?');
  for (const c of convs) {
    const lastRead = c.buyer_id === userId ? c.buyer_last_read : c.seller_last_read;
    unread += cnt.get(c.id, lastRead, userId).c;
  }
  const offersReceived = db.prepare(`SELECT COUNT(*) AS c FROM offers o
    JOIN listings l ON l.id = o.listing_id WHERE l.user_id = ? AND o.status = 'pending'`).get(userId).c;
  const offersAnswered = db.prepare(`SELECT COUNT(*) AS c FROM offers
    WHERE buyer_id = ? AND status IN ('accepted','rejected')`).get(userId).c;
  return { unread_messages: unread, pending_offers: offersReceived, answered_offers: offersAnswered };
}

app.get('/api/auth/me', (req, res) => {
  const u = currentUser(req);
  if (!u) return res.json({ user: null });
  const favorites = db.prepare('SELECT COUNT(*) AS c FROM favorites WHERE user_id = ?').get(u.id).c;
  res.json({ user: u, ...unreadCounts(u.id), favorites_count: favorites });
});

/* ------------------------------------------------------------------ */
/* Listings                                                            */
/* ------------------------------------------------------------------ */
app.get('/api/listings', (req, res) => {
  const { q, brand, condition, seller, sort, city } = req.query;
  let sql = `SELECT l.*, u.name AS seller_name FROM listings l JOIN users u ON u.id = l.user_id
             WHERE l.status = 'active'`;
  const params = {};
  if (q) { sql += ' AND (l.title LIKE @q OR l.brand LIKE @q OR l.description LIKE @q)'; params.q = `%${s(q, 80)}%`; }
  if (brand && brand !== 'all') { sql += ' AND l.brand = @brand'; params.brand = s(brand, 40); }
  if (condition && condition !== 'all') { sql += ' AND l.condition = @condition'; params.condition = s(condition, 20); }
  if (city && city !== 'all') { sql += ' AND l.city = @city'; params.city = s(city, 40); }
  if (seller) { sql += ' AND l.user_id = @seller'; params.seller = n(seller); }
  sql += sort === 'price_asc' ? ' ORDER BY l.price ASC'
    : sort === 'price_desc' ? ' ORDER BY l.price DESC'
    : ' ORDER BY l.id DESC';
  const rows = db.prepare(sql).all(params).map(parsePhotos);
  const me = currentUser(req);
  if (me) {
    const fav = db.prepare('SELECT listing_id FROM favorites WHERE user_id = ?').all(me.id)
      .reduce((set, r) => set.add(r.listing_id), new Set());
    for (const r of rows) r.is_favorite = fav.has(r.id);
  }
  res.json(rows);
});

app.get('/api/listings/:id', (req, res) => {
  const l = db.prepare(`SELECT l.*, u.name AS seller_name, u.created_at AS seller_since,
      u.phone AS seller_phone, u.whatsapp AS seller_whatsapp
    FROM listings l JOIN users u ON u.id = l.user_id WHERE l.id = ? AND l.status != 'removed'`).get(n(req.params.id));
  if (!l) return bad(res, 404, 'Listing not found');
  parsePhotos(l);
  l.seller_listing_count = db.prepare(`SELECT COUNT(*) AS c FROM listings WHERE user_id = ? AND status = 'active'`).get(l.user_id).c;
  l.favorites_count = db.prepare('SELECT COUNT(*) AS c FROM favorites WHERE listing_id = ?').get(l.id).c;
  const me = currentUser(req);
  l.is_favorite = me ? !!db.prepare('SELECT 1 FROM favorites WHERE user_id = ? AND listing_id = ?').get(me.id, l.id) : false;
  // never expose contact details in the payload — only whether they exist
  l.seller_has_phone = !!l.seller_phone;
  l.seller_has_whatsapp = !!l.seller_whatsapp;
  delete l.seller_phone;
  delete l.seller_whatsapp;
  res.json(l);
});

/* masked phone reveal — requires sign-in (anti-scraping) */
app.get('/api/listings/:id/phone', requireUser, (req, res) => {
  const l = db.prepare(`SELECT l.user_id, u.phone, u.whatsapp FROM listings l
    JOIN users u ON u.id = l.user_id WHERE l.id = ? AND l.status != 'removed'`).get(n(req.params.id));
  if (!l) return bad(res, 404, 'Listing not found');
  res.json({ phone: l.phone || '', whatsapp: l.whatsapp || '' });
});

/* favorites */
app.post('/api/listings/:id/favorite', requireUser, (req, res) => {
  const id = n(req.params.id);
  const l = db.prepare(`SELECT id FROM listings WHERE id = ? AND status != 'removed'`).get(id);
  if (!l) return bad(res, 404, 'Listing not found');
  const existing = db.prepare('SELECT 1 FROM favorites WHERE user_id = ? AND listing_id = ?').get(req.user.id, id);
  if (existing) {
    db.prepare('DELETE FROM favorites WHERE user_id = ? AND listing_id = ?').run(req.user.id, id);
    return res.json({ ok: true, favorited: false });
  }
  db.prepare('INSERT INTO favorites (user_id, listing_id) VALUES (?, ?)').run(req.user.id, id);
  res.json({ ok: true, favorited: true });
});

app.get('/api/my/favorites', requireUser, (req, res) => {
  const rows = db.prepare(`SELECT l.*, u.name AS seller_name, f.created_at AS favorited_at
    FROM favorites f JOIN listings l ON l.id = f.listing_id JOIN users u ON u.id = l.user_id
    WHERE f.user_id = ? ORDER BY f.created_at DESC`).all(req.user.id).map(parsePhotos);
  for (const r of rows) r.is_favorite = true;
  res.json(rows);
});

/* report a listing */
app.post('/api/listings/:id/reports', requireUser, (req, res) => {
  const id = n(req.params.id);
  const l = db.prepare('SELECT id, user_id FROM listings WHERE id = ? AND status != ?').get(id, 'removed');
  if (!l) return bad(res, 404, 'Listing not found');
  if (l.user_id === req.user.id) return bad(res, 400, 'You cannot report your own listing');
  const reason = s(req.body && req.body.reason, 300);
  if (!reason) return bad(res, 400, 'Tell us briefly what is wrong');
  const dup = db.prepare('SELECT id FROM reports WHERE listing_id = ? AND reporter_id = ?').get(id, req.user.id);
  if (dup) return bad(res, 409, 'You already reported this listing');
  db.prepare('INSERT INTO reports (listing_id, reporter_id, reason) VALUES (?, ?, ?)').run(id, req.user.id, reason);
  res.json({ ok: true });
});

function validateListing(b) {
  const l = {
    title: s(b.title, 140),
    brand: s(b.brand, 40),
    year: s(b.year, 12),
    condition: s(b.condition, 20),
    price: n(b.price),
    currency: s(b.currency || 'AED', 8).toUpperCase(),
    negotiable: boolInt(b.negotiable),
    description: s(b.description, 2000),
    city: s(b.city, 40),
  };
  if (!l.title) return { error: 'Title is required' };
  if (!BRANDS.includes(l.brand)) return { error: 'Invalid brand' };
  if (!CONDITIONS.includes(l.condition)) return { error: 'Invalid condition' };
  if (!Number.isFinite(l.price) || l.price <= 0 || l.price > 1e9) return { error: 'Invalid price' };
  if (!CURRENCIES.includes(l.currency)) return { error: 'Invalid currency' };
  if (l.city && !CITIES.includes(l.city)) return { error: 'Invalid city' };
  return { value: l };
}

function saveBase64Image(dataUrl) {
  const m = /^data:image\/(png|jpe?g|webp);base64,(.+)$/i.exec(String(dataUrl || ''));
  if (!m) throw new Error('Photos must be PNG, JPG or WebP');
  const ext = m[1].toLowerCase().replace('jpeg', 'jpg');
  const buf = Buffer.from(m[2], 'base64');
  if (buf.length > 8 * 1024 * 1024) throw new Error('A photo is too large (max 8 MB each)');
  const dir = path.join(__dirname, 'public', 'images', 'listings');
  fs.mkdirSync(dir, { recursive: true });
  const fname = `l-${Date.now().toString(36)}-${crypto.randomBytes(3).toString('hex')}.${ext}`;
  fs.writeFileSync(path.join(dir, fname), buf);
  return `/images/listings/${fname}`;
}

app.post('/api/listings', requireUser, (req, res) => {
  const b = req.body || {};
  const { value: l, error } = validateListing(b);
  if (error) return bad(res, 400, error);
  const photos = [];
  const rawPhotos = Array.isArray(b.photos) ? b.photos.slice(0, 5) : [];
  try {
    for (const p of rawPhotos) photos.push(saveBase64Image(p));
  } catch (e) { return bad(res, 400, e.message); }
  if (photos.length === 0) return bad(res, 400, 'Add at least one photo');
  const info = db.prepare(`INSERT INTO listings
    (user_id, title, brand, year, condition, price, currency, negotiable, description, photos, city)
    VALUES (@user_id, @title, @brand, @year, @condition, @price, @currency, @negotiable, @description, @photos, @city)`)
    .run({ ...l, user_id: req.user.id, photos: JSON.stringify(photos) });
  res.json({ ok: true, id: info.lastInsertRowid });
});

app.patch('/api/listings/:id', requireUser, (req, res) => {
  const id = n(req.params.id);
  const existing = db.prepare('SELECT * FROM listings WHERE id = ?').get(id);
  if (!existing || existing.status === 'removed') return bad(res, 404, 'Listing not found');
  if (existing.user_id !== req.user.id) return bad(res, 403, 'You can only edit your own listings');
  const b = req.body || {};

  // status-only change (mark sold / reactivate)
  if (b.status && Object.keys(b).length === 1) {
    if (!['active', 'sold'].includes(b.status)) return bad(res, 400, 'Invalid status');
    db.prepare(`UPDATE listings SET status = ? WHERE id = ?`).run(b.status, id);
    return res.json({ ok: true });
  }

  const merged = { ...existing, ...b };
  const { value: l, error } = validateListing(merged);
  if (error) return bad(res, 400, error);
  let photos;
  try { photos = JSON.parse(existing.photos || '[]'); } catch { photos = []; }
  if (Array.isArray(b.new_photos) && b.new_photos.length) {
    try { for (const p of b.new_photos.slice(0, 5)) photos.push(saveBase64Image(p)); } catch (e) { return bad(res, 400, e.message); }
  }
  if (Array.isArray(b.photos) && b.photos.every(p => typeof p === 'string' && p.startsWith('/images/'))) {
    photos = b.photos.slice(0, 5);
  }
  photos = photos.slice(0, 5);
  if (photos.length === 0) return bad(res, 400, 'Add at least one photo');
  const status = LISTING_STATUSES.includes(b.status) && b.status !== 'removed' ? b.status : existing.status;
  db.prepare(`UPDATE listings SET title=@title, brand=@brand, year=@year, condition=@condition,
    price=@price, currency=@currency, negotiable=@negotiable, description=@description,
    photos=@photos, status=@status, city=@city WHERE id=@id`)
    .run({ ...l, photos: JSON.stringify(photos), status, id });
  res.json({ ok: true });
});

app.delete('/api/listings/:id', requireUser, (req, res) => {
  const id = n(req.params.id);
  const existing = db.prepare('SELECT * FROM listings WHERE id = ?').get(id);
  if (!existing) return bad(res, 404, 'Listing not found');
  if (existing.user_id !== req.user.id && !isAdmin(req)) return bad(res, 403, 'Not your listing');
  db.prepare(`UPDATE listings SET status = 'removed' WHERE id = ?`).run(id);
  res.json({ ok: true });
});

app.get('/api/my/listings', requireUser, (req, res) => {
  const rows = db.prepare(`SELECT * FROM listings WHERE user_id = ? AND status != 'removed' ORDER BY id DESC`)
    .all(req.user.id).map(parsePhotos);
  const offerCount = db.prepare(`SELECT COUNT(*) AS c FROM offers WHERE listing_id = ? AND status = 'pending'`);
  for (const r of rows) r.pending_offers = offerCount.get(r.id).c;
  res.json(rows);
});

/* ------------------------------------------------------------------ */
/* Offers (separate inbox)                                             */
/* ------------------------------------------------------------------ */
app.post('/api/listings/:id/offers', requireUser, (req, res) => {
  const listing = db.prepare(`SELECT * FROM listings WHERE id = ? AND status = 'active'`).get(n(req.params.id));
  if (!listing) return bad(res, 404, 'Listing not found or no longer active');
  if (listing.user_id === req.user.id) return bad(res, 400, 'You cannot make an offer on your own listing');
  const amount = n(req.body && req.body.amount);
  const message = s(req.body && req.body.message, 400);
  if (!Number.isFinite(amount) || amount <= 0 || amount > 1e9) return bad(res, 400, 'Enter a valid offer amount');
  const dup = db.prepare(`SELECT id FROM offers WHERE listing_id = ? AND buyer_id = ? AND status = 'pending'`)
    .get(listing.id, req.user.id);
  if (dup) return bad(res, 409, 'You already have a pending offer on this watch — wait for the seller to answer');
  const info = db.prepare(`INSERT INTO offers (listing_id, buyer_id, amount, currency, message) VALUES (?, ?, ?, ?, ?)`)
    .run(listing.id, req.user.id, amount, listing.currency, message);
  res.json({ ok: true, id: info.lastInsertRowid });
});

app.get('/api/offers/received', requireUser, (req, res) => {
  res.json(db.prepare(`SELECT o.*, l.title AS listing_title, l.photos AS listing_photos, l.status AS listing_status,
      l.price AS asking_price, l.currency AS listing_currency, u.name AS buyer_name
    FROM offers o
    JOIN listings l ON l.id = o.listing_id
    JOIN users u ON u.id = o.buyer_id
    WHERE l.user_id = ? ORDER BY o.id DESC`).all(req.user.id)
    .map(o => { o.listing_photos = JSON.parse(o.listing_photos || '[]'); return o; }));
});

app.get('/api/offers/sent', requireUser, (req, res) => {
  res.json(db.prepare(`SELECT o.*, l.title AS listing_title, l.photos AS listing_photos, l.status AS listing_status,
      l.price AS asking_price, l.currency AS listing_currency, u.name AS seller_name
    FROM offers o
    JOIN listings l ON l.id = o.listing_id
    JOIN users u ON u.id = l.user_id
    WHERE o.buyer_id = ? ORDER BY o.id DESC`).all(req.user.id)
    .map(o => { o.listing_photos = JSON.parse(o.listing_photos || '[]'); return o; }));
});

app.patch('/api/offers/:id', requireUser, (req, res) => {
  const id = n(req.params.id);
  const action = s(req.body && req.body.action, 20);
  const offer = db.prepare(`SELECT o.*, l.user_id AS seller_id, l.status AS listing_status
    FROM offers o JOIN listings l ON l.id = o.listing_id WHERE o.id = ?`).get(id);
  if (!offer) return bad(res, 404, 'Offer not found');
  if (offer.status !== 'pending') return bad(res, 409, 'This offer is no longer pending');

  let next = null;
  if (action === 'withdraw' && offer.buyer_id === req.user.id) next = 'withdrawn';
  if (action === 'accept' && offer.seller_id === req.user.id) next = 'accepted';
  if (action === 'reject' && offer.seller_id === req.user.id) next = 'rejected';
  if (!next) return bad(res, 403, 'You cannot perform this action');

  db.prepare(`UPDATE offers SET status = ?, updated_at = datetime('now') WHERE id = ?`).run(next, id);
  res.json({ ok: true, status: next });
});

/* ------------------------------------------------------------------ */
/* Private chat                                                        */
/* ------------------------------------------------------------------ */
app.post('/api/listings/:id/conversations', requireUser, (req, res) => {
  const listing = db.prepare(`SELECT * FROM listings WHERE id = ? AND status != 'removed'`).get(n(req.params.id));
  if (!listing) return bad(res, 404, 'Listing not found');
  if (listing.user_id === req.user.id) return bad(res, 400, 'This is your own listing');
  let conv = db.prepare('SELECT * FROM conversations WHERE listing_id = ? AND buyer_id = ?')
    .get(listing.id, req.user.id);
  if (!conv) {
    const info = db.prepare('INSERT INTO conversations (listing_id, buyer_id, seller_id) VALUES (?, ?, ?)')
      .run(listing.id, req.user.id, listing.user_id);
    conv = { id: info.lastInsertRowid };
  }
  res.json({ ok: true, id: conv.id });
});

function conversationFor(req, res) {
  const conv = db.prepare('SELECT * FROM conversations WHERE id = ?').get(n(req.params.id));
  if (!conv) { bad(res, 404, 'Conversation not found'); return null; }
  if (conv.buyer_id !== req.user.id && conv.seller_id !== req.user.id) {
    bad(res, 403, 'Not your conversation'); return null;
  }
  return conv;
}

app.get('/api/conversations', requireUser, (req, res) => {
  const convs = db.prepare(`SELECT c.*, l.title AS listing_title, l.photos AS listing_photos, l.status AS listing_status,
      l.price AS listing_price, l.currency AS listing_currency,
      ub.name AS buyer_name, us.name AS seller_name
    FROM conversations c
    JOIN listings l ON l.id = c.listing_id
    JOIN users ub ON ub.id = c.buyer_id
    JOIN users us ON us.id = c.seller_id
    WHERE c.buyer_id = ? OR c.seller_id = ?
    ORDER BY c.id DESC`).all(req.user.id, req.user.id);
  const lastMsg = db.prepare('SELECT * FROM messages WHERE conversation_id = ? ORDER BY id DESC LIMIT 1');
  const unread = db.prepare('SELECT COUNT(*) AS c FROM messages WHERE conversation_id = ? AND id > ? AND sender_id != ?');
  for (const c of convs) {
    c.listing_photos = JSON.parse(c.listing_photos || '[]');
    const lm = lastMsg.get(c.id);
    c.last_message = lm ? lm.body : '';
    c.last_message_at = lm ? lm.created_at : c.created_at;
    const lastRead = c.buyer_id === req.user.id ? c.buyer_last_read : c.seller_last_read;
    c.unread = unread.get(c.id, lastRead, req.user.id).c;
    c.other_name = c.buyer_id === req.user.id ? c.seller_name : c.buyer_name;
    c.my_role = c.buyer_id === req.user.id ? 'buyer' : 'seller';
  }
  convs.sort((a, b) => String(b.last_message_at).localeCompare(String(a.last_message_at)));
  res.json(convs);
});

app.get('/api/conversations/:id/messages', requireUser, (req, res) => {
  const conv = conversationFor(req, res);
  if (!conv) return;
  const after = n(req.query.after) || 0;
  const msgs = db.prepare(`SELECT m.*, u.name AS sender_name FROM messages m
    JOIN users u ON u.id = m.sender_id
    WHERE m.conversation_id = ? AND m.id > ? ORDER BY m.id ASC LIMIT 200`).all(conv.id, after);
  const maxId = msgs.length ? msgs[msgs.length - 1].id : after;
  if (conv.buyer_id === req.user.id) {
    db.prepare('UPDATE conversations SET buyer_last_read = MAX(buyer_last_read, ?) WHERE id = ?').run(maxId, conv.id);
  } else {
    db.prepare('UPDATE conversations SET seller_last_read = MAX(seller_last_read, ?) WHERE id = ?').run(maxId, conv.id);
  }
  const listing = db.prepare('SELECT id, title, price, currency, photos, status, user_id FROM listings WHERE id = ?').get(conv.listing_id);
  if (listing) parsePhotos(listing);
  res.json({
    messages: msgs,
    me: req.user.id,
    listing,
    other_name: conv.buyer_id === req.user.id
      ? db.prepare('SELECT name FROM users WHERE id = ?').get(conv.seller_id).name
      : db.prepare('SELECT name FROM users WHERE id = ?').get(conv.buyer_id).name,
  });
});

app.post('/api/conversations/:id/messages', requireUser, (req, res) => {
  const conv = conversationFor(req, res);
  if (!conv) return;
  const body = s(req.body && req.body.body, 1000);
  if (!body) return bad(res, 400, 'Message cannot be empty');
  const info = db.prepare('INSERT INTO messages (conversation_id, sender_id, body) VALUES (?, ?, ?)')
    .run(conv.id, req.user.id, body);
  res.json({ ok: true, id: info.lastInsertRowid });
});

/* ------------------------------------------------------------------ */
/* Admin (env-based login, moderation)                                 */
/* ------------------------------------------------------------------ */
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!timingSafeEq(s(username, 80), ADMIN_USERNAME) || !timingSafeEq(s(password, 120), ADMIN_PASSWORD)) {
    return bad(res, 401, 'Wrong username or password');
  }
  res.setHeader('Set-Cookie', makeCookie(ADMIN_COOKIE, ADMIN_USERNAME, ADMIN_TTL_MS));
  res.json({ ok: true });
});
app.post('/api/admin/logout', (req, res) => {
  res.setHeader('Set-Cookie', `${ADMIN_COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`);
  res.json({ ok: true });
});
app.get('/api/admin/session', (req, res) => res.json({ authenticated: isAdmin(req) }));

app.get('/api/admin/listings', requireAdmin, (req, res) => {
  res.json(db.prepare(`SELECT l.*, u.name AS seller_name, u.email AS seller_email
    FROM listings l JOIN users u ON u.id = l.user_id ORDER BY l.id DESC`).all().map(parsePhotos));
});
app.patch('/api/admin/listings/:id', requireAdmin, (req, res) => {
  const status = s(req.body && req.body.status, 20);
  if (!LISTING_STATUSES.includes(status)) return bad(res, 400, 'Invalid status');
  const r = db.prepare('UPDATE listings SET status = ? WHERE id = ?').run(status, n(req.params.id));
  if (r.changes === 0) return bad(res, 404, 'Listing not found');
  res.json({ ok: true });
});
app.get('/api/admin/users', requireAdmin, (req, res) => {
  const users = db.prepare('SELECT id, name, email, phone, whatsapp, created_at FROM users ORDER BY id DESC').all();
  const lc = db.prepare(`SELECT COUNT(*) AS c FROM listings WHERE user_id = ? AND status != 'removed'`);
  const oc = db.prepare('SELECT COUNT(*) AS c FROM offers WHERE buyer_id = ?');
  for (const u of users) { u.listing_count = lc.get(u.id).c; u.offer_count = oc.get(u.id).c; }
  res.json(users);
});
app.get('/api/admin/offers', requireAdmin, (req, res) => {
  res.json(db.prepare(`SELECT o.*, l.title AS listing_title, ub.name AS buyer_name, us.name AS seller_name
    FROM offers o
    JOIN listings l ON l.id = o.listing_id
    JOIN users ub ON ub.id = o.buyer_id
    JOIN users us ON us.id = l.user_id
    ORDER BY o.id DESC`).all());
});
app.get('/api/admin/reports', requireAdmin, (req, res) => {
  res.json(db.prepare(`SELECT r.*, l.title AS listing_title, l.status AS listing_status, u.name AS reporter_name
    FROM reports r
    JOIN listings l ON l.id = r.listing_id
    JOIN users u ON u.id = r.reporter_id
    ORDER BY r.id DESC`).all());
});
app.delete('/api/admin/reports/:id', requireAdmin, (req, res) => {
  db.prepare('DELETE FROM reports WHERE id = ?').run(n(req.params.id));
  res.json({ ok: true });
});

/* ------------------------------------------------------------------ */
/* Config + SPA fallback                                               */
/* ------------------------------------------------------------------ */
app.get('/api/config', (req, res) => res.json({ brands: BRANDS, conditions: CONDITIONS, currencies: CURRENCIES, cities: CITIES }));

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => {
  console.log(`[watches-hub] listening on http://localhost:${PORT}`);
  console.log(`[watches-hub] admin: http://localhost:${PORT}/#/admin (user: ${ADMIN_USERNAME})`);
});
