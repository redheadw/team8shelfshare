-- ShelfShare demo data. Run after schema.sql.
-- Fixed ids make the demo predictable; the borrower id matches
-- DEMO_BORROWER_ID in lib/demo-user.ts until Auth.js sign-in is merged.
-- In the Neon/Vercel query editor, run each INSERT statement on its own.

INSERT INTO users (id, name, email, neighborhood, bio) VALUES
  ('11111111-1111-4111-8111-111111111111', 'Ada Okafor',  'ada@example.com',  'Lake Valley North', 'Weekend gardener and DIY fan.'),
  ('22222222-2222-4222-8222-222222222222', 'Ben Morales', 'ben@example.com',  'Lake Valley South', 'Happy to lend my camping gear.'),
  ('33333333-3333-4333-8333-333333333333', 'Chloe Park',  'chloe@example.com', 'Lake Valley East', 'Bookworm and baker.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO categories (name, description) VALUES
  ('Tools',   'Drills, ladders, and other tools'),
  ('Camping', 'Tents, sleeping bags, and outdoor gear'),
  ('Books',   'Novels, cookbooks, and guides'),
  ('Kitchen', 'Mixers, slow cookers, and bakeware')
ON CONFLICT (name) DO NOTHING;

INSERT INTO items (id, owner_id, category_id, title, description, condition) VALUES
  ('aaaaaaaa-0000-4000-8000-000000000001', '22222222-2222-4222-8222-222222222222', (SELECT id FROM categories WHERE name = 'Camping'), '4-Person Tent',        'Easy to set up, includes stakes.',       'good'),
  ('aaaaaaaa-0000-4000-8000-000000000002', '22222222-2222-4222-8222-222222222222', (SELECT id FROM categories WHERE name = 'Tools'),   'Cordless Drill',       'Two batteries and a set of bits.',       'new'),
  ('aaaaaaaa-0000-4000-8000-000000000003', '33333333-3333-4333-8333-333333333333', (SELECT id FROM categories WHERE name = 'Kitchen'), 'Stand Mixer',          'Comes with dough hook and whisk.',       'fair'),
  ('aaaaaaaa-0000-4000-8000-000000000004', '33333333-3333-4333-8333-333333333333', (SELECT id FROM categories WHERE name = 'Books'),   'Nigerian Cookbook',    'Jollof, egusi, and more.',               'worn'),
  ('aaaaaaaa-0000-4000-8000-000000000005', '11111111-1111-4111-8111-111111111111', (SELECT id FROM categories WHERE name = 'Tools'),   'Folding Ladder',       'Ada''s own item, so Ada cannot borrow it.', 'good')
ON CONFLICT (id) DO NOTHING;

INSERT INTO borrow_requests (item_id, borrower_id, start_date, due_date, message, status) VALUES
  ('aaaaaaaa-0000-4000-8000-000000000003', '11111111-1111-4111-8111-111111111111', CURRENT_DATE + 3, CURRENT_DATE + 5, 'Baking for a birthday party!', 'approved'),
  ('aaaaaaaa-0000-4000-8000-000000000004', '11111111-1111-4111-8111-111111111111', CURRENT_DATE - 20, CURRENT_DATE - 6, NULL, 'returned');
