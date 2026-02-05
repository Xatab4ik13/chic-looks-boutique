import { motion } from "framer-motion";
import { Send, MapPin, Clock, Mail, Phone } from "lucide-react";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";

const Contacts = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <CartDrawer />

      {/* Page Header */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="font-serif text-4xl md:text-6xl">Контакты</h1>
          </motion.div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center space-y-10"
          >
            {/* Store Address */}
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm tracking-wider uppercase">Магазин в Краснодаре</span>
              </div>
              <p className="text-lg">
                г. Краснодар, ул. Володи Головатого д.313
              </p>
              <p className="text-muted-foreground">
                ТРЦ Галерея, 2 очередь, 1 этаж
              </p>
            </div>

            {/* Working Hours */}
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm tracking-wider uppercase">Режим работы</span>
              </div>
              <p className="text-lg">
                Ежедневно с 10:00 до 22:00
              </p>
            </div>

            {/* Also Represented */}
            <div className="space-y-3 pt-6 border-t border-border">
              <p className="text-muted-foreground text-sm tracking-wider uppercase">
                Также мы представлены в
              </p>
              <p className="text-lg">
                Trend Island
              </p>
              <p className="text-muted-foreground">
                ТРЦ Европейский, ТРЦ Авиапарк — Москва
              </p>
            </div>

            {/* Contact Methods */}
            <div className="space-y-6 pt-10 border-t border-border">
              <p className="text-muted-foreground text-sm tracking-wider uppercase mb-6">
                Связаться
              </p>
              
              <div className="space-y-4">
                <a
                  href="https://wa.me/89"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 hover:text-muted-foreground transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>WA/Telegram: 89</span>
                </a>
                
                <a
                  href="https://t.me/VOXALISALANSKAJA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 hover:text-muted-foreground transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>Канал в ТГ: @VOXALISALANSKAJA</span>
                </a>
                
                <a
                  href="mailto:vox-manager@yandex.ru"
                  className="flex items-center justify-center gap-3 hover:text-muted-foreground transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>vox-manager@yandex.ru</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contacts;
