import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Package, ArrowLeft, Loader2, Truck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import CDEKWidget from "@/components/CDEKWidget";
import { useCartStore } from "@/store/cartStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const checkoutSchema = z.object({
  name: z.string().trim().min(2, "Имя должно содержать минимум 2 символа").max(100, "Имя слишком длинное"),
  phone: z.string().trim().min(10, "Введите корректный номер телефона").max(20, "Номер слишком длинный"),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

interface CDEKPoint {
  code: string;
  name: string;
  location: {
    city: string;
    city_code: number;
    address: string;
    postal_code: string;
    latitude: number;
    longitude: number;
  };
  work_time: string;
  phones?: { number: string }[];
  type: string;
  have_cash: boolean;
  have_cashless: boolean;
  is_dressing_room: boolean;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [selectedPoint, setSelectedPoint] = useState<CDEKPoint | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
  });

  useEffect(() => {
    if (items.length === 0) {
      navigate("/catalog");
    }
  }, [items, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU").format(price) + " ₽";
  };

  const onSubmit = async (data: CheckoutForm) => {
    if (!selectedPoint) {
      toast.error("Выберите пункт выдачи СДЭК");
      return;
    }

    setIsSubmitting(true);

    const orderData = {
      name: data.name,
      phone: data.phone,
      city: selectedPoint.location.city,
      pickupPoint: selectedPoint.name,
      pickupAddress: selectedPoint.location.address,
      items: items.map(item => ({
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
      })),
      total: getTotalPrice(),
    };

    try {
      const { error } = await supabase.functions.invoke("send-order-telegram", {
        body: orderData,
      });

      if (error) {
        console.error("Order error:", error);
        toast.error("Ошибка при оформлении заказа. Попробуйте позже.");
        setIsSubmitting(false);
        return;
      }

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
                        placeholder="+7 (___) ___-__-__"
                        className="bg-background border-border"
                        {...register("phone")}
                      />
                      {errors.phone && (
                        <p className="text-destructive text-sm mt-1">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* CDEK Widget */}
                <div className="bg-secondary/30 p-6 rounded-lg">
                  <h2 className="font-serif text-xl mb-6 flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Доставка СДЭК
                  </h2>
                  <CDEKWidget
                    onSelect={setSelectedPoint}
                    selectedPoint={selectedPoint}
                  />
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
                      Доставка оплачивается при получении
                    </p>
                  </div>

                  <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting || !selectedPoint}
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
