'use strict';
/**
 * db.js — SQLite layer for Watches Hub (multi-vendor watch marketplace).
 * Auto-creates the database, creates tables, runs lightweight migrations
 * (PRAGMA table_info + conditional ALTER TABLE) and seeds demo data.
 */
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const Database = require('better-sqlite3');

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
fs.mkdirSync(DATA_DIR, { recursive: true });
const DB_PATH = process.env.DB_PATH || path.join(DATA_DIR, 'watcheshub.db');

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

/* ------------------------------------------------------------------ */
/* Schema                                                              */
/* ------------------------------------------------------------------ */
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL UNIQUE COLLATE NOCASE,
  phone      TEXT DEFAULT '',
  whatsapp   TEXT DEFAULT '',
  pass_hash  TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS listings (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER NOT NULL REFERENCES users(id),
  title       TEXT NOT NULL,
  brand       TEXT NOT NULL DEFAULT 'Other',
  year        TEXT DEFAULT '',
  condition   TEXT NOT NULL DEFAULT 'good',
  price       REAL NOT NULL DEFAULT 0,
  currency    TEXT NOT NULL DEFAULT 'AED',
  negotiable  INTEGER NOT NULL DEFAULT 1,
  description TEXT DEFAULT '',
  photos      TEXT NOT NULL DEFAULT '[]',
  status      TEXT NOT NULL DEFAULT 'active',
  city        TEXT NOT NULL DEFAULT '',
  box         INTEGER NOT NULL DEFAULT 0,
  papers      INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS offers (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  listing_id INTEGER NOT NULL REFERENCES listings(id),
  buyer_id   INTEGER NOT NULL REFERENCES users(id),
  amount     REAL NOT NULL,
  currency   TEXT NOT NULL DEFAULT 'AED',
  message    TEXT DEFAULT '',
  status     TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS conversations (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  listing_id       INTEGER NOT NULL REFERENCES listings(id),
  buyer_id         INTEGER NOT NULL REFERENCES users(id),
  seller_id        INTEGER NOT NULL REFERENCES users(id),
  buyer_last_read  INTEGER NOT NULL DEFAULT 0,
  seller_last_read INTEGER NOT NULL DEFAULT 0,
  created_at       TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (listing_id, buyer_id)
);

CREATE TABLE IF NOT EXISTS messages (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       INTEGER NOT NULL REFERENCES users(id),
  body            TEXT NOT NULL,
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS favorites (
  user_id    INTEGER NOT NULL REFERENCES users(id),
  listing_id INTEGER NOT NULL REFERENCES listings(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, listing_id)
);

CREATE TABLE IF NOT EXISTS reports (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  listing_id  INTEGER NOT NULL REFERENCES listings(id),
  reporter_id INTEGER NOT NULL REFERENCES users(id),
  reason      TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- AutoBidMaster-style proxy (Bid4U) bidding: one row per bidder per auction
-- holding their MAXIMUM bid; the public price is derived incrementally.
CREATE TABLE IF NOT EXISTS bids (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  listing_id  INTEGER NOT NULL REFERENCES listings(id),
  bidder_id   INTEGER NOT NULL REFERENCES users(id),
  max_amount  REAL NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (listing_id, bidder_id)
);

-- public bid history: each visible step of the proxy battle
CREATE TABLE IF NOT EXISTS bid_events (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  listing_id INTEGER NOT NULL REFERENCES listings(id),
  bidder_id  INTEGER NOT NULL REFERENCES users(id),
  amount     REAL NOT NULL,
  kind       TEXT NOT NULL DEFAULT 'bid',  -- bid | auto (Bid4U counter) | extend
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status, created_at);
CREATE INDEX IF NOT EXISTS idx_offers_listing ON offers(listing_id);
CREATE INDEX IF NOT EXISTS idx_offers_buyer ON offers(buyer_id);
CREATE INDEX IF NOT EXISTS idx_messages_conv ON messages(conversation_id, id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_bids_listing ON bids(listing_id);
CREATE INDEX IF NOT EXISTS idx_bids_bidder ON bids(bidder_id);
CREATE INDEX IF NOT EXISTS idx_bid_events_listing ON bid_events(listing_id, id);
`);

/* ------------------------------------------------------------------ */
/* Lightweight migrations                                              */
/* ------------------------------------------------------------------ */
function ensureColumn(table, column, ddl) {
  const cols = db.prepare(`PRAGMA table_info(${table})`).all().map(c => c.name);
  if (!cols.includes(column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${ddl}`);
    console.log(`[db] migration: added ${table}.${column}`);
  }
}
ensureColumn('listings', 'negotiable', 'negotiable INTEGER NOT NULL DEFAULT 1');
ensureColumn('listings', 'status', "status TEXT NOT NULL DEFAULT 'active'");
ensureColumn('conversations', 'buyer_last_read', 'buyer_last_read INTEGER NOT NULL DEFAULT 0');
ensureColumn('conversations', 'seller_last_read', 'seller_last_read INTEGER NOT NULL DEFAULT 0');
ensureColumn('offers', 'updated_at', "updated_at TEXT NOT NULL DEFAULT (datetime('now'))");
ensureColumn('listings', 'city', "city TEXT NOT NULL DEFAULT ''");
ensureColumn('listings', 'box', 'box INTEGER NOT NULL DEFAULT 0');
ensureColumn('listings', 'papers', 'papers INTEGER NOT NULL DEFAULT 0');
// auction columns (AutoBidMaster-style workflow)
ensureColumn('listings', 'sale_type', "sale_type TEXT NOT NULL DEFAULT 'fixed'");      // fixed | auction
ensureColumn('listings', 'auction_ends_at', "auction_ends_at TEXT NOT NULL DEFAULT ''");
ensureColumn('listings', 'reserve_price', 'reserve_price REAL NOT NULL DEFAULT 0');     // 0 = no reserve
ensureColumn('listings', 'auction_winner_id', 'auction_winner_id INTEGER NOT NULL DEFAULT 0');
ensureColumn('listings', 'sold_price', 'sold_price REAL NOT NULL DEFAULT 0');
ensureColumn('listings', 'auction_settled', 'auction_settled INTEGER NOT NULL DEFAULT 0');
ensureColumn('offers', 'source', "source TEXT NOT NULL DEFAULT 'user'");                  // user | auction (reserve review)

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */
const BRANDS = ['Rolex', 'Patek Philippe', 'Audemars Piguet', 'Richard Mille', 'Omega',
  'Cartier', 'Tudor', 'Vacheron Constantin', 'IWC', 'Jaeger-LeCoultre', 'Breitling',
  'Panerai', 'Hublot', 'Bulgari', 'Other'];
const CONDITIONS = ['unworn', 'excellent', 'good', 'fair', 'needs_service'];
const CURRENCIES = ['AED', 'USD', 'EUR', 'GBP', 'SAR', 'KWD', 'QAR', 'BHD', 'OMR', 'CHF'];
const LISTING_STATUSES = ['active', 'sold', 'removed'];
const OFFER_STATUSES = ['pending', 'accepted', 'rejected', 'withdrawn'];
const CITIES = ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah', 'Al Ain', 'Other GCC'];
const SALE_TYPES = ['fixed', 'auction'];
const AUCTION_DURATIONS = [1, 3, 5, 7]; // days

/* UTC datetime string N days (or minutes) from now, SQLite datetime('now') format */
function futureDate(days = 0, minutes = 0) {
  return new Date(Date.now() + days * 864e5 + minutes * 6e4).toISOString().slice(0, 19).replace('T', ' ');
}

/* scrypt password hashing (no external deps) */
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(String(password), salt, 64).toString('hex');
  return `${salt}:${hash}`;
}
function verifyPassword(password, stored) {
  const [salt, hash] = String(stored || '').split(':');
  if (!salt || !hash) return false;
  const test = crypto.scryptSync(String(password), salt, 64);
  const ref = Buffer.from(hash, 'hex');
  return test.length === ref.length && crypto.timingSafeEqual(test, ref);
}

/* ------------------------------------------------------------------ */
/* Seed demo data (only when users table is empty)                     */
/* ------------------------------------------------------------------ */
function seed() {
  if (db.prepare('SELECT COUNT(*) AS c FROM users').get().c > 0) return;

  const insUser = db.prepare('INSERT INTO users (name, email, phone, whatsapp, pass_hash) VALUES (?, ?, ?, ?, ?)');
  const ahmed = insUser.run('Ahmed Rashed', 'seller@watcheshub.demo', '+971501112233', '971501112233', hashPassword('demo1234')).lastInsertRowid;
  const mariam = insUser.run('Mariam K.', 'mariam@watcheshub.demo', '+971559998877', '971559998877', hashPassword('demo1234')).lastInsertRowid;
  const khalid = insUser.run('Khalid O.', 'khalid@watcheshub.demo', '+971502223344', '', hashPassword('demo1234')).lastInsertRowid;

  const ins = db.prepare(`INSERT INTO listings
    (user_id, title, brand, year, condition, price, currency, negotiable, description, photos, city, box, papers)
    VALUES (@user_id, @title, @brand, @year, @condition, @price, @currency, @negotiable, @description, @photos, @city, @box, @papers)`);
  const L = (user_id, title, brand, year, condition, price, currency, negotiable, description, photos, city, box, papers) =>
    ins.run({ user_id, title, brand, year, condition, price, currency, negotiable, description, photos: JSON.stringify(photos), city, box, papers });

  L(ahmed, 'Rolex Submariner Date 16610 "Kermit" — full set 2004', 'Rolex', '2004', 'excellent', 58000, 'AED', 1,
    '50th-anniversary Submariner, green aluminium bezel, Mark I dial. Box, papers, recently pressure-tested. Serious buyers only.', ['/images/products/p01.jpg'], 'Dubai', 1, 1);
  L(ahmed, 'Rolex Cosmograph Daytona 116520 white dial', 'Rolex', '2012', 'excellent', 112000, 'AED', 0,
    'Final series of the first in-house Daytona. Unpolished, full set. Price is firm.', ['/images/products/p02.jpg'], 'Dubai', 1, 1);
  L(ahmed, 'Rolex GMT-Master II 16710 "Pepsi"', 'Rolex', '2006', 'good', 64500, 'AED', 1,
    'Iconic Pepsi bezel, solid-link bracelet, serviced last year. Open to reasonable offers.', ['/images/products/p04.jpg'], 'Abu Dhabi', 1, 0);
  L(ahmed, 'Patek Philippe Nautilus 5711/1A blue — collector set', 'Patek Philippe', '2021', 'unworn', 385000, 'AED', 0,
    'Discontinued 5711 with blue graduated dial. Full collector set, never worn.', ['/images/products/p06.jpg'], 'Dubai', 1, 1);
  L(ahmed, 'Richard Mille RM 010 titanium', 'Richard Mille', '2016', 'excellent', 720000, 'AED', 1,
    'Tonneau case in grade-5 titanium, skeletonised automatic. Worn a handful of times.', ['/images/products/p09.jpg'], 'Abu Dhabi', 1, 1);
  L(ahmed, 'Rolex Datejust 36 1601 linen dial, 1972', 'Rolex', '1972', 'needs_service', 9800, 'USD', 1,
    'Rare silver linen dial, fluted white-gold bezel. Runs, but it is due a full service — priced accordingly.', ['/images/products/p03.jpg'], 'Sharjah', 0, 0);
  L(mariam, 'Cartier Tank Louis small, rose gold', 'Cartier', '2019', 'excellent', 42000, 'AED', 1,
    '18k rose-gold Tank Louis, silvered dial, manual movement. Bought from Cartier Dubai, full set.', ['/images/products/p13.jpg'], 'Dubai', 1, 1);
  L(mariam, 'Audemars Piguet Royal Oak 15400ST black', 'Audemars Piguet', '2017', 'excellent', 145000, 'AED', 1,
    '41mm steel Royal Oak, Grande Tapisserie dial. Sharp edges, full set 2017.', ['/images/products/p11.jpg'], 'Dubai', 1, 1);
  L(mariam, 'Bulgari Serpenti Tubogas 35mm', 'Bulgari', '2021', 'unworn', 56000, 'AED', 0,
    'Single-spiral Serpenti in steel and rose gold, diamond-set head. Gift, never worn.', ['/images/products/p18.jpg'], 'Abu Dhabi', 1, 0);
  L(mariam, 'Omega Speedmaster Professional Moonwatch', 'Omega', '2015', 'good', 5400, 'USD', 1,
    'Hesalite Moonwatch, calibre 1861, on steel bracelet with box. Daily wearer, honest condition.', ['/images/products/p12.jpg'], 'Al Ain', 1, 0);
  L(khalid, 'Patek Philippe Calatrava 5196J yellow gold', 'Patek Philippe', '2018', 'excellent', 19200, 'USD', 1,
    'Pure dress watch, 37mm yellow gold, manual-wind. Selling to fund a Nautilus.', ['/images/products/p07.jpg'], 'Dubai', 1, 1);
  L(khalid, 'Rolex Day-Date 1803 yellow gold, 1977', 'Rolex', '1977', 'good', 24500, 'USD', 1,
    'The "President" in 18k gold, champagne pie-pan dial. Vintage patina is beautiful.', ['/images/products/p05.jpg'], 'Sharjah', 0, 0);
  L(khalid, 'Vacheron Constantin Patrimony 81180 pink gold', 'Vacheron Constantin', '2020', 'unworn', 68000, 'AED', 0,
    'Ultra-thin 40mm, hand-wound with Geneva Seal. Unworn, stickers on caseback.', ['/images/products/p14.jpg'], 'Abu Dhabi', 1, 1);
  L(khalid, 'Rolex Oyster Perpetual 36 turquoise', 'Rolex', '2022', 'excellent', 71000, 'AED', 1,
    'Cult "Tiffany" turquoise dial, discontinued. Full set 2022.', ['/images/products/p15.jpg'], 'Dubai', 1, 1);

  // a demo offer + conversation so the inboxes are not empty
  const listing1 = db.prepare('SELECT id, user_id FROM listings ORDER BY id LIMIT 1').get();
  db.prepare(`INSERT INTO offers (listing_id, buyer_id, amount, currency, message) VALUES (?, ?, ?, ?, ?)`)
    .run(listing1.id, khalid, 52000, 'AED', 'Serious buyer, can pick up this week with cash.');
  const conv = db.prepare('INSERT INTO conversations (listing_id, buyer_id, seller_id) VALUES (?, ?, ?)')
    .run(listing1.id, khalid, listing1.user_id).lastInsertRowid;
  const insMsg = db.prepare('INSERT INTO messages (conversation_id, sender_id, body) VALUES (?, ?, ?)');
  insMsg.run(conv, khalid, 'Salam Ahmed, is the Kermit still available? I left you an offer.');
  insMsg.run(conv, ahmed, 'Walaikum salam Khalid, yes it is. I saw your offer — let me think about it tonight.');

  console.log('[db] seeded demo users, listings, offer and conversation');
  console.log('[db] demo logins: seller@watcheshub.demo / mariam@watcheshub.demo / khalid@watcheshub.demo — password: demo1234');
}
seed();

/* Seed a couple of demo auctions (runs on existing DBs too — guarded by sale_type check) */
function seedAuctions() {
  const has = db.prepare("SELECT COUNT(*) AS c FROM listings WHERE sale_type = 'auction'").get().c;
  const usersReady = db.prepare('SELECT COUNT(*) AS c FROM users').get().c;
  if (has > 0 || usersReady === 0) return;

  const ahmed = db.prepare("SELECT id FROM users WHERE email = 'seller@watcheshub.demo'").get();
  const mariam = db.prepare("SELECT id FROM users WHERE email = 'mariam@watcheshub.demo'").get();
  const khalid = db.prepare("SELECT id FROM users WHERE email = 'khalid@watcheshub.demo'").get();
  if (!ahmed || !mariam || !khalid) return;

  const ins = db.prepare(`INSERT INTO listings
    (user_id, title, brand, year, condition, price, currency, negotiable, description, photos, city, box, papers,
     sale_type, auction_ends_at, reserve_price)
    VALUES (@user_id, @title, @brand, @year, @condition, @price, @currency, 0, @description, @photos, @city, @box, @papers,
     'auction', @auction_ends_at, @reserve_price)`);

  const a1 = ins.run({
    user_id: ahmed.id, title: 'Tudor Black Bay 58 burgundy — auction', brand: 'Tudor', year: '2023',
    condition: 'excellent', price: 9500, currency: 'AED',
    description: '39mm Black Bay 58 on bracelet, full set 2023. Timed auction — name your maximum and Bid4U does the rest.',
    photos: JSON.stringify(['/images/products/p16.jpg']), city: 'Dubai', box: 1, papers: 1,
    auction_ends_at: futureDate(2, 30), reserve_price: 10500,
  }).lastInsertRowid;

  ins.run({
    user_id: mariam.id, title: 'Omega Seamaster Diver 300M blue — no reserve auction', brand: 'Omega', year: '2020',
    condition: 'good', price: 9000, currency: 'AED',
    description: 'Ceramic bezel Seamaster 300M, calibre 8800. No reserve — highest bid wins when the timer runs out.',
    photos: JSON.stringify(['/images/products/p19.jpg']), city: 'Abu Dhabi', box: 1, papers: 1,
    auction_ends_at: futureDate(5), reserve_price: 0,
  });

  // a couple of proxy bids so the auction shows live history (Bid4U style)
  const insBid = db.prepare('INSERT INTO bids (listing_id, bidder_id, max_amount) VALUES (?, ?, ?)');
  const insEv = db.prepare("INSERT INTO bid_events (listing_id, bidder_id, amount, kind) VALUES (?, ?, ?, ?)");
  insBid.run(a1, khalid.id, 10000);
  insEv.run(a1, khalid.id, 9500, 'bid');   // first bidder opens at the starting price
  insBid.run(a1, mariam.id, 11000);
  insEv.run(a1, khalid.id, 10000, 'auto'); // Bid4U defends Khalid up to his 10,000 max...
  insEv.run(a1, mariam.id, 10500, 'bid');  // ...then Mariam takes the lead one increment above
  console.log('[db] seeded 2 demo auctions with proxy-bid history');
}
seedAuctions();

module.exports = {
  db, DB_PATH, BRANDS, CONDITIONS, CURRENCIES, LISTING_STATUSES, OFFER_STATUSES, CITIES,
  SALE_TYPES, AUCTION_DURATIONS, futureDate, hashPassword, verifyPassword,
};
