-- Add missing columns to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password VARCHAR(255);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone_code VARCHAR(10);

-- Add comments for clarity
COMMENT ON COLUMN public.users.password IS 'User password (for local authentication)';
COMMENT ON COLUMN public.users.phone_code IS 'Country code for phone number (e.g., +1, +44, +880)';
