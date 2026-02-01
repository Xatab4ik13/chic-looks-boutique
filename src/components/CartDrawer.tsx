import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

const CartDrawer = () => {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getTotalPrice,
    clearCart,
  } = useCartStore();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU").format(price) + " ₽";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-foreground/30 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-background z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-serif text-2xl">Корзина</h2>
              <button
                onClick={closeCart}
                className="p-2 hover:opacity-70 transition-opacity"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-20"
                >
                  <p className="text-muted-foreground mb-4">
                    Ваша корзина пуста
                  </p>
                  <button
                    onClick={closeCart}
                    className="btn-secondary"
                  >
                    Продолжить покупки
                  </button>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4"
                    >
                      {/* Image */}
                      <div className="w-24 h-32 flex-shrink-0 overflow-hidden bg-muted">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col">
                        <div className="flex-1">
                          <h3 className="font-serif text-lg leading-tight">
                            {item.name}
                          </h3>
                          {item.size && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Размер: {item.size}
                            </p>
                          )}
                          <p className="font-medium mt-2">
                            {formatPrice(item.price)}
                          </p>
                        </div>

                        {/* Quantity */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="w-8 h-8 flex items-center justify-center border border-border hover:bg-muted transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="w-8 h-8 flex items-center justify-center border border-border hover:bg-muted transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-border">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-muted-foreground">Итого:</span>
                  <span className="font-serif text-2xl">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>
                <button className="w-full btn-primary mb-3">
                  Оформить заказ
                </button>
                <button
                  onClick={clearCart}
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                >
                  Очистить корзину
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
