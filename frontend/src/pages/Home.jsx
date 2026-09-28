import { Link } from "react-router";
import { useProducts } from "../features/products/hooks/useProducts";
import ProductList from "../features/products/ui/components/ProductList";
import { ProductCardSkeleton } from "../shared/components/Loader";
import { useAuth } from "../features/auth/hooks/useAuth";
import { ArrowRight, ShoppingBag, ShieldCheck, Zap, Store, Sparkles } from "lucide-react";

export const Home = () => {
  const { products, loading } = useProducts();
  const { isSeller } = useAuth();

  const featuredProducts = products.slice(0, 8);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-8 sm:p-14 shadow-2xl shadow-purple-950/20">
        <div className="relative z-10 max-w-2xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-semibold backdrop-blur">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Full-Stack E-Commerce Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Discover Quality Products & Trusted Merchants
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            A secure e-commerce environment featuring JWT access & refresh token authentication, field-level validation, and ImageKit CDN media delivery.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/products"
              className="px-6 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/40 flex items-center gap-2 transition cursor-pointer"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {isSeller ? (
              <Link
                to="/seller"
                className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm backdrop-blur flex items-center gap-2 transition"
              >
                <Store className="w-4 h-4" />
                <span>Go to Seller Portal</span>
              </Link>
            ) : (
              <Link
                to="/register"
                className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm backdrop-blur flex items-center gap-2 transition"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Become a Seller</span>
              </Link>
            )}
          </div>
        </div>

        {/* Decorative ambient background blur */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Highlights Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">JWT Token Security</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Short-lived access tokens in memory + long-lived httpOnly refresh cookies.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">ImageKit Integration</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Fast CDN uploads with automatic storage cleanup on update and delete.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center shrink-0">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Seller Dashboard</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Full CRUD management with react-hook-form field validation.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Products Catalog */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Featured Catalog
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Explore recently added items from verified sellers
            </p>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 transition"
          >
            <span>View All ({products.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <ProductList products={featuredProducts} />
        )}
      </section>
    </div>
  );
};

export default Home;
