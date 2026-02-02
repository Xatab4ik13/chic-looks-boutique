import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { products } from "@/data/products";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <CartDrawer />

      {/* Hero Section with Static Banner + 2 Small Banners */}
      <Hero />

      {/* About Brand Section */}
      <section className="py-20 md:py-32 bg-secondary">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 md:order-1"
            >
              <p className="text-muted-foreground text-sm tracking-wider uppercase mb-4">
                О бренде
              </p>
              <h2 className="font-serif text-2xl md:text-3xl mb-6">
                VOX — голос вашего стиля
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Мы создаём одежду для современных женщин, которые ценят качество,
                элегантность и уникальность. Каждая вещь VOX — это сочетание классических
                силуэтов и современных тенденций.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Наши изделия производятся в России с использованием премиальных тканей
                и традиций высокого мастерства.
              </p>
              <Link to="/about" className="btn-ghost">
                Узнать больше
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 md:order-2"
            >
              <div className="relative">
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={products[2].image}
                    alt="About VOX"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Decorative element */}
                <motion.div
                  className="absolute -bottom-6 -left-6 w-32 h-32 border border-foreground/20 -z-10"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Instagram Section - Text Only */}
      <section className="py-20 md:py-32 bg-background">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-muted-foreground text-sm tracking-wider uppercase mb-4">
              Следите за нами
            </p>
            <a
              href="https://www.instagram.com/vox_alisalanskaja/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-4 group"
            >
              <Instagram className="w-8 h-8 text-foreground/70 group-hover:text-foreground transition-colors" />
              <span className="text-lg md:text-xl tracking-wider uppercase group-hover:text-foreground/70 transition-colors">
                @vox_alisalanskaja
              </span>
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
