-- Run these SQL commands in your Supabase SQL Editor to set up the database

-- 1. Add address column to entities table
ALTER TABLE entities ADD COLUMN IF NOT EXISTS address text;

-- 2. Create units table for sub-entities
CREATE TABLE IF NOT EXISTS units (
  id serial PRIMARY KEY,
  entity_id integer NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  created_at timestamp DEFAULT NOW(),
  updated_at timestamp DEFAULT NOW()
);

-- 3. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_units_entity_id ON units(entity_id);

-- 4. Update existing entities to have a default address if needed (optional)
UPDATE entities SET address = 'No address provided' WHERE address IS NULL;
