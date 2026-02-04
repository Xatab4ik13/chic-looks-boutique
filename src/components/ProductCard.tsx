import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, Check } from "lucide-react";
import { Product, allSizes } from "@/types/product";
import { useCartStore } from "@/store/cartStore";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const defaultSizes = ["XS", "S", "M", "L", "XL"];

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  // Use product's available sizes or default sizes
  const sizes = product.availableSizes && product.availableSizes.length > 0 
    ? product.availableSizes 
    : defaultSizes;
  const [isHovered, setIsHovered] = useState(false);
  const [showSizeSelector, setShowSizeSelector] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem, openCart } = useCartStore();
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU").format(price) + " ₽";
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSizeSelector(true);
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  const handleConfirmAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedSize) return;
    
    addItem(product, selectedSize);
    setAddedToCart(true);
    
    setTimeout(() => {
      setAddedToCart(false);
      setShowSizeSelector(false);
      setSelectedSize(null);
      openCart();
    }, 800);
  };

  const handleCloseSizeSelector = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSizeSelector(false);
    setSelectedSize(null);
  };

  const handleClick = () => {
    if (showSizeSelector) return;
    navigate(`/product/${product.id}`);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (!showSizeSelector) {
          setSelectedSize(null);
        }
      }}
      onClick={handleClick}
      className="group cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted mb-4">
        {/* Main Image */}
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          animate={{
            scale: isHovered ? 1.05 : 1,
          }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />

        {/* Overlay gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.isNew && (
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="px-3 py-1 bg-foreground text-background text-xs tracking-wider uppercase"
            >
              New
            </motion.span>
          )}
          {product.isSale && (
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="px-3 py-1 bg-destructive text-destructive-foreground text-xs tracking-wider uppercase"
            >
              Sale
            </motion.span>
          )}
        </div>

        {/* Size Selector Overlay */}
        <AnimatePresence>
          {showSizeSelector && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/95 backdrop-blur-sm flex flex-col justify-center items-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleCloseSizeSelector}
                className="absolute top-3 right-3 p-1 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
                Выберите размер
              </p>
              
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSizeSelect(size);
                    }}
                    className={`w-10 h-10 border text-sm font-medium transition-all ${
                      selectedSize === size
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:border-foreground"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              
              <motion.button
                onClick={handleConfirmAdd}
                disabled={!selectedSize || addedToCart}
                whileTap={{ scale: 0.95 }}
                className={`w-full max-w-[180px] py-2.5 text-xs tracking-wider uppercase font-medium transition-all ${
                  addedToCart
                    ? "bg-green-600 text-white"
                    : selectedSize
                    ? "bg-foreground text-background hover:bg-foreground/90"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                {addedToCart ? (
                  <span className="flex items-center justify-center gap-1">
                    <Check className="w-4 h-4" />
                    Добавлено
                  </span>
                ) : (
                  "Добавить"
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Actions */}
        <AnimatePresence>
          {!showSizeSelector && (
            <motion.div
              className="absolute bottom-2 left-2 right-2 md:bottom-4 md:left-4 md:right-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={handleAddToCartClick}
                className="w-full flex items-center justify-center gap-1 md:gap-2 py-2 md:py-3 bg-background/95 backdrop-blur-sm text-foreground text-xs md:text-sm tracking-wider uppercase hover:bg-background transition-colors"
              >
                <ShoppingBag className="w-3 h-3 md:w-4 md:h-4" />
                <span>В корзину</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <motion.h3
          className="text-sm font-medium leading-tight"
          animate={{ x: isHovered ? 4 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {product.name}
        </motion.h3>
        <div className="flex items-center gap-3">
          <span className="font-medium">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="text-muted-foreground line-through text-sm">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCard;
