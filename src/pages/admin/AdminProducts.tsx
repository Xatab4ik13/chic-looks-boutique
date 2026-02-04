import { useState, useMemo, useRef } from "react";
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
  Sparkles,
  Upload,
  Image as ImageIcon
} from "lucide-react";
import { useAdminProductStore, categories, skuPrefixes } from "@/store/adminProductStore";
import { Product, productColors, ProductColor, ColorVariant, allSizes, ProductSize } from "@/types/product";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
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

// Small Image Upload for Color Variants
const SmallImageUpload = ({ 
  value, 
  onChange,
  colorLabel
}: { 
  value: string; 
  onChange: (image: string) => void;
  colorLabel: string;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error("Выберите файл изображения");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onChange(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative">
      {value ? (
        <div className="relative w-16 h-20 rounded overflow-hidden border border-border">
          <img src={value} alt={colorLabel} className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -top-1 -right-1 p-0.5 rounded-full bg-destructive text-white"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-16 h-20 border-2 border-dashed border-border rounded flex items-center justify-center hover:border-primary/50 transition-colors"
        >
          <Upload className="w-4 h-4 text-muted-foreground" />
        </button>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
        className="hidden"
      />
    </div>
  );
};

// Image Upload Component
const ImageUploadField = ({ 
  value, 
  onChange, 
  id 
}: { 
  value: string; 
  onChange: (image: string) => void; 
  id: string;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error("Выберите файл изображения");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>Основное изображение</Label>
      
      {value && (
        <div className="relative w-full aspect-[3/4] max-w-[200px] rounded-lg overflow-hidden border border-border bg-muted">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 p-1 rounded-full bg-background/80 hover:bg-background transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {!value && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50'}
          `}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <Upload className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-sm">Загрузить изображение</p>
              <p className="text-xs text-muted-foreground">Перетащите или нажмите</p>
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
        className="hidden"
        id={id}
      />
    </div>
  );
};

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
    composition: "",
    colorVariants: [] as ColorVariant[],
    availableSizes: [] as ProductSize[],
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
  const handleCategoryChange = async (category: string) => {
    // Сначала обновляем категорию
    setFormData(prev => ({
      ...prev,
      category,
      subcategory: "",
    }));
    
    // Затем получаем SKU асинхронно
    try {
      const nextSku = await getNextSku(category);
      setFormData(prev => ({
        ...prev,
        sku: nextSku,
      }));
    } catch (error) {
      console.error('Error getting next SKU:', error);
    }
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
      composition: "",
      colorVariants: [],
      availableSizes: [],
      isNew: false,
      isSale: false,
    });
  };

  // Toggle color variant
  const toggleColorVariant = (colorValue: ProductColor) => {
    setFormData(prev => {
      const exists = prev.colorVariants.find(v => v.color === colorValue);
      if (exists) {
        return {
          ...prev,
          colorVariants: prev.colorVariants.filter(v => v.color !== colorValue)
        };
      } else {
        return {
          ...prev,
          colorVariants: [...prev.colorVariants, { color: colorValue, image: "" }]
        };
      }
    });
  };

  // Update color variant image
  const updateColorVariantImage = (colorValue: ProductColor, image: string) => {
    setFormData(prev => ({
      ...prev,
      colorVariants: prev.colorVariants.map(v => 
        v.color === colorValue ? { ...v, image } : v
      )
    }));
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
      composition: product.composition || "",
      colorVariants: product.colorVariants || [],
      availableSizes: product.availableSizes || [],
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
      composition: formData.composition || undefined,
      colorVariants: formData.colorVariants.length > 0 ? formData.colorVariants : undefined,
      color: formData.colorVariants.length > 0 ? formData.colorVariants[0].color : undefined,
      availableSizes: formData.availableSizes.length > 0 ? formData.availableSizes : undefined,
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
      composition: formData.composition || undefined,
      colorVariants: formData.colorVariants.length > 0 ? formData.colorVariants : undefined,
      color: formData.colorVariants.length > 0 ? formData.colorVariants[0].color : undefined,
      availableSizes: formData.availableSizes.length > 0 ? formData.availableSizes : undefined,
      isNew: formData.isNew,
      isSale: formData.isSale,
    });

    toast.success("Товар успешно обновлён");
    setIsEditDialogOpen(false);
    setEditingProduct(null);
    resetForm();
  };

  // Toggle size selection
  const toggleSize = (size: ProductSize) => {
    setFormData(prev => {
      const exists = prev.availableSizes.includes(size);
      if (exists) {
        return {
          ...prev,
          availableSizes: prev.availableSizes.filter(s => s !== size)
        };
      } else {
        return {
          ...prev,
          availableSizes: [...prev.availableSizes, size]
        };
      }
    });
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

            {/* Image Upload */}
            <ImageUploadField
              value={formData.image}
              onChange={(image) => setFormData(prev => ({ ...prev, image }))}
              id="image"
            />

            {/* Composition */}
            <div className="space-y-2">
              <Label htmlFor="composition">Состав</Label>
              <Textarea
                id="composition"
                value={formData.composition}
                onChange={(e) => setFormData(prev => ({ ...prev, composition: e.target.value }))}
                placeholder="Например: 90% полиэстер, 10% эластан"
                rows={2}
              />
            </div>

            {/* Color Variants */}
            <div className="space-y-3">
              <Label>Цвета товара (нажмите для выбора, загрузите фото для каждого)</Label>
              <div className="flex flex-wrap gap-2">
                {productColors.map((color) => {
                  const isSelected = formData.colorVariants.some(v => v.color === color.value);
                  return (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => toggleColorVariant(color.value)}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all hover:scale-110 ${
                        isSelected
                          ? "border-foreground ring-2 ring-foreground ring-offset-1"
                          : "border-border"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.label}
                    >
                      {isSelected && (
                        <Check className={`w-4 h-4 ${color.value === 'white' || color.value === 'cream' || color.value === 'beige' ? 'text-foreground' : 'text-white'}`} />
                      )}
                    </button>
                  );
                })}
              </div>
              
              {/* Selected colors with image upload */}
              {formData.colorVariants.length > 0 && (
                <div className="space-y-3 mt-4 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium">Загрузите фото для каждого цвета:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {formData.colorVariants.map((variant) => {
                      const colorInfo = productColors.find(c => c.value === variant.color);
                      return (
                        <div key={variant.color} className="flex flex-col items-center gap-2">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded-full border border-border"
                              style={{ backgroundColor: colorInfo?.hex }}
                            />
                            <span className="text-xs">{colorInfo?.label}</span>
                          </div>
                          <SmallImageUpload
                            value={variant.image}
                            onChange={(img) => updateColorVariantImage(variant.color, img)}
                            colorLabel={colorInfo?.label || variant.color}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Available Sizes */}
            <div className="space-y-3">
              <Label>Доступные размеры (если не выбраны — будут стандартные XS-XL)</Label>
              <div className="flex flex-wrap gap-2">
                {allSizes.map((size) => {
                  const isSelected = formData.availableSizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`px-3 py-2 border text-sm font-medium transition-all ${
                        isSelected
                          ? "border-foreground bg-foreground text-background"
                          : "border-border hover:border-foreground"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
              {formData.availableSizes.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  Выбрано: {formData.availableSizes.join(", ")}
                </p>
              )}
            </div>

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

            {/* Image Upload */}
            <ImageUploadField
              value={formData.image}
              onChange={(image) => setFormData(prev => ({ ...prev, image }))}
              id="edit-image"
            />

            {/* Composition */}
            <div className="space-y-2">
              <Label htmlFor="edit-composition">Состав</Label>
              <Textarea
                id="edit-composition"
                value={formData.composition}
                onChange={(e) => setFormData(prev => ({ ...prev, composition: e.target.value }))}
                placeholder="Например: 90% полиэстер, 10% эластан"
                rows={2}
              />
            </div>

            {/* Color Variants */}
            <div className="space-y-3">
              <Label>Цвета товара (нажмите для выбора, загрузите фото для каждого)</Label>
              <div className="flex flex-wrap gap-2">
                {productColors.map((color) => {
                  const isSelected = formData.colorVariants.some(v => v.color === color.value);
                  return (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => toggleColorVariant(color.value)}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all hover:scale-110 ${
                        isSelected
                          ? "border-foreground ring-2 ring-foreground ring-offset-1"
                          : "border-border"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.label}
                    >
                      {isSelected && (
                        <Check className={`w-4 h-4 ${color.value === 'white' || color.value === 'cream' || color.value === 'beige' ? 'text-foreground' : 'text-white'}`} />
                      )}
                    </button>
                  );
                })}
              </div>
              
              {/* Selected colors with image upload */}
              {formData.colorVariants.length > 0 && (
                <div className="space-y-3 mt-4 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium">Загрузите фото для каждого цвета:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {formData.colorVariants.map((variant) => {
                      const colorInfo = productColors.find(c => c.value === variant.color);
                      return (
                        <div key={variant.color} className="flex flex-col items-center gap-2">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded-full border border-border"
                              style={{ backgroundColor: colorInfo?.hex }}
                            />
                            <span className="text-xs">{colorInfo?.label}</span>
                          </div>
                          <SmallImageUpload
                            value={variant.image}
                            onChange={(img) => updateColorVariantImage(variant.color, img)}
                            colorLabel={colorInfo?.label || variant.color}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Available Sizes */}
            <div className="space-y-3">
              <Label>Доступные размеры (если не выбраны — будут стандартные XS-XL)</Label>
              <div className="flex flex-wrap gap-2">
                {allSizes.map((size) => {
                  const isSelected = formData.availableSizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`px-3 py-2 border text-sm font-medium transition-all ${
                        isSelected
                          ? "border-foreground bg-foreground text-background"
                          : "border-border hover:border-foreground"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
              {formData.availableSizes.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  Выбрано: {formData.availableSizes.join(", ")}
                </p>
              )}
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
