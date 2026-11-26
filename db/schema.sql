-- ShelfShare database schema (PostgreSQL / Neon)
-- Matches the data model the team agreed on in the Week 03 meeting.
-- Safe to re-run: every table is created only if it does not exist yet.
-- In the Neon/Vercel query editor, run each CREATE statement on its own.
--
-- users, categories, and items already exist on the shared Neon database
-- (created with the Auth.js work in #10); the definitions below match those
-- live tables. On the shared database, only borrow_requests needs creating.

CREATE EXTENSION IF NOT EXISTS pgcrypto; -- provides gen_random_uuid()

-- People who lend and borrow (used by the Auth.js register and login code).
CREATE TABLE IF NOT EXISTS users (
  id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT         NOT NULL,
  neighborhood  VARCHAR(100) NOT NULL DEFAULT 'Lake Valley',
  bio           TEXT,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS categories (
  id          SERIAL      PRIMARY KEY,
  name        VARCHAR(50) NOT NULL UNIQUE,
  description TEXT
);

-- Things people list to lend. deleted_at is the soft delete (issue #3).
CREATE TABLE IF NOT EXISTS items (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id     UUID         NOT NULL REFERENCES users(id),
  category_id  INT          NOT NULL REFERENCES categories(id),
  title        VARCHAR(120) NOT NULL,
  description  TEXT,
  condition    VARCHAR(20)  NOT NULL
               CHECK (condition IN ('new', 'good', 'fair', 'worn')),
  image_url    TEXT,
  is_available BOOLEAN      NOT NULL DEFAULT true,
  deleted_at   TIMESTAMPTZ,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- A borrower asking an owner to borrow an item (issues #5 and #6).
-- The owner is found through the item, so it is not stored twice.
CREATE TABLE IF NOT EXISTS borrow_requests (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id     UUID        NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  borrower_id UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_date  DATE        NOT NULL,
  due_date    DATE        NOT NULL,
  message     TEXT,
  status      VARCHAR(20) NOT NULL DEFAULT 'pending'
              CHECK (status IN ('pending', 'approved', 'declined', 'returned', 'cancelled')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (due_date >= start_date)
);
