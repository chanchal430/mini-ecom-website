import ProductCard from "./ProductCard";
import { PackageOpen } from "lucide-react";

export const ProductList = ({ products = [] }) => {
  if (!products.length) {
    return (
      <div className="py-16 text-center flex flex-col items-center justify-center bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-8">
        <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center mb-4">
          <PackageOpen className="w-8 h-8" />
        </div>
        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">
          No Products Found
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
          No items match your criteria right now. Check back soon or try adjusting your search filters!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
