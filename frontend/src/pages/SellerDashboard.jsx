import { useState, useMemo } from "react";
import { Link } from "react-router";
import { useProducts } from "../features/products/hooks/useProducts";
import { useAuth } from "../shared/hooks/useAuth";
import { PageLoader } from "../shared/components/Loader";
import { getSellerId, formatPrice, getProductImageUrls } from "../features/products/utils/product.utils";
import { PlusCircle, Edit3, Trash2, Package, Store, Eye, Layers, Search } from "lucide-react";

export const SellerDashboard = () => {
  const { products, loading, deleteProduct } = useProducts();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("my"); // "my" | "all"
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // Filter products by current seller ID using getSellerId helper
  const myProducts = useMemo(() => {
    if (!user?.id) return [];
    return products.filter((p) => getSellerId(p.seller) === user.id);
  }, [products, user]);

  const displayedProducts = useMemo(() => {
    const sourceList = activeTab === "my" ? myProducts : products;
    if (!searchQuery.trim()) return sourceList;

    return sourceList.filter((p) =>
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeTab, myProducts, products, searchQuery]);

  const totalStockCount = useMemo(() => {
    return myProducts.reduce((acc, p) => {
      const pStock = (p.sizes || []).reduce((sum, s) => sum + (s.stock || 0), 0);
      return acc + pStock;
    }, 0);
  }, [myProducts]);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This will also purge its images from ImageKit.`)) {
      setDeletingId(id);
      await deleteProduct(id);
      setDeletingId(null);
    }
  };

  if (loading) return <PageLoader text="Loading dashboard data..." />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
            Merchant Workspace
          </span>
          <h1 className="text-2xl font-extrabold text-white mt-0.5">Seller Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your store items, create new products, and track inventory.
          </p>
        </div>

        <Link
          to="/seller/products/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 transition cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Product</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">My Products</p>
            <h3 className="text-2xl font-black text-white mt-1">{myProducts.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-950/60 text-purple-400 border border-purple-800/40 flex items-center justify-center">
            <Store className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Inventory Stock</p>
            <h3 className="text-2xl font-black text-emerald-400 mt-1">{totalStockCount} units</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Marketplace Total</p>
            <h3 className="text-2xl font-black text-white mt-1">{products.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-950/60 text-indigo-400 border border-indigo-800/40 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs & Search controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Tab Buttons */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("my")}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === "my"
                ? "bg-purple-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            My Products ({myProducts.length})
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === "all"
                ? "bg-purple-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            All Store Products ({products.length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-purple-600 transition"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Item</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Sizes & Stock</th>
                <th className="py-3.5 px-4">Seller</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {displayedProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    No products found in this view.
                  </td>
                </tr>
              ) : (
                displayedProducts.map((p) => {
                  const sellerId = getSellerId(p.seller);
                  const isOwner = sellerId === user?.id;
                  const firstImage = getProductImageUrls(p.images)[0] || null;
                  const priceStr = formatPrice(p.price);

                  return (
                    <tr key={p._id} className="hover:bg-slate-800/50 transition">
                      {/* Product image & title */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-slate-800 overflow-hidden border border-slate-700 shrink-0">
                            {firstImage ? (
                              <img src={firstImage} alt={p.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-500">
                                No Img
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-100 max-w-xs truncate">{p.title}</p>
                            <p className="text-[10px] text-slate-400 line-clamp-1">{p.description}</p>
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-bold text-purple-400">{priceStr}</td>

                      {/* Sizes */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {(p.sizes || []).map((s, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700"
                            >
                              {s.size}: {s.stock}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Seller info */}
                      <td className="py-3 px-4 text-slate-400">
                        {p.seller?.name || "Seller"}
                        {isOwner && (
                          <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-950 text-purple-300 border border-purple-800">
                            YOU
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right space-x-2">
                        <Link
                          to={`/products/${p._id}`}
                          className="inline-flex items-center p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                          title="View Product"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        {isOwner && (
                          <>
                            <Link
                              to={`/seller/products/${p._id}/edit`}
                              className="inline-flex items-center p-1.5 rounded-lg text-purple-400 hover:bg-purple-950/50 transition"
                              title="Edit Product"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Link>

                            <button
                              onClick={() => handleDelete(p._id, p.title)}
                              disabled={deletingId === p._id}
                              className="inline-flex items-center p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/50 transition cursor-pointer disabled:opacity-30"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
