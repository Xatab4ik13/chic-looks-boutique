import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

// Use public folder paths for instant preloading via index.html
const heroMain = "/images/hero-main.jpg";
const heroSlide2 = "/images/hero-slide-2.jpg";
const heroSlide3 = "/images/hero-slide-3.jpg";

const HeroImage = ({ 
  src, 
  alt, 
  priority = false,
  className = ""
}: { 
  src: string; 
  alt: string; 
  priority?: boolean;
  className?: string;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full h-full">
      {!isLoaded && !hasError && (
        <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        } ${className}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
      />
    </div>
  );
};

const Hero = () => {
  return (
    <section>
      {/* Main Hero Banner - Full screen */}
      <Link to="/catalog?filter=new" className="block relative h-screen overflow-hidden group">
        <HeroImage
          src={heroMain}
          alt="Новая коллекция"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />
        
        <div className="absolute inset-0 flex items-end justify-center pb-16 md:pb-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-xl md:text-2xl lg:text-3xl text-background font-light tracking-[0.3em] uppercase"
          >
            Новая коллекция
          </motion.h1>
        </div>
      </Link>

      {/* Two Horizontal Banners */}
      <div className="container mx-auto py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Catalog Banner */}
          <Link to="/catalog" className="group relative overflow-hidden aspect-[4/5]">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="h-full"
            >
              <HeroImage
                src={heroSlide2}
                alt="Каталог"
                className="transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-end justify-center pb-8 md:pb-12">
                <h3 className="font-serif text-lg md:text-xl lg:text-2xl text-background font-light tracking-[0.3em] uppercase">
                  Каталог
                </h3>
              </div>
            </motion.div>
          </Link>

          {/* Sale Banner */}
          <Link to="/catalog?filter=sale" className="group relative overflow-hidden aspect-[4/5]">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="h-full"
            >
              <HeroImage
                src={heroSlide3}
                alt="Скидки"
                className="transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-end justify-center pb-8 md:pb-12">
                <h3 className="font-serif text-lg md:text-xl lg:text-2xl text-background font-light tracking-[0.3em] uppercase">
                  Скидки
                </h3>
              </div>
            </motion.div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
