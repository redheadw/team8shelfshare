-- ShelfShare: categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- ShelfShare: items table
CREATE TABLE IF NOT EXISTS items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES users(id),
    category_id INTEGER NOT NULL REFERENCES categories(id),
    title VARCHAR(150) NOT NULL,
    description TEXT,
    condition VARCHAR(20) NOT NULL
        CHECK (condition IN ('new', 'good', 'fair', 'worn')),
    image_url TEXT,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_items_owner_id
    ON items(owner_id);

CREATE INDEX IF NOT EXISTS idx_items_category_id
    ON items(category_id);

CREATE INDEX IF NOT EXISTS idx_items_available
    ON items(is_available)
    WHERE deleted_at IS NULL;

--Review and verifeque the result
SELECT
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('categories', 'items')
ORDER BY table_name, ordinal_position;