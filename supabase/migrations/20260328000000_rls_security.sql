-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles: Select Policy
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Profiles: Update Policy
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Profiles: Insert Policy (Usually handled by triggers on user creation, but included for completeness)
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Prevent unauthorized execution of the vector match RPC
-- First, revoke execution from anon/public
REVOKE EXECUTE ON FUNCTION public.match_articles FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.match_articles FROM anon;

-- Then explicitly grant to authenticated users
GRANT EXECUTE ON FUNCTION public.match_articles TO authenticated;
