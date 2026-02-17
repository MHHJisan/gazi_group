-- Create users table for user management
CREATE TABLE IF NOT EXISTS public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'user')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  phone VARCHAR(20),
  department VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at);

-- Set up Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public insert" ON public.users;
DROP POLICY IF EXISTS "Allow public select" ON public.users;
DROP POLICY IF EXISTS "Allow update own profile" ON public.users;
DROP POLICY IF EXISTS "Allow delete own profile" ON public.users;

-- Create new policies for users table
-- Allow anyone to insert users (for user registration)
CREATE POLICY "Allow public insert" ON public.users
  FOR INSERT WITH CHECK (true);

-- Allow anyone to read users (public user list)
CREATE POLICY "Allow public select" ON public.users
  FOR SELECT USING (true);

-- Allow users to update their own profile
CREATE POLICY "Allow update own profile" ON public.users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Allow users to delete their own profile
CREATE POLICY "Allow delete own profile" ON public.users
  FOR DELETE USING (auth.uid()::text = id::text OR auth.jwt() ->> 'role' = 'admin');

-- Grant necessary permissions
GRANT ALL ON public.users TO authenticated;
GRANT SELECT ON public.users TO anon;
