import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MapPin, Package, ArrowLeft, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
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

// Popular CDEK pickup points (simplified version)
const cdekCities = [
  { id: "msk", name: "Москва" },
  { id: "spb", name: "Санкт-Петербург" },
  { id: "nsk", name: "Новосибирск" },
  { id: "ekb", name: "Екатеринбург" },
  { id: "kzn", name: "Казань" },
  { id: "nnov", name: "Нижний Новгород" },
  { id: "sam", name: "Самара" },
  { id: "rnd", name: "Ростов-на-Дону" },
  { id: "krd", name: "Краснодар" },
  { id: "vgd", name: "Волгоград" },
];

const cdekPoints: Record<string, Array<{ id: string; name: string; address: string }>> = {
  msk: [
    { id: "msk-1", name: "ПВЗ Тверская", address: "ул. Тверская, 12" },
    { id: "msk-2", name: "ПВЗ Арбат", address: "ул. Арбат, 25" },
    { id: "msk-3", name: "ПВЗ ВДНХ", address: "пр-т Мира, 150" },
  ],
  spb: [
    { id: "spb-1", name: "ПВЗ Невский", address: "Невский пр-т, 100" },
    { id: "spb-2", name: "ПВЗ Московский", address: "Московский пр-т, 50" },
  ],
  nsk: [
    { id: "nsk-1", name: "ПВЗ Центр", address: "Красный пр-т, 30" },
  ],
  ekb: [
    { id: "ekb-1", name: "ПВЗ Центр", address: "ул. Ленина, 40" },
  ],
  kzn: [
    { id: "kzn-1", name: "ПВЗ Центр", address: "ул. Баумана, 15" },
  ],
  nnov: [
    { id: "nnov-1", name: "ПВЗ Центр", address: "ул. Большая Покровская, 20" },
  ],
  sam: [
    { id: "sam-1", name: "ПВЗ Центр", address: "ул. Куйбышева, 10" },
  ],
  rnd: [
    { id: "rnd-1", name: "ПВЗ Центр", address: "ул. Большая Садовая, 50" },
  ],
  krd: [
    { id: "krd-1", name: "ПВЗ Центр", address: "ул. Красная, 100" },
  ],
  vgd: [
    { id: "vgd-1", name: "ПВЗ Центр", address: "пр-т Ленина, 25" },
  ],
};

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedPoint, setSelectedPoint] = useState("");
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

  const getSelectedPointInfo = () => {
    if (!selectedCity || !selectedPoint) return null;
    const points = cdekPoints[selectedCity] || [];
    return points.find(p => p.id === selectedPoint);
  };

  const onSubmit = async (data: CheckoutForm) => {
    if (!selectedCity || !selectedPoint) {
      toast.error("Выберите пункт выдачи СДЭК");
      return;
    }

    setIsSubmitting(true);

    const pointInfo = getSelectedPointInfo();
    const cityName = cdekCities.find(c => c.id === selectedCity)?.name;

    const orderData = {
      name: data.name,
      phone: data.phone,
      city: cityName,
      pickupPoint: pointInfo?.name,
      pickupAddress: pointInfo?.address,
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

                {/* CDEK Points */}
                <div className="bg-secondary/30 p-6 rounded-lg">
                  <h2 className="font-serif text-xl mb-6 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Пункт выдачи СДЭК
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Город *
                      </Label>
                      <select
                        value={selectedCity}
                        onChange={(e) => {
                          setSelectedCity(e.target.value);
                          setSelectedPoint("");
                        }}
                        className="w-full h-10 px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="">Выберите город</option>
                        {cdekCities.map((city) => (
                          <option key={city.id} value={city.id}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {selectedCity && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                      >
                        <Label className="text-sm font-medium mb-2 block">
                          Пункт выдачи *
                        </Label>
                        <div className="space-y-2">
                          {cdekPoints[selectedCity]?.map((point) => (
                            <label
                              key={point.id}
                              className={`flex items-start gap-3 p-4 rounded-lg cursor-pointer transition-all ${
                                selectedPoint === point.id
                                  ? "bg-accent/50 border-2 border-accent"
                                  : "bg-background border border-border hover:border-muted-foreground"
                              }`}
                            >
                              <input
                                type="radio"
                                name="cdekPoint"
                                value={point.id}
                                checked={selectedPoint === point.id}
                                onChange={(e) => setSelectedPoint(e.target.value)}
                                className="mt-1"
                              />
                              <div>
                                <p className="font-medium">{point.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {point.address}
                                </p>
                              </div>
                            </label>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
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
