import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Minus, Plus, Check, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import { useProduct } from "@/hooks/useProducts";
import { useCartStore } from "@/store/cartStore";
import { productColors, ProductColor, allSizes } from "@/types/product";

const defaultSizes = ["XS", "S", "M", "L", "XL"];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showSizeError, setShowSizeError] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem, openCart } = useCartStore();

  const { product, isLoading } = useProduct(id || "");

  // Get color variants or fallback to single color
  const colorVariants = useMemo(() => {
    if (!product) return [];
    if (product.colorVariants && product.colorVariants.length > 0) {
      return product.colorVariants;
    }
    // Fallback: use product's single color if available
    if (product.color) {
      return [{ color: product.color, image: product.image }];
    }
    return [];
  }, [product]);

  // Current displayed image based on selected color
  const currentImage = useMemo(() => {
    if (colorVariants.length > 0 && colorVariants[selectedColorIndex]?.image) {
      return colorVariants[selectedColorIndex].image;
    }
    return product?.image || "";
  }, [product, colorVariants, selectedColorIndex]);

  // Related products - for now empty in API mode, we could fetch separately
  const relatedProducts: typeof product[] = [];

  // Use product's available sizes or default sizes
  const sizes = useMemo(() => {
    if (product?.availableSizes && product.availableSizes.length > 0) {
      return product.availableSizes;
    }
    return defaultSizes;
  }, [product]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-3xl mb-4">Товар не найден</h1>
          <button
            onClick={() => navigate(-1)}
            className="btn-primary"
          >
            Вернуться назад
          </button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU").format(price) + " ₽";
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setShowSizeError(true);
      setTimeout(() => setShowSizeError(false), 2000);
      return;
    }
    
    // Add item multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addItem(product, selectedSize);
    }
    setAddedToCart(true);
    setTimeout(() => {
      setAddedToCart(false);
      openCart();
    }, 1000);
  };

  // Product descriptions based on category
  const getDescription = () => {
    const descriptions: Record<string, string> = {
      dresses: "Элегантное платье из премиальных материалов. Идеальный силуэт подчеркнёт вашу фигуру. Подходит для особых случаев и вечерних мероприятий.",
      corsets: "Роскошный корсет ручной работы. Формирует безупречный силуэт и подчёркивает талию. Изготовлен из высококачественных материалов с вниманием к каждой детали.",
      skirts: "Изысканная юбка из премиальной ткани. Универсальный крой позволяет создавать разнообразные образы — от повседневных до вечерних.",
      pants: "Стильные брюки с идеальной посадкой. Комфортный крой и качественные материалы для уверенного образа каждый день.",
      jackets: "Элегантный пиджак премиального качества. Безупречный крой и внимание к деталям создают утончённый образ для любого случая.",
      blouses: "Изящная блуза из натуральных тканей. Женственный силуэт и продуманные детали для создания элегантного образа.",
      suits: "Роскошный костюм безупречного кроя. Создан для тех, кто ценит стиль и качество. Идеален для деловых встреч и особых мероприятий.",
      accessories: "Эксклюзивный аксессуар ручной работы. Станет изысканным дополнением вашего образа и подчеркнёт индивидуальный стиль.",
    };
    return descriptions[product.category] || descriptions.dresses;
  };

  const careInstructions = [
    "Деликатная стирка до 30°C",
    "Не замачивать",
    "Сушить на плоскости в расправленном виде",
    "Сухая чистка (химчистка)",
    "Не выкручивать",
    "При глажке использовать пар",
  ];

  // Use product composition if available, otherwise default
  const productComposition = product?.composition || "90% полиэстер, 10% эластан";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />

      <main className="pt-24 md:pt-32">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 mb-8">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm tracking-wider uppercase">Назад</span>
          </motion.button>
        </div>

        {/* Product Content */}
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Image Section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-[3/4] overflow-hidden bg-secondary relative">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImage}
                    src={currentImage}
                    alt={product.name}
                    className="w-full h-full object-cover absolute inset-0"
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ 
                      duration: 0.4, 
                      ease: [0.4, 0, 0.2, 1]
                    }}
                  />
                </AnimatePresence>
              </div>

              {/* Badges */}
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                {product.isNew && (
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="px-4 py-2 bg-foreground text-background text-xs tracking-wider uppercase"
                  >
                    New
                  </motion.span>
                )}
                {product.isSale && (
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="px-4 py-2 bg-destructive text-destructive-foreground text-xs tracking-wider uppercase"
                  >
                    Sale
                  </motion.span>
                )}
              </div>

            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:py-8"
            >
              {/* SKU & Category */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-3 text-muted-foreground text-sm tracking-widest uppercase mb-4"
              >
                <span>{product.sku}</span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                <span>{product.category}</span>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="font-serif text-3xl md:text-4xl lg:text-5xl mb-6"
              >
                {product.name}
              </motion.h1>

              {/* Price */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-4 mb-8"
              >
                <span className="text-muted-foreground text-lg md:text-xl font-semibold">
                  {formatPrice(product.price)}
                </span>
                {product.oldPrice && (
                  <span className="text-muted-foreground line-through text-lg">
                    {formatPrice(product.oldPrice)}
                  </span>
                )}
                {product.oldPrice && (
                  <span className="px-3 py-1 bg-accent text-accent-foreground text-sm">
                    -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                  </span>
                )}
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-muted-foreground leading-relaxed mb-8"
              >
                {getDescription()}
              </motion.p>

              {/* Color Selection */}
              {colorVariants.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65 }}
                  className="mb-8"
                >
                  <h3 className="text-muted-foreground uppercase text-sm tracking-wider mb-4">
                    Цвет
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {colorVariants.map((variant, index) => {
                      const colorInfo = productColors.find(c => c.value === variant.color);
                      return (
                        <motion.button
                          key={variant.color}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.65 + index * 0.05 }}
                          onClick={() => setSelectedColorIndex(index)}
                          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                            selectedColorIndex === index
                              ? "border-foreground ring-2 ring-foreground ring-offset-2"
                              : "border-border hover:border-foreground"
                          }`}
                          style={{ backgroundColor: colorInfo?.hex }}
                          title={colorInfo?.label}
                        >
                          {selectedColorIndex === index && (
                            <Check className={`w-4 h-4 ${variant.color === 'white' || variant.color === 'cream' || variant.color === 'beige' ? 'text-foreground' : 'text-white'}`} />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                  {colorVariants[selectedColorIndex] && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {productColors.find(c => c.value === colorVariants[selectedColorIndex].color)?.label}
                    </p>
                  )}
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mb-8"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-muted-foreground uppercase text-sm tracking-wider">
                    Размер
                  </h3>
                  <button className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors">
                    Таблица размеров
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {sizes.map((size, index) => (
                    <motion.button
                      key={size}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + index * 0.05 }}
                      onClick={() => {
                        setSelectedSize(size);
                        setShowSizeError(false);
                      }}
                      className={`w-14 h-14 border-2 flex items-center justify-center text-sm font-medium transition-all duration-300 hover:scale-105 ${
                        selectedSize === size
                          ? "border-foreground bg-foreground text-background"
                          : "border-border hover:border-foreground"
                      }`}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
                <AnimatePresence>
                  {showSizeError && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-destructive text-sm mt-3"
                    >
                      Пожалуйста, выберите размер
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Quantity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mb-8"
              >
                <h3 className="text-muted-foreground uppercase text-sm tracking-wider mb-4">
                  Количество
                </h3>
                <div className="flex items-center gap-1 border border-border w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-muted transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 h-12 flex items-center justify-center font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>

              {/* Add to Cart Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="space-y-4"
              >
                <motion.button
                  onClick={handleAddToCart}
                  disabled={addedToCart}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 flex items-center justify-center gap-3 text-sm tracking-widest uppercase font-medium transition-all duration-500 ${
                    addedToCart
                      ? "bg-green-600 text-white"
                      : "bg-foreground text-background hover:bg-foreground/90"
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {addedToCart ? (
                      <motion.div
                        key="added"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Check className="w-5 h-5" />
                        Добавлено
                      </motion.div>
                    ) : (
                      <motion.span
                        key="add"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        Добавить в корзину — {formatPrice(product.price * quantity)}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.95 }}
                className="mt-10 grid grid-cols-2 gap-4"
              >
                <div className="p-4 border border-border">
                  <p className="text-sm text-foreground">Собственное производство</p>
                </div>
                <div className="p-4 border border-border">
                  <p className="text-sm text-foreground">Премиальные ткани</p>
                </div>
                <div className="col-span-2 p-4 border border-border">
                  <p className="text-sm text-foreground">Экспресс доставка во все города</p>
                </div>
              </motion.div>

              {/* Composition */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="mt-8 pt-8 border-t border-border"
              >
                <h3 className="text-muted-foreground uppercase text-sm tracking-wider mb-4">
                  Состав
                </h3>
                <p className="text-sm text-foreground">{productComposition}</p>
              </motion.div>

              {/* Care Instructions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="mt-8 pt-8 border-t border-border"
              >
                <h3 className="text-muted-foreground uppercase text-sm tracking-wider mb-4">
                  Уход за изделием
                </h3>
                <ul className="space-y-2">
                  {careInstructions.map((instruction, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2 + index * 0.1 }}
                      className="text-sm text-foreground flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
                      {instruction}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 md:mt-32 py-16 bg-secondary">
            <div className="container mx-auto px-4">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-serif text-2xl md:text-3xl text-center mb-12"
              >
                Вам также понравится
              </motion.h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {relatedProducts.map((relProduct, index) => (
                  <motion.div
                    key={relProduct.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => navigate(`/product/${relProduct.id}`)}
                    className="cursor-pointer group"
                  >
                    <div className="aspect-[3/4] overflow-hidden bg-muted mb-4">
                      <img
                        src={relProduct.image}
                        alt={relProduct.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <h3 className="font-serif text-lg group-hover:translate-x-1 transition-transform">
                      {relProduct.name}
                    </h3>
                    <p className="text-muted-foreground">
                      {formatPrice(relProduct.price)}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
