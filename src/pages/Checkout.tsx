import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Package, ArrowLeft, Loader2, MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { useCartStore } from "@/store/cartStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ordersApi } from "@/lib/api";
import { toast } from "sonner";

const checkoutSchema = z.object({
  name: z.string().trim().min(2, "Имя должно содержать минимум 2 символа").max(100, "Имя слишком длинное"),
  phone: z.string().trim().min(10, "Введите корректный номер телефона").max(20, "Номер слишком длинный"),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

// Phone formatting function
const formatPhoneNumber = (value: string): string => {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, "");
  
  // Handle different starting scenarios
  let normalizedDigits = digits;
  if (digits.startsWith("8") && digits.length > 1) {
    normalizedDigits = "7" + digits.slice(1);
  } else if (!digits.startsWith("7") && digits.length > 0) {
    normalizedDigits = "7" + digits;
  }
  
  // Limit to 11 digits (7 + 10 digits)
  normalizedDigits = normalizedDigits.slice(0, 11);
  
  // Format the number
  if (normalizedDigits.length === 0) return "";
  if (normalizedDigits.length <= 1) return `+${normalizedDigits}`;
  if (normalizedDigits.length <= 4) return `+${normalizedDigits[0]} (${normalizedDigits.slice(1)}`;
  if (normalizedDigits.length <= 7) return `+${normalizedDigits[0]} (${normalizedDigits.slice(1, 4)}) ${normalizedDigits.slice(4)}`;
  if (normalizedDigits.length <= 9) return `+${normalizedDigits[0]} (${normalizedDigits.slice(1, 4)}) ${normalizedDigits.slice(4, 7)}-${normalizedDigits.slice(7)}`;
  return `+${normalizedDigits[0]} (${normalizedDigits.slice(1, 4)}) ${normalizedDigits.slice(4, 7)}-${normalizedDigits.slice(7, 9)}-${normalizedDigits.slice(9, 11)}`;
};

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneValue, setPhoneValue] = useState("+7");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      phone: "+7",
    },
  });

  useEffect(() => {
    if (items.length === 0) {
      navigate("/catalog");
    }
  }, [items, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU").format(price) + " ₽";
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneValue(formatted);
    setValue("phone", formatted);
  };

  const onSubmit = async (data: CheckoutForm) => {
    setIsSubmitting(true);

    const orderData = {
      name: data.name,
      phone: data.phone,
      items: items.map(item => ({
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
      })),
      total: getTotalPrice(),
    };

    try {
      await ordersApi.create(orderData);

      clearCart();
      toast.success("Заказ успешно оформлен! Мы свяжемся с вами в ближайшее время.");
      navigate("/");
    } catch (err) {
      console.error("Order error:", err);
      toast.error("Ошибка при оформлении заказа. Попробуйте позже.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            {/* Back button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Назад</span>
            </button>

            <h1 className="font-serif text-4xl md:text-5xl mb-12">
              Оформление заказа
            </h1>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Form */}
              <div className="space-y-8">
                {/* Contact Info */}
                <div className="bg-secondary/30 p-6 rounded-lg">
                  <h2 className="font-serif text-xl mb-6 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Контактные данные
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium mb-2 block">
                        Имя *
                      </Label>
                      <Input
                        id="name"
                        placeholder="Введите ваше имя"
                        className="bg-background border-border"
                        {...register("name")}
                      />
                      {errors.name && (
                        <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium mb-2 block">
                        Телефон *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+7 (999) 123-45-67"
                        className="bg-background border-border"
                        value={phoneValue}
                        onChange={handlePhoneChange}
                      />
                      {errors.phone && (
                        <p className="text-destructive text-sm mt-1">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* WhatsApp Contact */}
                <div className="bg-secondary/30 p-6 rounded-lg">
                  <h2 className="font-serif text-xl mb-4 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Связь с менеджером
                  </h2>
                  <p className="text-muted-foreground text-sm mb-4">
                    Есть вопросы по заказу? Свяжитесь с нами напрямую
                  </p>
                  <a
                    href="https://wa.me/79181349493"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-lg hover:bg-[#22c55e] transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Написать в WhatsApp
                  </a>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <div className="bg-secondary/30 p-6 rounded-lg sticky top-32">
                  <h2 className="font-serif text-xl mb-6">Ваш заказ</h2>
                  
                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-16 h-20 rounded overflow-hidden bg-muted flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item.name}</p>
                          {item.size && (
                            <p className="text-sm text-muted-foreground">
                              Размер: {item.size}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} шт. × {formatPrice(item.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Итого:</span>
                      <span className="font-serif text-2xl">{formatPrice(getTotalPrice())}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Доставка обсуждается с менеджером
                    </p>
                  </div>

                  <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Оформление...
                      </>
                    ) : (
                      "Оформить заказ"
                    )}
                  </button>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Нажимая кнопку, вы соглашаетесь с условиями обработки персональных данных
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
