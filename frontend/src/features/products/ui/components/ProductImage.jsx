import { useState } from "react";
import { ImageOff } from "lucide-react";
import { getProductImageUrls } from "../../utils/product.utils";

export const ProductImage = ({ images = [], alt = "Product", className = "w-full h-48", objectFit = "object-cover" }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [hasError, setHasError] = useState(false);

  const imageUrls = getProductImageUrls(images);
  const currentUrl = imageUrls[activeIdx];

  if (!imageUrls.length || hasError) {
    return (
      <div className={`${className} bg-slate-100 dark:bg-slate-800 rounded-xl flex flex-col items-center justify-center text-slate-400 p-4`}>
        <ImageOff className="w-8 h-8 opacity-40 mb-1" />
        <span className="text-xs font-medium opacity-60">No image available</span>
      </div>
    );
  }

  return (
    <div className="relative group overflow-hidden rounded-xl">
      <img
        src={currentUrl}
        alt={alt}
        onError={() => setHasError(true)}
        className={`${className} ${objectFit} transition-transform duration-500 group-hover:scale-105`}
      />

      {imageUrls.length > 1 && (
        <div className="absolute bottom-2 inset-x-0 flex items-center justify-center gap-1.5 p-1 bg-black/30 backdrop-blur-sm mx-auto w-fit rounded-full">
          {imageUrls.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveIdx(idx);
              }}
              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                activeIdx === idx ? "bg-white w-4" : "bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImage;
