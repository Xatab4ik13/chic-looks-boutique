import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Trash2, 
  Search, 
  Package, 
  Tag, 
  Edit2, 
  X,
  Check,
  AlertCircle,
  Sparkles
} from "lucide-react";
import { useAdminProductStore, categories, skuPrefixes } from "@/store/adminProductStore";
import { Product } from "@/types/product";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const AdminProducts = () => {
  const { products, addProduct, deleteProduct, updateProduct, getNextSku } = useAdminProductStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: "",
    oldPrice: "",
    category: "",
    subcategory: "",
    image: "",
    isNew: false,
    isSale: false,
  });

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  // Get subcategories for selected category
  const subcategories = useMemo(() => {
    const category = categories.find(c => c.slug === formData.category);
    return category?.subcategories?.filter(s => s.slug !== 'all') || [];
  }, [formData.category]);

  // Handle category change in form - auto-suggest SKU
  const handleCategoryChange = (category: string) => {
    const nextSku = getNextSku(category);
    setFormData(prev => ({
      ...prev,
      category,
      subcategory: "",
      sku: nextSku,
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      sku: "",
      price: "",
      oldPrice: "",
      category: "",
      subcategory: "",
      image: "",
      isNew: false,
      isSale: false,
    });
  };

  // Open add dialog
  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  // Open edit dialog
  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      price: String(product.price),
      oldPrice: product.oldPrice ? String(product.oldPrice) : "",
      category: product.category,
      subcategory: product.subcategory || "",
      image: product.image,
      isNew: product.isNew || false,
      isSale: product.isSale || false,
    });
    setIsEditDialogOpen(true);
  };

  // Handle add product
  const handleAddProduct = () => {
    if (!formData.name || !formData.sku || !formData.price || !formData.category) {
      toast.error("Заполните обязательные поля");
      return;
    }

    // Check if SKU already exists
    if (products.some(p => p.sku === formData.sku)) {
      toast.error("Товар с таким артикулом уже существует");
      return;
    }

    addProduct({
      name: formData.name,
      sku: formData.sku,
      price: Number(formData.price),
      oldPrice: formData.oldPrice ? Number(formData.oldPrice) : undefined,
      category: formData.category,
      subcategory: formData.subcategory || undefined,
      image: formData.image || "/placeholder.svg",
      isNew: formData.isNew,
      isSale: formData.isSale,
    });

    toast.success("Товар успешно добавлен");
    setIsAddDialogOpen(false);
    resetForm();
  };

  // Handle edit product
  const handleEditProduct = () => {
    if (!editingProduct) return;
    
    if (!formData.name || !formData.sku || !formData.price || !formData.category) {
      toast.error("Заполните обязательные поля");
      return;
    }

    // Check if SKU already exists (excluding current product)
    if (products.some(p => p.sku === formData.sku && p.id !== editingProduct.id)) {
      toast.error("Товар с таким артикулом уже существует");
      return;
    }

    updateProduct(editingProduct.id, {
      name: formData.name,
      sku: formData.sku,
      price: Number(formData.price),
      oldPrice: formData.oldPrice ? Number(formData.oldPrice) : undefined,
      category: formData.category,
      subcategory: formData.subcategory || undefined,
      image: formData.image,
      isNew: formData.isNew,
      isSale: formData.isSale,
    });

    toast.success("Товар успешно обновлён");
    setIsEditDialogOpen(false);
    setEditingProduct(null);
    resetForm();
  };

  // Handle delete product
  const handleDeleteProduct = () => {
    if (!deleteProductId) return;
    deleteProduct(deleteProductId);
    toast.success("Товар удалён");
    setDeleteProductId(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU").format(price) + " ₽";
  };

  const getCategoryName = (slug: string) => {
    return categories.find(c => c.slug === slug)?.name || slug;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-serif text-2xl md:text-3xl">Управление товарами</h1>
              <p className="text-muted-foreground text-sm mt-1">
                {products.length} товаров в каталоге
              </p>
            </div>
            <Button onClick={openAddDialog} className="gap-2">
              <Plus className="w-4 h-4" />
              Добавить товар
            </Button>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по названию или артикулу..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Все категории" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все категории</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.slug} value={cat.slug}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Products Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-4 font-medium text-sm">Товар</th>
                  <th className="text-left p-4 font-medium text-sm hidden md:table-cell">Артикул</th>
                  <th className="text-left p-4 font-medium text-sm hidden sm:table-cell">Категория</th>
                  <th className="text-left p-4 font-medium text-sm">Цена</th>
                  <th className="text-left p-4 font-medium text-sm hidden lg:table-cell">Метки</th>
                  <th className="text-right p-4 font-medium text-sm">Действия</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product) => (
                    <motion.tr
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-16 rounded overflow-hidden bg-muted flex-shrink-0">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate">{product.name}</p>
                            <p className="text-xs text-muted-foreground md:hidden">{product.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <code className="text-sm bg-muted px-2 py-1 rounded">{product.sku}</code>
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <span className="text-sm">{getCategoryName(product.category)}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-medium">{formatPrice(product.price)}</span>
                          {product.oldPrice && (
                            <span className="text-xs text-muted-foreground line-through">
                              {formatPrice(product.oldPrice)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <div className="flex gap-1">
                          {product.isNew && (
                            <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded">
                              New
                            </span>
                          )}
                          {product.isSale && (
                            <span className="px-2 py-0.5 bg-destructive text-destructive-foreground text-xs rounded">
                              Sale
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(product)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeleteProductId(product.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="p-12 text-center">
              <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Товары не найдены</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Добавить товар
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Category - First for SKU suggestion */}
            <div className="space-y-2">
              <Label htmlFor="category">Категория *</Label>
              <Select value={formData.category} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* SKU with suggestion */}
            <div className="space-y-2">
              <Label htmlFor="sku">Артикул *</Label>
              <div className="relative">
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value.toUpperCase() }))}
                  placeholder="VOX-XX-000"
                  className="font-mono"
                />
                {formData.category && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                )}
              </div>
              {formData.category && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Check className="w-3 h-3 text-primary" />
                  Следующий свободный артикул для категории
                </p>
              )}
            </div>

            {/* Subcategory */}
            {subcategories.length > 0 && (
              <div className="space-y-2">
                <Label>Подкатегория</Label>
                <Select 
                  value={formData.subcategory} 
                  onValueChange={(v) => setFormData(prev => ({ ...prev, subcategory: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите подкатегорию" />
                  </SelectTrigger>
                  <SelectContent>
                    {subcategories.map((sub) => (
                      <SelectItem key={sub.slug} value={sub.slug}>
                        {sub.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Название *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Название товара"
              />
            </div>

            {/* Price */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Цена *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="oldPrice">Старая цена</Label>
                <Input
                  id="oldPrice"
                  type="number"
                  value={formData.oldPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, oldPrice: e.target.value }))}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="image">URL изображения</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                placeholder="/placeholder.svg"
              />
            </div>

            {/* Tags */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="isNew"
                  checked={formData.isNew}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, isNew: checked as boolean }))
                  }
                />
                <Label htmlFor="isNew" className="cursor-pointer">Новинка</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="isSale"
                  checked={formData.isSale}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, isSale: checked as boolean }))
                  }
                />
                <Label htmlFor="isSale" className="cursor-pointer">Распродажа</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleAddProduct}>
              Добавить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit2 className="w-5 h-5" />
              Редактировать товар
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="edit-category">Категория *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, category: v, subcategory: "" }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* SKU */}
            <div className="space-y-2">
              <Label htmlFor="edit-sku">Артикул *</Label>
              <Input
                id="edit-sku"
                value={formData.sku}
                onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value.toUpperCase() }))}
                placeholder="VOX-XX-000"
                className="font-mono"
              />
            </div>

            {/* Subcategory */}
            {subcategories.length > 0 && (
              <div className="space-y-2">
                <Label>Подкатегория</Label>
                <Select 
                  value={formData.subcategory} 
                  onValueChange={(v) => setFormData(prev => ({ ...prev, subcategory: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите подкатегорию" />
                  </SelectTrigger>
                  <SelectContent>
                    {subcategories.map((sub) => (
                      <SelectItem key={sub.slug} value={sub.slug}>
                        {sub.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="edit-name">Название *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Название товара"
              />
            </div>

            {/* Price */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-price">Цена *</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-oldPrice">Старая цена</Label>
                <Input
                  id="edit-oldPrice"
                  type="number"
                  value={formData.oldPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, oldPrice: e.target.value }))}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="edit-image">URL изображения</Label>
              <Input
                id="edit-image"
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                placeholder="/placeholder.svg"
              />
            </div>

            {/* Tags */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="edit-isNew"
                  checked={formData.isNew}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, isNew: checked as boolean }))
                  }
                />
                <Label htmlFor="edit-isNew" className="cursor-pointer">Новинка</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="edit-isSale"
                  checked={formData.isSale}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, isSale: checked as boolean }))
                  }
                />
                <Label htmlFor="edit-isSale" className="cursor-pointer">Распродажа</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleEditProduct}>
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteProductId} onOpenChange={() => setDeleteProductId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              Удалить товар?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Товар будет удалён из каталога.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteProduct}
              className="bg-destructive hover:bg-destructive/90"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminProducts;
