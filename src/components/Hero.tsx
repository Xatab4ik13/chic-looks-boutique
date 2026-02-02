import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroMain from "@/assets/hero-main.jpg";
import heroSlide2 from "@/assets/hero-slide-2.jpg";
import heroSlide3 from "@/assets/hero-slide-3.jpg";

const Hero = () => {
  return (
    <section className="pt-20">
      {/* Main Hero Banner */}
      <div className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        <img
          src={heroMain}
          alt="Новая коллекция"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-background/20 to-transparent" />
        
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-xl"
            >
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-foreground mb-6">
                Новая
                <br />
                коллекция
              </h1>
              <Link
                to="/catalog"
                className="inline-flex items-center gap-3 btn-primary"
              >
                Смотреть каталог
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Two Small Banners */}
      <div className="container mx-auto py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Catalog Banner */}
          <Link to="/catalog" className="group relative overflow-hidden aspect-[4/3] md:aspect-[16/9]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="h-full"
            >
              <img
                src={heroSlide2}
                alt="Каталог"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 md:p-8">
                <h3 className="font-serif text-2xl md:text-3xl text-background mb-2">
                  Каталог
                </h3>
                <span className="text-xs tracking-wider uppercase text-background/80 flex items-center gap-2 group-hover:gap-3 transition-all">
                  Смотреть
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </motion.div>
          </Link>

          {/* Sale Banner */}
          <Link to="/catalog?sale=true" className="group relative overflow-hidden aspect-[4/3] md:aspect-[16/9]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="h-full"
            >
              <img
                src={heroSlide3}
                alt="Скидки"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 md:p-8">
                <h3 className="font-serif text-2xl md:text-3xl text-background mb-2">
                  Скидки
                </h3>
                <span className="text-xs tracking-wider uppercase text-background/80 flex items-center gap-2 group-hover:gap-3 transition-all">
                  Смотреть
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </motion.div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
