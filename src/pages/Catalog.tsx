import { useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { products, categories } from "@/data/products";
import { useState } from "react";

const Catalog = () => {
  const { category: categorySlug, subcategory } = useParams();
  const [searchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("new");

  const filterType = searchParams.get("filter"); // "new" or "sale"
  const currentCategory = categories.find((c) => c.slug === categorySlug);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by special filter from URL query params
    if (filterType === "new") {
      filtered = filtered.filter((p) => p.isNew);
    } else if (filterType === "sale") {
      filtered = filtered.filter((p) => p.isSale);
    }

    // Filter by category from URL
    if (categorySlug) {
      filtered = filtered.filter((p) => p.category === categorySlug);
    }

    // Filter by subcategory from URL
    if (subcategory && subcategory !== "all") {
      filtered = filtered.filter((p) => p.subcategory === subcategory);
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "new":
      default:
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    return filtered;
  }, [categorySlug, subcategory, filterType, sortBy]);

  // Get page title based on filter
  const getPageTitle = () => {
    if (filterType === "new") return "Новая коллекция";
    if (filterType === "sale") return "Скидки";
    return currentCategory?.name || "Все товары";
  };

  return (
    <div className="min-h-screen">
      <Header />
      <CartDrawer />

      {/* Page Header */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-muted-foreground text-sm tracking-wider uppercase mb-2">
              Коллекция
            </p>
            <h1 className="font-serif text-4xl md:text-6xl">
              {getPageTitle()}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Filters Bar */}
      <section className="border-y border-border sticky top-16 md:top-20 bg-background/95 backdrop-blur-sm z-40">
        <div className="container mx-auto">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 text-sm tracking-wider uppercase"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Фильтры
            </button>

            <span className="text-sm text-muted-foreground">
              {filteredProducts.length} товаров
            </span>

            <div className="relative group">
              <button className="flex items-center gap-2 text-sm tracking-wider uppercase">
                Сортировка
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {[
                  { value: "new", label: "Новинки" },
                  { value: "price-low", label: "Цена: по возрастанию" },
                  { value: "price-high", label: "Цена: по убыванию" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className={`w-full px-4 py-3 text-left text-sm hover:bg-muted transition-colors ${
                      sortBy === option.value ? "bg-muted" : ""
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto">
          {filteredProducts.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
            >
              <AnimatePresence>
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-muted-foreground">
                Товары не найдены
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Filter Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-foreground/30 z-50"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.4 }}
              className="fixed top-0 left-0 bottom-0 w-full max-w-sm bg-background z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-serif text-2xl">Фильтры</h2>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="p-2"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Categories */}
                <div className="mb-8">
                  <h3 className="font-serif text-lg mb-4">Категории</h3>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <a
                        key={cat.id}
                        href={`/catalog/${cat.slug}`}
                        className={`block w-full text-left py-2 text-sm transition-colors ${
                          categorySlug === cat.slug
                            ? "text-foreground font-medium"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {cat.name}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Subcategories for current category */}
                {currentCategory?.subcategories && (
                  <div className="mb-8">
                    <h3 className="font-serif text-lg mb-4">Подкатегории</h3>
                    <div className="space-y-2">
                      {currentCategory.subcategories.map((sub) => (
                        <a
                          key={sub.id}
                          href={`/catalog/${categorySlug}/${sub.slug}`}
                          className={`block w-full text-left py-2 text-sm transition-colors ${
                            subcategory === sub.slug
                              ? "text-foreground font-medium"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {sub.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full btn-primary mt-8"
                >
                  Применить
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Catalog;
