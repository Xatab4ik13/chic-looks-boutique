import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Heart } from "lucide-react";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/cartStore";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { addItem, openCart } = useCartStore();
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU").format(price) + " ₽";
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    openCart();
  };

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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

        {/* Quick Actions */}
        <motion.div
          className="absolute bottom-2 left-2 right-2 md:bottom-4 md:left-4 md:right-4 flex gap-2 md:gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.3 }}
        >
          <button
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-1 md:gap-2 py-2 md:py-3 bg-background/95 backdrop-blur-sm text-foreground text-xs md:text-sm tracking-wider uppercase hover:bg-background transition-colors"
          >
            <ShoppingBag className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">В корзину</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className={`w-9 md:w-12 flex items-center justify-center bg-background/95 backdrop-blur-sm transition-colors ${
              isLiked ? "text-destructive" : "text-foreground hover:text-destructive"
            }`}
          >
            <Heart className={`w-3 h-3 md:w-4 md:h-4 ${isLiked ? "fill-current" : ""}`} />
          </button>
        </motion.div>
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <motion.h3
          className="font-serif text-lg leading-tight"
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
