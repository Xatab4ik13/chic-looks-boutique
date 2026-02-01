import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

const Returns = () => {
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
              Обмен и Возврат
            </h1>

            <div className="space-y-12">
              {/* Exchange Section */}
              <section className="space-y-6">
                <h2 className="font-serif text-2xl border-b border-border pb-4">
                  Обмен товара
                </h2>
                
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Мы понимаем, что иногда размер или фасон могут не подойти. 
                    Вы можете обменять товар в течение 14 дней с момента получения.
                  </p>
                  
                  <div className="p-6 bg-secondary rounded-lg space-y-3">
                    <h3 className="font-medium text-foreground">Условия обмена:</h3>
                    <ul className="list-disc list-inside space-y-2">
                      <li>Товар не был в носке и сохранил товарный вид</li>
                      <li>Все бирки и ярлыки сохранены</li>
                      <li>Сохранена оригинальная упаковка</li>
                      <li>Есть чек или подтверждение покупки</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Return Section */}
              <section className="space-y-6">
                <h2 className="font-serif text-2xl border-b border-border pb-4">
                  Возврат товара
                </h2>
                
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Возврат денежных средств осуществляется в течение 14 дней 
                    с момента получения товара обратно.
                  </p>
                  
                  <div className="p-6 bg-secondary rounded-lg space-y-3">
                    <h3 className="font-medium text-foreground">Как оформить возврат:</h3>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>Свяжитесь с нами в Telegram: @vox_alisalanskaja</li>
                      <li>Укажите номер заказа и причину возврата</li>
                      <li>Отправьте товар по указанному адресу</li>
                      <li>Получите возврат средств на карту</li>
                    </ol>
                  </div>
                  
                  <div className="p-6 bg-muted rounded-lg">
                    <h3 className="font-medium text-foreground mb-2">Важно</h3>
                    <p>
                      Стоимость обратной доставки оплачивается покупателем, 
                      за исключением случаев брака или ошибки при комплектации заказа.
                    </p>
                  </div>
                </div>
              </section>

              {/* Size Guide */}
              <section className="space-y-6">
                <h2 className="font-serif text-2xl border-b border-border pb-4">
                  Размерная сетка
                </h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="py-3 px-4 text-left font-medium">Размер</th>
                        <th className="py-3 px-4 text-left font-medium">Грудь (см)</th>
                        <th className="py-3 px-4 text-left font-medium">Талия (см)</th>
                        <th className="py-3 px-4 text-left font-medium">Бёдра (см)</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b border-border">
                        <td className="py-3 px-4 font-medium text-foreground">XS</td>
                        <td className="py-3 px-4">82-86</td>
                        <td className="py-3 px-4">62-66</td>
                        <td className="py-3 px-4">88-92</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-3 px-4 font-medium text-foreground">S</td>
                        <td className="py-3 px-4">86-90</td>
                        <td className="py-3 px-4">66-70</td>
                        <td className="py-3 px-4">92-96</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-3 px-4 font-medium text-foreground">M</td>
                        <td className="py-3 px-4">90-94</td>
                        <td className="py-3 px-4">70-74</td>
                        <td className="py-3 px-4">96-100</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-3 px-4 font-medium text-foreground">L</td>
                        <td className="py-3 px-4">94-98</td>
                        <td className="py-3 px-4">74-78</td>
                        <td className="py-3 px-4">100-104</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium text-foreground">XL</td>
                        <td className="py-3 px-4">98-102</td>
                        <td className="py-3 px-4">78-82</td>
                        <td className="py-3 px-4">104-108</td>
                      </tr>
                    </tbody>
                  </table>
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

export default Returns;
