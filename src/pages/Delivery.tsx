import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

const Delivery = () => {
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
            className="max-w-3xl mx-auto"
          >
            <h1 className="font-serif text-4xl md:text-5xl text-center mb-16">
              Доставка
            </h1>

            <div className="space-y-12">
              {/* Delivery by Russia */}
              <section className="space-y-6">
                <h2 className="font-serif text-2xl border-b border-border pb-4">
                  Доставка по России
                </h2>
                
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Доставка товаров по России осуществляется транспортной компанией CDEK. 
                    Стоимость и сроки доставки зависят от вашего региона.
                  </p>
                  <p>
                    Для более точных сроков заказа обращайтесь к менеджеру.
                  </p>
                </div>
              </section>

              {/* Delivery Krasnodar */}
              <section className="space-y-6">
                <h2 className="font-serif text-2xl border-b border-border pb-4">
                  Доставка по Краснодару
                </h2>
                
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Доставка осуществляется курьерами Яндекс Доставки.
                  </p>
                  <p>
                    После оформления заказа с вами свяжется наш менеджер и уточнит удобное время для доставки.
                  </p>
                  <p>
                    Стоимость доставки по Краснодару зависит от тарифов Яндекс Доставки.
                  </p>
                </div>
              </section>

              {/* Order Processing */}
              <section className="space-y-6">
                <h2 className="font-serif text-2xl border-b border-border pb-4">
                  Обработка заказов
                </h2>
                
                <div className="space-y-4 text-muted-foreground">
                  <div className="p-6 bg-secondary rounded-lg space-y-3">
                    <ul className="list-disc list-inside space-y-2">
                      <li>Интернет-заказы обрабатываются каждый будний день с 10:00 до 17:00</li>
                      <li>Заказы в выходные и праздничные дни не обрабатываются</li>
                      <li>Заказы, оформленные после 17:00, будут обработаны на следующий день</li>
                      <li>Менеджеры свяжутся для уточнения удобного времени доставки на следующий день после 10:00</li>
                    </ul>
                  </div>
                </div>
              </section>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Delivery;
