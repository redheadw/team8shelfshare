INSERT INTO categories (name, description)
VALUES
    ('Electronics', 'Electronic devices and accessories'),
    ('Tools', 'Tools and equipment for projects and repairs'),
    ('Books', 'Books, novels, and educational materials'),
    ('Sports', 'Sports equipment and outdoor activities'),
    ('Home & Kitchen', 'Household and kitchen items'),
    ('Other', 'Items that do not fit into other categories')
ON CONFLICT (name) DO NOTHING;

-- verefique
SELECT id, name, description
FROM categories
ORDER BY id;