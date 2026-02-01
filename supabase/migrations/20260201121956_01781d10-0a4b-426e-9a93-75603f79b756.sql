-- Create table for Instagram posts
CREATE TABLE public.instagram_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  caption TEXT,
  post_url TEXT,
  posted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.instagram_posts ENABLE ROW LEVEL SECURITY;

-- Allow public read access (posts are public content)
CREATE POLICY "Instagram posts are viewable by everyone" 
ON public.instagram_posts 
FOR SELECT 
USING (true);

-- Enable realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.instagram_posts;