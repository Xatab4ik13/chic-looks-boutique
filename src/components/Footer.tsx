import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Send, Instagram, AtSign } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Каталог",
      links: [
        { name: "Платья", href: "/catalog/dresses" },
        { name: "Корсеты", href: "/catalog/corsets" },
        { name: "Юбки", href: "/catalog/skirts" },
        { name: "Костюмы", href: "/catalog/suits" },
      ],
    },
    {
      title: "Информация",
      links: [
        { name: "О бренде", href: "/about" },
        { name: "Доставка и оплата", href: "/delivery" },
        { name: "Обмен и возврат", href: "/returns" },
        { name: "Контакты", href: "/contacts" },
      ],
    },
  ];

  return (
    <footer className="bg-foreground text-background py-16 md:py-20">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2"
          >
            <h2 className="font-serif text-3xl md:text-4xl tracking-[0.2em] mb-4">
              VOX
            </h2>
            <p className="text-background/60 text-sm leading-relaxed max-w-sm mb-6">
              Russian brand — Женская одежда премиального качества. 
              Элегантность в каждой детали.
            </p>
            <div className="flex gap-4">
              <a
                href="https://t.me/vox_alisalanskaja"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-background/30 flex items-center justify-center hover:bg-background hover:text-foreground transition-all duration-300"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/vox_alisalanskaja/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-background/30 flex items-center justify-center hover:bg-background hover:text-foreground transition-all duration-300"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* Links */}
          {footerLinks.map((group, groupIndex) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: groupIndex * 0.1 }}
            >
              <h3 className="text-sm tracking-wider uppercase mb-6">{group.title}</h3>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-xs tracking-wider uppercase text-background/60 hover:text-background transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-background/20 pt-12 mb-0" />

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-background/40">
          <p>© {currentYear} VOX. Все права защищены.</p>
          <p>@vox_alisalanskaja</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
