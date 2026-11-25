-- ShelfShare demo data. Run after schema.sql.
-- In the Neon/Vercel query editor, run each INSERT statement on its own.
-- Safe to re-run: rows that already exist are skipped.
--
-- The demo users own the demo items but can't sign in: their password_hash is
-- a bcrypt hash of a random throwaway value (the column is NOT NULL). To try
-- the feature, sign in with your own account and request one of their items
-- at /dashboard/requests.
--
-- Categories are not inserted: the shared database already has Electronics,
-- Tools, Books, Sports, Home & Kitchen, and Other.

INSERT INTO users (id, name, email, password_hash, neighborhood, bio) VALUES
  ('11111111-1111-4111-8111-111111111111', 'Ada Okafor',  'ada@example.com',   '$2b$10$g.IymQTEQn4RW39OUlk9JeSvWTsCK7lsplwjqEiChR.TwYURj4Elm', 'Lake Valley North', 'Weekend gardener and DIY fan.'),
  ('22222222-2222-4222-8222-222222222222', 'Ben Morales', 'ben@example.com',   '$2b$10$g.IymQTEQn4RW39OUlk9JeSvWTsCK7lsplwjqEiChR.TwYURj4Elm', 'Lake Valley South', 'Happy to lend my camping gear.'),
  ('33333333-3333-4333-8333-333333333333', 'Chloe Park',  'chloe@example.com', '$2b$10$g.IymQTEQn4RW39OUlk9JeSvWTsCK7lsplwjqEiChR.TwYURj4Elm', 'Lake Valley East',  'Bookworm and baker.')
ON CONFLICT DO NOTHING;

INSERT INTO items (id, owner_id, category_id, title, description, condition) VALUES
  ('aaaaaaaa-0000-4000-8000-000000000001', '22222222-2222-4222-8222-222222222222', (SELECT id FROM categories WHERE name = 'Sports'),         '4-Person Tent',     'Easy to set up, includes stakes.',  'good'),
  ('aaaaaaaa-0000-4000-8000-000000000002', '22222222-2222-4222-8222-222222222222', (SELECT id FROM categories WHERE name = 'Tools'),          'Cordless Drill',    'Two batteries and a set of bits.',  'new'),
  ('aaaaaaaa-0000-4000-8000-000000000003', '33333333-3333-4333-8333-333333333333', (SELECT id FROM categories WHERE name = 'Home & Kitchen'), 'Stand Mixer',       'Comes with dough hook and whisk.',  'fair'),
  ('aaaaaaaa-0000-4000-8000-000000000004', '33333333-3333-4333-8333-333333333333', (SELECT id FROM categories WHERE name = 'Books'),          'Nigerian Cookbook', 'Jollof, egusi, and more.',          'worn'),
  ('aaaaaaaa-0000-4000-8000-000000000005', '11111111-1111-4111-8111-111111111111', (SELECT id FROM categories WHERE name = 'Tools'),          'Folding Ladder',    'Six feet tall, folds flat.',        'good')
ON CONFLICT (id) DO NOTHING;
