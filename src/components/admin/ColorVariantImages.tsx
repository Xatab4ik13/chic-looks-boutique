 import { useRef } from "react";
 import { X, Plus, Upload } from "lucide-react";
 import { productColors, ProductColor } from "@/types/product";
 import { toast } from "sonner";
 
 interface ColorVariantImagesProps {
   color: ProductColor;
   images: string[];
   onImagesChange: (images: string[]) => void;
   maxImages?: number;
 }
 
 const ColorVariantImages = ({
   color,
   images,
   onImagesChange,
   maxImages = 5,
 }: ColorVariantImagesProps) => {
   const fileInputRef = useRef<HTMLInputElement>(null);
   const colorInfo = productColors.find((c) => c.value === color);
 
   const handleFileChange = (files: FileList | null) => {
     if (!files) return;
 
     const remainingSlots = maxImages - images.length;
     if (remainingSlots <= 0) {
       toast.error(`Максимум ${maxImages} фото на цвет`);
       return;
     }
 
     const filesToProcess = Array.from(files).slice(0, remainingSlots);
 
     filesToProcess.forEach((file) => {
       if (!file.type.startsWith("image/")) {
         toast.error("Выберите файл изображения");
         return;
       }
 
       const reader = new FileReader();
       reader.onload = (e) => {
         const result = e.target?.result as string;
         onImagesChange([...images, result]);
       };
       reader.readAsDataURL(file);
     });
 
     // Reset input
     if (fileInputRef.current) {
       fileInputRef.current.value = "";
     }
   };
 
   const removeImage = (index: number) => {
     onImagesChange(images.filter((_, i) => i !== index));
   };
 
   const moveImage = (fromIndex: number, toIndex: number) => {
     const newImages = [...images];
     const [movedItem] = newImages.splice(fromIndex, 1);
     newImages.splice(toIndex, 0, movedItem);
     onImagesChange(newImages);
   };
 
   return (
     <div className="space-y-3 p-4 bg-muted/30 rounded-lg border border-border">
       {/* Header */}
       <div className="flex items-center gap-2">
         <div
           className="w-5 h-5 rounded-full border border-border"
           style={{ backgroundColor: colorInfo?.hex }}
         />
         <span className="font-medium text-sm">{colorInfo?.label}</span>
         <span className="text-xs text-muted-foreground ml-auto">
           {images.length}/{maxImages} фото
         </span>
       </div>
 
       {/* Images Grid */}
       <div className="grid grid-cols-5 gap-2">
         {images.map((image, index) => (
           <div
             key={index}
             className="relative aspect-[3/4] rounded overflow-hidden border border-border group"
           >
             <img
               src={image}
               alt={`${colorInfo?.label} - ${index + 1}`}
               className="w-full h-full object-cover"
             />
 
             {/* Order indicator */}
             <div className="absolute top-1 left-1 w-5 h-5 bg-background/80 rounded-full flex items-center justify-center text-xs font-medium">
               {index + 1}
             </div>
 
             {/* Remove button */}
             <button
               type="button"
               onClick={() => removeImage(index)}
               className="absolute top-1 right-1 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
             >
               <X className="w-3 h-3" />
             </button>
 
             {/* Move buttons */}
             <div className="absolute bottom-1 left-1 right-1 flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
               {index > 0 && (
                 <button
                   type="button"
                   onClick={() => moveImage(index, index - 1)}
                   className="w-5 h-5 bg-background/80 rounded text-xs"
                 >
                   ←
                 </button>
               )}
               {index < images.length - 1 && (
                 <button
                   type="button"
                   onClick={() => moveImage(index, index + 1)}
                   className="w-5 h-5 bg-background/80 rounded text-xs"
                 >
                   →
                 </button>
               )}
             </div>
           </div>
         ))}
 
         {/* Add button */}
         {images.length < maxImages && (
           <button
             type="button"
             onClick={() => fileInputRef.current?.click()}
             className="aspect-[3/4] border-2 border-dashed border-border rounded flex flex-col items-center justify-center gap-1 hover:border-primary/50 transition-colors"
           >
             <Plus className="w-4 h-4 text-muted-foreground" />
             <span className="text-[10px] text-muted-foreground">Добавить</span>
           </button>
         )}
       </div>
 
       {/* Hidden file input */}
       <input
         ref={fileInputRef}
         type="file"
         accept="image/*"
         multiple
         onChange={(e) => handleFileChange(e.target.files)}
         className="hidden"
       />
 
       {images.length === 0 && (
         <p className="text-xs text-muted-foreground text-center">
           Нажмите + чтобы загрузить фото для этого цвета
         </p>
       )}
     </div>
   );
 };
 
 export default ColorVariantImages;