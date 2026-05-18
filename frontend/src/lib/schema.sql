-- First Lutheran Church of Miami — PostgreSQL schema
-- Generic JSONB for flexible fields (mirrors prior MongoDB document shape)

CREATE TABLE IF NOT EXISTS events (
  id            TEXT PRIMARY KEY,
  title         TEXT NOT NULL,
  description   TEXT DEFAULT '',
  date          TEXT,
  time          TEXT,
  location      TEXT,
  type          TEXT,
  pastor        TEXT,
  image         TEXT,
  created_at    TEXT,
  updated_at    TEXT,
  extra         JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS event_registrations (
  id              TEXT PRIMARY KEY,
  event_title     TEXT,
  name            TEXT,
  email           TEXT,
  phone           TEXT,
  notes           TEXT,
  status          TEXT DEFAULT 'confirmed',
  created_at      TEXT,
  extra           JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS contact_forms (
  id            TEXT PRIMARY KEY,
  name          TEXT,
  email         TEXT,
  phone         TEXT,
  subject       TEXT,
  message       TEXT,
  status        TEXT DEFAULT 'received',
  created_at    TEXT,
  extra         JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS donations (
  id                TEXT PRIMARY KEY,
  amount            NUMERIC,
  donor_name        TEXT,
  donor_email       TEXT,
  message           TEXT,
  payment_method    TEXT,
  status            TEXT DEFAULT 'pending',
  paypal_order_id   TEXT,
  transaction_id    TEXT,
  created_at        TEXT,
  completed_at      TEXT,
  updated_at        TEXT,
  extra             JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS gallery (
  id          TEXT PRIMARY KEY,
  title       TEXT,
  image_url   TEXT,
  caption     TEXT,
  category    TEXT,
  created_at  TEXT,
  updated_at  TEXT,
  extra       JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS media (
  id              TEXT PRIMARY KEY,
  title           TEXT,
  type            TEXT,
  speaker         TEXT,
  scripture       TEXT,
  description     TEXT,
  file_url        TEXT,
  thumbnail_url   TEXT,
  duration        TEXT,
  date            TEXT,
  created_at      TEXT,
  updated_at      TEXT,
  extra           JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS site_content (
  id          TEXT PRIMARY KEY,
  key         TEXT,
  value       TEXT,
  page        TEXT,
  notes       TEXT,
  created_at  TEXT,
  updated_at  TEXT,
  extra       JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_reg_created ON event_registrations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_forms(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_donations_created ON donations(created_at DESC);
