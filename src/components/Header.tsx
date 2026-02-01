import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Search, Heart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { categories } from "@/data/products";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { openCart, getTotalItems } = useCartStore();
  const totalItems = getTotalItems();
  const location = useLocation();
  
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled || !isHome
            ? "bg-background/95 backdrop-blur-md border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-20 md:h-24">
            {/* Menu Toggle */}
            <motion.button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 hover:opacity-70 transition-opacity"
              aria-label="Меню"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-6 flex flex-col gap-1.5">
                <motion.span className="block h-px bg-foreground w-full" />
                <motion.span className="block h-px bg-foreground w-4" />
              </div>
            </motion.button>

            {/* Logo */}
            <Link to="/" className="absolute left-1/2 -translate-x-1/2">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="font-serif text-2xl md:text-3xl tracking-[0.25em] font-medium"
              >
                VOX
              </motion.h1>
            </Link>

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              <motion.button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 hover:opacity-70 transition-opacity hidden md:flex items-center justify-center"
                aria-label="Поиск"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Search className="w-5 h-5" strokeWidth={1.5} />
              </motion.button>
              <motion.button
                className="p-2 hover:opacity-70 transition-opacity hidden md:flex items-center justify-center"
                aria-label="Избранное"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart className="w-5 h-5" strokeWidth={1.5} />
              </motion.button>
              <motion.button
                onClick={openCart}
                className="p-2 hover:opacity-70 transition-opacity relative flex items-center justify-center"
                aria-label="Корзина"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-foreground text-xs flex items-center justify-center"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
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
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
            />
            <motion.nav
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }}
              className="fixed top-0 left-0 bottom-0 w-full max-w-md bg-background z-50 overflow-y-auto"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-16">
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="font-serif text-2xl tracking-[0.25em]"
                  >
                    VOX
                  </motion.h2>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 hover:opacity-70 transition-opacity"
                  >
                    <X className="w-6 h-6" strokeWidth={1.5} />
                  </button>
                </div>

                <div className="space-y-0">
                  {categories.map((category, index) => (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      <Link
                        to={`/catalog/${category.slug}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="group flex items-center justify-between py-5 border-b border-border"
                      >
                        <span className="font-serif text-2xl group-hover:translate-x-2 transition-transform duration-300">
                          {category.name}
                        </span>
                        <motion.span
                          className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          →
                        </motion.span>
                      </Link>
                      {category.subcategories && (
                        <div className="pl-4 py-3 space-y-2 border-b border-border">
                          {category.subcategories.map((sub) => (
                            <Link
                              key={sub.id}
                              to={`/catalog/${category.slug}/${sub.slug}`}
                              onClick={() => setIsMenuOpen(false)}
                              className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-16 pt-8 border-t border-border"
                >
                  <div className="space-y-4 text-sm text-muted-foreground">
                    <p className="tracking-widest uppercase">Telegram</p>
                    <p className="text-foreground">@vox_alisalanskaja</p>
                  </div>
                </motion.div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
