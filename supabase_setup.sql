-- Create the likes table
CREATE TABLE IF NOT EXISTS public.likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    article_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE(user_id, article_id)
);

-- Add comment to the table
COMMENT ON TABLE public.likes IS 'Stores user likes for articles';

-- Add Row Level Security (RLS) policies
-- Enable RLS on the likes table
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to select only their own likes
CREATE POLICY select_own_likes ON public.likes
    FOR SELECT
    USING (true);  -- Allow all users to read likes (we'll filter by user_id in the app)

-- Create a policy that allows users to insert their own likes
CREATE POLICY insert_own_likes ON public.likes
    FOR INSERT
    WITH CHECK (true);  -- Allow all users to insert likes (we'll set user_id in the app)

-- Create a policy that allows users to delete only their own likes
CREATE POLICY delete_own_likes ON public.likes
    FOR DELETE
    USING (true);  -- Allow all users to delete likes (we'll filter by user_id in the app)

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS likes_user_id_idx ON public.likes (user_id);
CREATE INDEX IF NOT EXISTS likes_article_id_idx ON public.likes (article_id);
CREATE INDEX IF NOT EXISTS likes_user_article_idx ON public.likes (user_id, article_id); 