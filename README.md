# Watches Hub — Peer-to-Peer Watch Marketplace

A complete bilingual (English / العربي) marketplace where collectors sell
watches directly to each other — like the car classifieds, but for timepieces.
No build step, no frameworks, no external paid services — just Node.js +
Express 4 + better-sqlite3 and a hand-written vanilla JS single-page app with
hash routing.

## Features

**Marketplace**
- Register / sign in (scrypt-hashed passwords, signed httpOnly cookies)
- Post a watch in minutes: up to 5 photos, brand, year, condition, price in
  10 currencies, negotiable flag, free-text description
- Browse with live search, brand / condition filters and price sorting
- Listing pages with photo gallery, spec table, seller card (member since,
  active listings) and "more from this seller"
- Negotiation offers: buyers name their price on any listing; sellers answer
  from a separate offers inbox (accept / reject), buyers track and withdraw
  from "Offers sent". One pending offer per listing — no spam bidding
- Timed auctions with Bid4U-style proxy bidding (AutoBidMaster workflow):
  sellers pick Sale type = Auction, set a starting price, duration (1/3/5/7
  days) and an optional hidden reserve; buyers enter a MAXIMUM bid and the
  system auto-bids the smallest increment needed to keep them on top — you
  often win below your max. Outbid badge on My bids, live countdown, public
  bid history with masked names, anti-sniping (a bid in the last 2 minutes
  extends the clock by 2 minutes), binding bids, no bidding on your own
  listing. Reserve not met at the end → the seller reviews the high bid as a
  regular offer ("On Minimum Bid" style); reserve met → the high bidder wins
  and the watch is marked sold
- Private buyer–seller chat per listing, with unread badges, 4-second live
  polling and a listing context bar inside each thread
- Favorites: heart on every card and listing page, saved under My account →
  Favorites
- City on every listing (UAE emirates + Other GCC) with a city filter and
  popular-brand quick chips on the browse page
- Masked contact details: the seller's phone number is never in the page
  payload — signed-in buyers reveal it (and a WhatsApp link) with one click
- Trust & safety: safety-tips box on every listing, one-click report listing
  (reviewed in the admin panel), share button, listing ID, time-ago stamps
  and photo-count badges on cards
- My account: my listings (edit, mark sold, reactivate, delete), offers
  received, offers sent, messages, favorites — with live badge counts in
  the header
- Fully bilingual EN/AR with عربي/EN toggle — every string translated, full
  RTL layout (Amiri font), language remembered in localStorage
- Floating chat assistant on every page: bilingual, rule-based (no AI API),
  explains selling / offers / safety and searches the live listings

**Admin panel** (`/#/admin`)
- Separate admin login (env-configured credentials, signed 12 h cookie)
- Listings moderation (remove / restore), user directory with listing
  counts, full offers overview, reported-listings queue

## Tech

- Node.js 22 + Express 4.21 + better-sqlite3 (exact pins, no other deps)
- Vanilla HTML/CSS/JS SPA, hash routing, no build step
- SQLite database at `data/watcheshub.db` — created and seeded on first run
  (3 demo users, 14 fixed-price listings + 2 live demo auctions with bid
  history, 1 offer, 1 conversation)
- Lightweight migrations: `PRAGMA table_info` + conditional `ALTER TABLE`
- Photos uploaded as base64 → saved to `public/images/listings/`

## Demo logins (seeded)

| Email | Password |
|---|---|
| seller@watcheshub.demo | demo1234 |
| mariam@watcheshub.demo | demo1234 |
| khalid@watcheshub.demo | demo1234 |

## Run locally

```bash
npm install
npm start          # http://localhost:3000
```

## Environment variables

| Var | Default | Purpose |
|---|---|---|
| `PORT` | `3000` | HTTP port |
| `ADMIN_USERNAME` | `admin` | Admin panel username |
| `ADMIN_PASSWORD` | `jiwan2026` | Admin panel password — **change in production** |
| `SESSION_SECRET` | dev value | Cookie HMAC secret — **set in production** |

## Deploy on Render (free)

The repo ships a `render.yaml` Blueprint and a `Dockerfile`:

1. Push this folder to a GitHub repo.
2. Render → New → Blueprint → pick the repo. Render reads `render.yaml`
   (`runtime: docker`, free plan, auto-deploy on push).
3. Set the env vars marked `sync: false` (`ADMIN_PASSWORD`, `SESSION_SECRET`)
   in the Render dashboard when prompted.

The Dockerfile builds with **pnpm** (via corepack) instead of npm: npm
crashes with `Exit handler never called!` on Node 22/24 inside hosted
builders (npm/cli#8974). If you ever switch back to npm, use
`FROM node:20-slim` — Node 20 is unaffected.

**Note on the free tier:** the SQLite file lives on the container's
ephemeral disk, so the database reseeds on every deploy/restart. For
persistent data, attach a Render Disk and point `DB_PATH` at it.
