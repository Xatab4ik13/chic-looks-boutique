import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import heroMain from "@/assets/hero-main.jpg";
import heroSlide2 from "@/assets/hero-slide-2.jpg";
import heroSlide3 from "@/assets/hero-slide-3.jpg";

const slides = [{
  image: heroMain,
  title: "Новая коллекция",
  subtitle: "Весна 2026"
}, {
  image: heroSlide2,
  title: "Платья",
  subtitle: "Элегантность в деталях"
}, {
  image: heroSlide3,
  title: "Корсеты",
  subtitle: "Изысканный силуэт"
}];
const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const {
    scrollYProgress
  } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  // Auto-slide
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isAnimating) {
        setIsAnimating(true);
        setCurrentSlide(prev => (prev + 1) % slides.length);
        setTimeout(() => setIsAnimating(false), 1200);
      }
    }, 6000);
    return () => clearInterval(timer);
  }, [isAnimating]);
  const currentData = slides[currentSlide];

  // Split text animation for title
  const titleChars = currentData.title.split("");
  return <section ref={containerRef} className="relative h-screen min-h-[700px] overflow-hidden bg-background">
      {/* Animated background images */}
      <AnimatePresence mode="wait">
        <motion.div key={currentSlide} className="absolute inset-0" initial={{
        scale: 1.1,
        opacity: 0
      }} animate={{
        scale: 1,
        opacity: 1
      }} exit={{
        scale: 1.05,
        opacity: 0
      }} transition={{
        duration: 1.2,
        ease: [0.43, 0.13, 0.23, 0.96]
      }} style={{
        y,
        scale
      }}>
          <img src={currentData.image} alt={currentData.title} className="w-full h-full object-cover" />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/20" />
        </motion.div>
      </AnimatePresence>

      {/* Decorative elements */}
      <motion.div className="absolute top-20 right-20 w-64 h-64 bg-accent/30 morph-blob blur-3xl" animate={{
      x: [0, 30, 0],
      y: [0, -20, 0]
    }} transition={{
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut"
    }} />
      <motion.div className="absolute bottom-40 left-20 w-48 h-48 bg-primary/40 morph-blob blur-2xl" animate={{
      x: [0, -20, 0],
      y: [0, 30, 0]
    }} transition={{
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 1
    }} />

      {/* Content */}
      <motion.div className="relative h-full container mx-auto flex items-center" style={{
      opacity
    }}>
        <div className="max-w-2xl">
          {/* Subtitle */}
          <motion.div key={`subtitle-${currentSlide}`} initial={{
          opacity: 0,
          x: -30
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.6,
          delay: 0.3
        }} className="overflow-hidden mb-6">
            <div className="flex items-center gap-4">
              <motion.div className="h-px bg-foreground" initial={{
              width: 0
            }} animate={{
              width: 60
            }} transition={{
              duration: 0.8,
              delay: 0.5
            }} />
              <span className="text-sm tracking-[0.3em] uppercase font-medium text-muted-foreground">
                {currentData.subtitle}
              </span>
            </div>
          </motion.div>

          {/* Main Title with character animation */}
          <div className="overflow-hidden mb-8">
            <motion.h1 key={`title-${currentSlide}`} className="font-serif text-5xl md:text-7xl lg:text-8xl leading-none">
              {titleChars.map((char, index) => <motion.span key={index} className="inline-block" initial={{
              y: 120,
              opacity: 0,
              rotateX: -80
            }} animate={{
              y: 0,
              opacity: 1,
              rotateX: 0
            }} transition={{
              duration: 0.8,
              delay: 0.4 + index * 0.03,
              ease: [0.43, 0.13, 0.23, 0.96]
            }}>
                  {char === " " ? "\u00A0" : char}
                </motion.span>)}
            </motion.h1>
          </div>

          {/* Brand */}
          <motion.div key={`brand-${currentSlide}`} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.8
        }} className="mb-10">
            <span className="font-serif text-2xl md:text-3xl tracking-[0.3em] text-foreground/70">
              VOX
            </span>
          </motion.div>

          {/* CTA Button */}
          <motion.div key={`cta-${currentSlide}`} initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 1
        }}>
            <Link to="/catalog" className="group inline-flex items-center gap-4">
              <span className="btn-primary">
                Смотреть каталог
              </span>
              <motion.span className="w-12 h-12 border border-foreground flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all duration-300" whileHover={{
              scale: 1.1
            }}>
                <ArrowRight className="w-5 h-5" />
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Slide indicators */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-4">
        {slides.map((_, index) => <button key={index} onClick={() => {
        if (!isAnimating) {
          setIsAnimating(true);
          setCurrentSlide(index);
          setTimeout(() => setIsAnimating(false), 1200);
        }
      }} className="relative w-12 h-1 bg-foreground/20 overflow-hidden">
            <motion.div className="absolute inset-0 bg-foreground" initial={{
          scaleX: 0
        }} animate={{
          scaleX: currentSlide === index ? 1 : 0
        }} transition={{
          duration: currentSlide === index ? 6 : 0.3
        }} style={{
          transformOrigin: "left"
        }} />
          </button>)}
      </div>

      {/* Scroll Indicator */}
      <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      delay: 1.5
    }} className="absolute bottom-10 right-10 hidden lg:flex flex-col items-center gap-2">
        <span className="text-xs tracking-widest uppercase text-muted-foreground rotate-90 origin-center mb-8">
          Scroll
        </span>
        <motion.div animate={{
        y: [0, 8, 0]
      }} transition={{
        repeat: Infinity,
        duration: 1.5
      }}>
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </motion.div>

      {/* Vertical text decoration */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden lg:block">
        
      </div>
    </section>;
};
export default Hero;