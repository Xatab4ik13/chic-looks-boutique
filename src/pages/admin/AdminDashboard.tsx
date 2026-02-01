import { useMemo } from "react";
import { motion } from "framer-motion";
import { Package, Tag, Sparkles, Percent, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAdminProductStore, categories } from "@/store/adminProductStore";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const { products } = useAdminProductStore();

  const stats = useMemo(() => {
    const newProducts = products.filter(p => p.isNew).length;
    const saleProducts = products.filter(p => p.isSale).length;
    const totalValue = products.reduce((sum, p) => sum + p.price, 0);
    
    const byCategory = categories.map(cat => ({
      ...cat,
      count: products.filter(p => p.category === cat.slug).length,
    }));

    return {
      total: products.length,
      new: newProducts,
      sale: saleProducts,
      totalValue,
      byCategory,
    };
  }, [products]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU").format(price) + " ₽";
  };

  const statCards = [
    { 
      label: "Всего товаров", 
      value: stats.total, 
      icon: Package, 
      color: "bg-primary/10 text-primary" 
    },
    { 
      label: "Новинки", 
      value: stats.new, 
      icon: Sparkles, 
      color: "bg-green-500/10 text-green-600" 
    },
    { 
      label: "Распродажа", 
      value: stats.sale, 
      icon: Percent, 
      color: "bg-destructive/10 text-destructive" 
    },
    { 
      label: "Общая стоимость", 
      value: formatPrice(stats.totalValue), 
      icon: TrendingUp, 
      color: "bg-amber-500/10 text-amber-600" 
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl mb-2">Панель управления</h1>
        <p className="text-muted-foreground">Обзор вашего магазина</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-lg border border-border p-6"
          >
            <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-serif mb-1">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Categories Overview */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-lg border border-border p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl">Товары по категориям</h2>
            <Link to="/admin/products">
              <Button variant="ghost" size="sm" className="gap-1">
                Все товары
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            {stats.byCategory.map((cat) => (
              <div key={cat.slug} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md overflow-hidden bg-muted">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-sm">{cat.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{cat.count}</span>
                  <span className="text-xs text-muted-foreground">товаров</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card rounded-lg border border-border p-6"
        >
          <h2 className="font-serif text-xl mb-6">Быстрые действия</h2>
          <div className="space-y-3">
            <Link to="/admin/products" className="block">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-muted-foreground" />
                  <span>Управление товарами</span>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </Link>
            <Link to="/catalog" className="block">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <Tag className="w-5 h-5 text-muted-foreground" />
                  <span>Просмотр каталога</span>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
