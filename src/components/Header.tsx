import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Search, Heart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { categories } from "@/data/products";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { openCart, getTotalItems } = useCartStore();
  const totalItems = getTotalItems();

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border"
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 hover:opacity-70 transition-opacity"
              aria-label="Меню"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link to="/" className="absolute left-1/2 -translate-x-1/2">
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="font-serif text-2xl md:text-3xl font-medium tracking-[0.2em]"
              >
                VOX
              </motion.h1>
            </Link>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 hover:opacity-70 transition-opacity hidden md:block"
                aria-label="Поиск"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                className="p-2 hover:opacity-70 transition-opacity hidden md:block"
                aria-label="Избранное"
              >
                <Heart className="w-5 h-5" />
              </button>
              <button
                onClick={openCart}
                className="p-2 hover:opacity-70 transition-opacity relative"
                aria-label="Корзина"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-foreground text-background text-xs flex items-center justify-center rounded-full"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-border"
              >
                <div className="py-4">
                  <input
                    type="text"
                    placeholder="Поиск..."
                    className="w-full bg-transparent border-b border-border py-2 focus:outline-none focus:border-foreground transition-colors font-sans text-sm tracking-wide"
                    autoFocus
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-foreground/30 z-50"
            />
            <motion.nav
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.4 }}
              className="fixed top-0 left-0 bottom-0 w-full max-w-md bg-background z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-12">
                  <h2 className="font-serif text-2xl font-medium tracking-[0.2em]">
                    VOX
                  </h2>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 hover:opacity-70 transition-opacity"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-1">
                  {categories.map((category, index) => (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={`/catalog/${category.slug}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="block py-4 border-b border-border font-serif text-xl hover:pl-4 transition-all duration-300"
                      >
                        {category.name}
                      </Link>
                      {category.subcategories && (
                        <div className="pl-4 py-2 space-y-2">
                          {category.subcategories.map((sub) => (
                            <Link
                              key={sub.id}
                              to={`/catalog/${category.slug}/${sub.slug}`}
                              onClick={() => setIsMenuOpen(false)}
                              className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                <div className="mt-12 pt-8 border-t border-border">
                  <div className="space-y-4 text-sm text-muted-foreground">
                    <p>Telegram: @vox_alisalanskaja</p>
                    <p>Russian brand</p>
                  </div>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
