import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { products } from "@/data/products";

interface InstagramPost {
  id: string;
  image_url: string;
  caption: string | null;
  post_url: string | null;
  posted_at: string | null;
}

const InstagramGallery = () => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPosts();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('instagram_posts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'instagram_posts',
        },
        (payload) => {
          console.log('New Instagram post:', payload);
          setPosts((prev) => [payload.new as InstagramPost, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('instagram_posts')
        .select('*')
        .order('posted_at', { ascending: false })
        .limit(8);

      if (error) {
        console.error('Error fetching posts:', error);
      } else {
        setPosts(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Use product images as fallback if no Instagram posts yet
  const displayItems = posts.length > 0 
    ? posts.map((post) => ({
        id: post.id,
        image: post.image_url,
        link: post.post_url,
      }))
    : products.slice(0, 8).map((product) => ({
        id: product.id,
        image: product.image,
        link: null,
      }));

  const handleClick = (link: string | null) => {
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      window.open('https://instagram.com/vox_alisalanskaja', '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-muted-foreground text-sm tracking-wider uppercase mb-2">
            Следите за нами
          </p>
          <h2 className="font-serif text-3xl md:text-5xl">@vox_alisalanskaja</h2>
          {posts.length > 0 && (
            <p className="text-muted-foreground text-sm mt-2">
              Последние посты из Instagram
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {displayItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="aspect-square overflow-hidden group cursor-pointer"
              onClick={() => handleClick(item.link)}
            >
              <img
                src={item.image}
                alt=""
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <a
            href="https://instagram.com/vox_alisalanskaja"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex items-center gap-2"
          >
            Подписаться в Instagram
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default InstagramGallery;
