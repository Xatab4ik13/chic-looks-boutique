import { useState, useEffect } from "react";
 import { motion, AnimatePresence } from "framer-motion";
 import { ChevronLeft, ChevronRight } from "lucide-react";
 
 interface ProductGalleryProps {
   images: string[];
   productName: string;
  resetKey?: string | number; // Reset gallery when this changes (e.g., color index)
 }
 
const ProductGallery = ({ images, productName, resetKey }: ProductGalleryProps) => {
   const [currentIndex, setCurrentIndex] = useState(0);

  // Reset to first image when images change or resetKey changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [resetKey, images.length]);
 
   if (!images || images.length === 0) {
     return (
       <div className="aspect-[3/4] bg-secondary flex items-center justify-center">
         <span className="text-muted-foreground">Нет изображений</span>
       </div>
     );
   }
 
   const goToNext = () => {
     setCurrentIndex((prev) => (prev + 1) % images.length);
   };
 
   const goToPrev = () => {
     setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
   };
 
   const goToIndex = (index: number) => {
     setCurrentIndex(index);
   };
 
   return (
     <div className="relative">
       {/* Main Image */}
       <div className="aspect-[3/4] overflow-hidden bg-secondary relative">
         <AnimatePresence mode="wait">
           <motion.img
             key={currentIndex}
             src={images[currentIndex]}
             alt={`${productName} - изображение ${currentIndex + 1}`}
             className="w-full h-full object-cover absolute inset-0"
             initial={{ opacity: 0, scale: 1.03 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0, scale: 0.97 }}
             transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
           />
         </AnimatePresence>
 
         {/* Navigation Arrows */}
         {images.length > 1 && (
           <>
             <button
               onClick={goToPrev}
               className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 hover:bg-background border border-border rounded-full flex items-center justify-center transition-all hover:scale-105 z-10"
               aria-label="Предыдущее изображение"
             >
               <ChevronLeft className="w-5 h-5" />
             </button>
             <button
               onClick={goToNext}
               className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 hover:bg-background border border-border rounded-full flex items-center justify-center transition-all hover:scale-105 z-10"
               aria-label="Следующее изображение"
             >
               <ChevronRight className="w-5 h-5" />
             </button>
           </>
         )}
       </div>
 
       {/* Thumbnails */}
       {images.length > 1 && (
         <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
           {images.map((image, index) => (
             <button
               key={index}
               onClick={() => goToIndex(index)}
               className={`relative flex-shrink-0 w-16 h-20 overflow-hidden border-2 transition-all ${
                 index === currentIndex
                   ? "border-foreground"
                   : "border-transparent opacity-60 hover:opacity-100"
               }`}
             >
               <img
                 src={image}
                 alt={`${productName} - миниатюра ${index + 1}`}
                 className="w-full h-full object-cover"
               />
             </button>
           ))}
         </div>
       )}
 
       {/* Dots indicator for mobile */}
       {images.length > 1 && (
         <div className="flex justify-center gap-2 mt-4 md:hidden">
           {images.map((_, index) => (
             <button
               key={index}
               onClick={() => goToIndex(index)}
               className={`w-2 h-2 rounded-full transition-all ${
                 index === currentIndex
                   ? "bg-foreground w-6"
                   : "bg-border"
               }`}
               aria-label={`Перейти к изображению ${index + 1}`}
             />
           ))}
         </div>
       )}
     </div>
   );
 };
 
 export default ProductGallery;