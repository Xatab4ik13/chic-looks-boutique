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
              Доставка и Оплата
            </h1>

            <div className="space-y-12">
              {/* Delivery Section */}
              <section className="space-y-6">
                <h2 className="font-serif text-2xl border-b border-border pb-4">
                  Доставка
                </h2>
                
                <div className="space-y-4 text-muted-foreground">
                  <div className="p-6 bg-secondary rounded-lg">
                    <h3 className="font-medium text-foreground mb-2">По Минску</h3>
                    <p>Курьерская доставка — бесплатно при заказе от 150 BYN</p>
                    <p>Доставка в течение 1-2 рабочих дней</p>
                  </div>
                  
                  <div className="p-6 bg-secondary rounded-lg">
                    <h3 className="font-medium text-foreground mb-2">По Беларуси</h3>
                    <p>Доставка почтой или курьерской службой — от 10 BYN</p>
                    <p>Срок доставки: 2-5 рабочих дней</p>
                  </div>
                  
                  <div className="p-6 bg-secondary rounded-lg">
                    <h3 className="font-medium text-foreground mb-2">Международная доставка</h3>
                    <p>Доставка в страны СНГ и Европы</p>
                    <p>Стоимость рассчитывается индивидуально</p>
                  </div>
                </div>
              </section>

              {/* Payment Section */}
              <section className="space-y-6">
                <h2 className="font-serif text-2xl border-b border-border pb-4">
                  Оплата
                </h2>
                
                <div className="space-y-4 text-muted-foreground">
                  <div className="p-6 bg-secondary rounded-lg">
                    <h3 className="font-medium text-foreground mb-2">Онлайн-оплата</h3>
                    <p>Банковские карты Visa, Mastercard, Белкарт</p>
                    <p>Безопасная оплата через защищённое соединение</p>
                  </div>
                  
                  <div className="p-6 bg-secondary rounded-lg">
                    <h3 className="font-medium text-foreground mb-2">Оплата при получении</h3>
                    <p>Наличными или картой курьеру</p>
                    <p>Доступно только для доставки по Минску</p>
                  </div>
                  
                  <div className="p-6 bg-secondary rounded-lg">
                    <h3 className="font-medium text-foreground mb-2">Рассрочка</h3>
                    <p>Оформление рассрочки от банков-партнёров</p>
                    <p>До 4 платежей без переплат</p>
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
