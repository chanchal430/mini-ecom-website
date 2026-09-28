import { useState } from "react";
import { Link } from "react-router";
import ProductImage from "./ProductImage";
import { useToast } from "../../../../shared/context/ToastContext";
import { useAuth } from "../../../auth/hooks/useAuth";
import { formatPrice, calculateTotalStock } from "../../utils/product.utils";
import { Plus, Minus, ShoppingCart, User, Layers } from "lucide-react";

export const ProductCard = ({ product }) => {
  const { showComingSoon, addToast } = useToast();
  const { isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);

  const priceFormatted = formatPrice(product.price);
  const totalStock = calculateTotalStock(product.sizes);

  const handleIncrement = (e) => {
    e.preventDefault();
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = (e) => {
    e.preventDefault();
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      addToast({
        message: "Please register or login first to add items to your cart",
        type: "error",
      });
      return;
    }
    showComingSoon(`Adding ${quantity} item(s) to Cart`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      <div>
        {/* Clickable Image Link */}
        <Link to={`/products/${product._id}`} className="block relative">
          <ProductImage images={product.images} alt={product.title} className="w-full h-52" />
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold bg-white/90 dark:bg-slate-900/90 text-purple-600 dark:text-purple-400 backdrop-blur shadow-sm">
            {priceFormatted}
          </div>
        </Link>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
            <User className="w-3.5 h-3.5 text-purple-500" />
            <span className="truncate">
              Seller: {product.seller?.name || "Verified Merchant"}
            </span>
          </div>

          <Link to={`/products/${product._id}`}>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-purple-600 transition line-clamp-1 mb-1">
              {product.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
            {product.description}
          </p>

          {/* Sizes badges */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap mb-2">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-0.5">
                <Layers className="w-3 h-3" /> Sizes:
              </span>
              {product.sizes.map((s, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  title={`${s.stock} in stock`}
                >
                  {s.size}
                </span>
              ))}
            </div>
          )}

          <div className="text-[11px] font-medium text-slate-500">
            {totalStock > 0 ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                ● {totalStock} in stock
              </span>
            ) : (
              <span className="text-rose-500 font-semibold">● Out of stock</span>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer: Quantity Stepper + Add to Cart */}
      <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800/80 mt-2">
        <div className="flex items-center gap-2 pt-3">
          {/* Quantity Stepper */}
          <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1 py-0.5">
            <button
              onClick={handleDecrement}
              className="p-1.5 hover:text-purple-600 transition cursor-pointer text-slate-500 disabled:opacity-30"
              disabled={quantity <= 1}
              title="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-6 text-center text-xs font-bold text-slate-800 dark:text-slate-200">
              {quantity}
            </span>
            <button
              onClick={handleIncrement}
              className="p-1.5 hover:text-purple-600 transition cursor-pointer text-slate-500"
              title="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="flex-1 py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-98 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-purple-600/30 transition cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
