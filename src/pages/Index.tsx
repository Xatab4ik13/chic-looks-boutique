import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
import Footer from "@/components/Footer";
import { products, categories } from "@/data/products";

const Index = () => {
  const newProducts = products.filter((p) => p.isNew);
  const featuredCategories = categories.slice(0, 4);

  return (
    <div className="min-h-screen">
      <Header />
      <CartDrawer />

      {/* Hero Section */}
      <Hero />

      {/* Marquee */}
      <section className="py-4 bg-foreground text-background overflow-hidden">
        <div className="animate-marquee flex whitespace-nowrap">
          {[...Array(10)].map((_, i) => (
            <span
              key={i}
              className="mx-8 text-sm tracking-[0.3em] uppercase font-medium"
            >
              Новая коллекция • Доставка по России • Качество премиум класса •
            </span>
          ))}
        </div>
      </section>

      {/* Categories Grid - Dew background */}
      <section className="py-20 md:py-32 bg-secondary">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <p className="text-muted-foreground text-sm tracking-wider uppercase mb-2">
                Коллекции
              </p>
              <h2 className="font-serif text-3xl md:text-5xl">Категории</h2>
            </div>
            <Link
              to="/catalog"
              className="hidden md:flex items-center gap-2 text-sm tracking-wider uppercase hover:gap-4 transition-all"
            >
              Все категории
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featuredCategories.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                index={index}
              />
            ))}
          </div>

          <div className="mt-8 md:hidden">
            <Link to="/catalog" className="btn-secondary w-full flex items-center justify-center gap-2">
              Все категории
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Image Section */}
      <section className="relative h-[80vh] overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          <img
            src={products[1].image}
            alt="Featured"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/30 to-transparent" />
        </motion.div>

        <div className="relative h-full container mx-auto flex items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-lg text-background"
          >
            <p className="text-sm tracking-wider uppercase mb-4 text-background/70">
              Специальное предложение
            </p>
            <h2 className="font-serif text-4xl md:text-6xl mb-6">
              Корсеты и топы
            </h2>
            <p className="text-background/80 mb-8 leading-relaxed">
              Изысканные корсеты ручной работы. Каждая модель — произведение искусства,
              подчеркивающее вашу индивидуальность.
            </p>
            <Link
              to="/catalog/corsets"
              className="inline-flex items-center gap-2 px-8 py-4 bg-background text-foreground font-medium tracking-wider uppercase text-sm hover:bg-background/90 transition-colors"
            >
              Смотреть коллекцию
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* New Arrivals - White background */}
      <section className="py-20 md:py-32 bg-background">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <p className="text-muted-foreground text-sm tracking-wider uppercase mb-2">
              Только что прибыло
            </p>
            <h2 className="font-serif text-3xl md:text-5xl">Новинки</h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {products.slice(0, 6).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/catalog" className="btn-secondary inline-flex items-center gap-2">
              Показать все
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Brand Story - Muted/Buttercream background */}
      <section className="py-20 md:py-32 bg-muted">
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
              <h2 className="font-serif text-3xl md:text-5xl mb-6">
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

      {/* Instagram / Social - White background */}
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
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {products.slice(0, 8).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="aspect-square overflow-hidden group cursor-pointer"
              >
                <img
                  src={product.image}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
