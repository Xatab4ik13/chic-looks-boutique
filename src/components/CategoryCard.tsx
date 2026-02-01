import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Category } from "@/types/product";

interface CategoryCardProps {
  category: Category;
  index?: number;
  size?: "small" | "large";
}

const CategoryCard = ({ category, index = 0, size = "small" }: CategoryCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
    >
      <Link
        to={`/catalog/${category.slug}`}
        className="category-card block"
        style={{ aspectRatio: size === "large" ? "3/4" : "4/5" }}
      >
        <img
          src={category.image}
          alt={category.name}
          className="category-image"
        />
        <div className="category-title">
          <motion.h3
            className="font-serif text-xl md:text-2xl mb-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            {category.name}
          </motion.h3>
          <motion.span
            className="text-sm text-background/70 tracking-wider uppercase"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + 0.4 }}
          >
            Смотреть
          </motion.span>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
