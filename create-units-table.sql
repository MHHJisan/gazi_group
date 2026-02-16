-- Create units table
CREATE TABLE IF NOT EXISTS units (
  id serial PRIMARY KEY,
  entity_id integer NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  created_at timestamp DEFAULT NOW(),
  updated_at timestamp DEFAULT NOW()
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_units_entity_id ON units(entity_id);

-- Add sample unit if entities exist
INSERT INTO units (entity_id, name, description)
SELECT e.id, 'Main Office', 'Primary business location'
FROM entities e 
WHERE NOT EXISTS (SELECT 1 FROM units LIMIT 1)
LIMIT 1;
