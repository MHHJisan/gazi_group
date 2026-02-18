-- Add phone_code column to users table
ALTER TABLE public.users ADD COLUMN phone_code VARCHAR(10);

-- Add comment for clarity
COMMENT ON COLUMN public.users.phone_code IS 'Country code for phone number (e.g., +1, +44, +880)';
