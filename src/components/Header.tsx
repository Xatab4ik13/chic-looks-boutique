import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { X, ShoppingBag, Search, Heart } from "lucide-react";
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
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || !isHome
            ? "bg-background/95 backdrop-blur-md border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-20 md:h-24">
            {/* Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 hover:opacity-70 transition-opacity"
              aria-label="Меню"
            >
              <div className="w-6 flex flex-col gap-1.5">
                <span className={`block h-px w-full transition-colors duration-300 ${
                  isScrolled || !isHome ? "bg-foreground" : "bg-background"
                }`} />
                <span className={`block h-px w-4 transition-colors duration-300 ${
                  isScrolled || !isHome ? "bg-foreground" : "bg-background"
                }`} />
              </div>
            </button>

            {/* Logo */}
            <Link to="/" className="absolute left-1/2 -translate-x-1/2">
              <h1 className={`font-serif text-2xl md:text-3xl tracking-[0.25em] font-medium transition-colors duration-300 ${
                isScrolled || !isHome ? "text-foreground" : "text-background"
              }`}>
                VOX
              </h1>
            </Link>

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`p-2 hover:opacity-70 transition-all hidden md:flex items-center justify-center ${
                  isScrolled || !isHome ? "text-foreground" : "text-background"
                }`}
                aria-label="Поиск"
              >
                <Search className="w-5 h-5" strokeWidth={1.5} />
              </button>
              <button
                className={`p-2 hover:opacity-70 transition-all hidden md:flex items-center justify-center ${
                  isScrolled || !isHome ? "text-foreground" : "text-background"
                }`}
                aria-label="Избранное"
              >
                <Heart className="w-5 h-5" strokeWidth={1.5} />
              </button>
              <button
                onClick={openCart}
                className={`p-2 hover:opacity-70 transition-all relative flex items-center justify-center ${
                  isScrolled || !isHome ? "text-foreground" : "text-background"
                }`}
                aria-label="Корзина"
              >
                <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-foreground text-xs flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {isSearchOpen && (
            <div className="border-t border-border animate-fade-in">
              <div className="py-4">
                <input
                  type="text"
                  placeholder="Поиск..."
                  className="w-full bg-transparent border-b border-border py-2 focus:outline-none focus:border-foreground transition-colors font-sans text-sm tracking-wide"
                  autoFocus
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu - Elegant CSS Animation */}
      <div
        className={`fixed inset-0 bg-foreground/30 z-50 transition-opacity duration-500 ease-out ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />
      <nav
        className={`fixed top-0 left-0 bottom-0 w-full max-w-md bg-background z-50 overflow-y-auto menu-panel ${
          isMenuOpen ? "menu-open" : ""
        }`}
      >
        <div className="p-8">
          <div className={`flex items-center justify-between mb-16 menu-item ${isMenuOpen ? "menu-item-visible" : ""}`} style={{ transitionDelay: "100ms" }}>
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="font-serif text-2xl tracking-[0.25em] hover:opacity-70 transition-opacity">VOX</Link>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 hover:opacity-70 transition-opacity"
            >
              <X className="w-6 h-6" strokeWidth={1.5} />
            </button>
          </div>

          <div className="space-y-0">
            {categories.map((category, index) => (
              <div 
                key={category.id} 
                className={`menu-item ${isMenuOpen ? "menu-item-visible" : ""}`}
                style={{ transitionDelay: `${150 + index * 50}ms` }}
              >
                <Link
                  to={`/catalog/${category.slug}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="group flex items-center justify-between py-5 border-b border-border"
                >
                  <span className="font-serif text-2xl group-hover:translate-x-2 transition-transform duration-300">
                    {category.name}
                  </span>
                  <span className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </span>
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
              </div>
            ))}
            
            {/* Info Pages */}
            <div 
              className={`menu-item ${isMenuOpen ? "menu-item-visible" : ""}`}
              style={{ transitionDelay: `${150 + categories.length * 50}ms` }}
            >
              <Link
                to="/delivery"
                onClick={() => setIsMenuOpen(false)}
                className="group flex items-center justify-between py-5 border-b border-border"
              >
                <span className="font-serif text-2xl group-hover:translate-x-2 transition-transform duration-300">
                  Доставка и Оплата
                </span>
                <span className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
              </Link>
            </div>
            <div 
              className={`menu-item ${isMenuOpen ? "menu-item-visible" : ""}`}
              style={{ transitionDelay: `${150 + (categories.length + 1) * 50}ms` }}
            >
              <Link
                to="/returns"
                onClick={() => setIsMenuOpen(false)}
                className="group flex items-center justify-between py-5 border-b border-border"
              >
                <span className="font-serif text-2xl group-hover:translate-x-2 transition-transform duration-300">
                  Обмен и Возврат
                </span>
                <span className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
              </Link>
            </div>
          </div>

          <div 
            className={`mt-16 pt-8 border-t border-border menu-item ${isMenuOpen ? "menu-item-visible" : ""}`}
            style={{ transitionDelay: "500ms" }}
          >
            <a 
              href="https://www.instagram.com/vox_alisalanskaja/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block space-y-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <p className="tracking-widest uppercase">Instagram</p>
              <p className="text-foreground">@vox_alisalanskaja</p>
            </a>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
