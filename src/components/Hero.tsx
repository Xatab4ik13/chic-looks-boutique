import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";

import dressBurgundy from "@/assets/products/dress-burgundy.jpg";
import dressRed from "@/assets/products/dress-red.jpg";

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen min-h-[700px] overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <motion.div className="absolute inset-0" style={{ y, scale }}>
        <img
          src={dressBurgundy}
          alt="VOX Collection"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/20 via-transparent to-foreground/60" />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative h-full flex flex-col items-center justify-center text-center px-6"
        style={{ opacity }}
      >
        {/* Animated Title */}
        <div className="overflow-hidden mb-4">
          <motion.p
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-background/80 text-sm tracking-[0.3em] uppercase"
          >
            Russian brand
          </motion.p>
        </div>

        <div className="overflow-hidden mb-6">
          <motion.h1
            initial={{ y: 150 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-serif text-6xl md:text-8xl lg:text-9xl text-background tracking-[0.15em]"
          >
            VOX
          </motion.h1>
        </div>

        <div className="overflow-hidden mb-12">
          <motion.p
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-background/80 text-lg md:text-xl font-serif italic"
          >
            Новая коллекция
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Link
            to="/catalog"
            className="px-10 py-4 bg-background text-foreground font-medium tracking-wider uppercase text-sm hover:bg-background/90 transition-colors"
          >
            Смотреть каталог
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-background"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ArrowDown className="w-5 h-5" />
        </motion.div>
      </motion.div>

      {/* Floating Elements */}
      <motion.div
        className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="w-48 h-64 overflow-hidden">
          <motion.img
            src={dressRed}
            alt="Featured"
            className="w-full h-full object-cover"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
