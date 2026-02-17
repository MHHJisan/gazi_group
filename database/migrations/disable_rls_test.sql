-- Temporarily disable RLS for testing
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Test delete without RLS restrictions
-- This will help us identify if the issue is with RLS or something else
