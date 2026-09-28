import { useState, useMemo } from "react";
import { useProducts } from "../../hooks/useProducts";
import ProductList from "../components/ProductList";
import { ProductCardSkeleton } from "../../../../shared/components/Loader";
import { Search, ShoppingBag } from "lucide-react";

export const Products = () => {
  const { products, loading, error, refresh } = useProducts();
  const [search, setSearch] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesSearch =
          p.title?.toLowerCase().includes(search.toLowerCase()) ||
          p.description?.toLowerCase().includes(search.toLowerCase()) ||
          p.seller?.name?.toLowerCase().includes(search.toLowerCase());

        const matchesCurrency =
          selectedCurrency === "ALL" || p.price?.currency === selectedCurrency;

        return matchesSearch && matchesCurrency;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return (a.price?.amount || 0) - (b.price?.amount || 0);
        if (sortBy === "price-high") return (b.price?.amount || 0) - (a.price?.amount || 0);
        return 0; // Default order
      });
  }, [products, search, selectedCurrency, sortBy]);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-purple-900/10 via-indigo-900/10 to-slate-900/10 rounded-3xl p-6 sm:p-10 border border-purple-200/50 dark:border-purple-900/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            Marketplace Catalog
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-1">
            Discover Quality Goods
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-xl">
            Explore authentic items crafted and sold directly by verified merchants across the country.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm shrink-0">
          <ShoppingBag className="w-5 h-5 text-purple-600" />
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {filteredProducts.length} Product{filteredProducts.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products by title, keyword, or seller..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm outline-none focus:border-purple-600 transition"
          />
        </div>

        {/* Currency Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold outline-none focus:border-purple-600 transition"
          >
            <option value="ALL">All Currencies</option>
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold outline-none focus:border-purple-600 transition"
          >
            <option value="newest">Featured / Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product Content Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-3xl">
          <p className="text-sm font-semibold text-rose-600 mb-2">{error}</p>
          <button
            onClick={refresh}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition"
          >
            Retry Loading
          </button>
        </div>
      ) : (
        <ProductList products={filteredProducts} />
      )}
    </div>
  );
};

export default Products;
