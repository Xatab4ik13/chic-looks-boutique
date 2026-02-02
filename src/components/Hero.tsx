import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroMain from "@/assets/hero-main.jpg";
import heroSlide2 from "@/assets/hero-slide-2.jpg";
import heroSlide3 from "@/assets/hero-slide-3.jpg";

const Hero = () => {
  return (
    <section>
      {/* Main Hero Banner - Full screen */}
      <div className="relative h-screen overflow-hidden">
        <img
          src={heroMain}
          alt="Новая коллекция"
          className="w-full h-full object-cover"
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
      </div>

      {/* Two Vertical Banners */}
      <div className="flex flex-col">
        {/* Catalog Banner */}
        <Link to="/catalog" className="group relative overflow-hidden h-[70vh]">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="h-full"
          >
            <img
              src={heroSlide2}
              alt="Каталог"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-end justify-center pb-16 md:pb-20">
              <h3 className="font-serif text-xl md:text-2xl lg:text-3xl text-background font-light tracking-[0.3em] uppercase">
                Каталог
              </h3>
            </div>
          </motion.div>
        </Link>

        {/* Sale Banner */}
        <Link to="/catalog?sale=true" className="group relative overflow-hidden h-[70vh]">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="h-full"
          >
            <img
              src={heroSlide3}
              alt="Скидки"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-end justify-center pb-16 md:pb-20">
              <h3 className="font-serif text-xl md:text-2xl lg:text-3xl text-background font-light tracking-[0.3em] uppercase">
                Скидки
              </h3>
            </div>
          </motion.div>
        </Link>
      </div>
    </section>
  );
};

export default Hero;
