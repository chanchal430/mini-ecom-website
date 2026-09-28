import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { getProductByIdApi } from "../../api/product.api";
import { useToast } from "../../../../shared/context/ToastContext";
import { useAuth } from "../../../auth/hooks/useAuth";
import { PageLoader } from "../../../../shared/components/Loader";
import { formatPrice, getProductImageUrls } from "../../utils/product.utils";
import { ShoppingCart, Plus, Minus, ArrowLeft, User } from "lucide-react";

export const ProductDetails = () => {
  const { id } = useParams();
  const { showComingSoon, addToast } = useToast();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await getProductByIdApi(id);
        const prod = res?.data?.product;
        setProduct(prod);
        if (prod?.sizes?.length > 0) {
          setSelectedSize(prod.sizes[0].size);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  if (loading) return <PageLoader text="Loading product details..." />;

  if (error || !product) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-rose-600">Product Not Found</h2>
        <p className="text-sm text-slate-500">{error || "The requested item does not exist."}</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>
      </div>
    );
  }

  const imageUrls = getProductImageUrls(product.images);
  const currentImage = imageUrls[selectedImage] || null;
  const priceFormatted = formatPrice(product.price);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      addToast({
        message: "Please register or login first to add items to your cart",
        type: "error",
      });
      return;
    }
    showComingSoon(`Adding ${quantity}x "${product.title}" (${selectedSize || "Default"}) to Cart`);
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-purple-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Products</span>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Images Gallery */}
        <div className="space-y-4">
          <div className="w-full h-96 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex items-center justify-center">
            {currentImage ? (
              <img
                src={currentImage}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs text-slate-400">No Image Preview</span>
            )}
          </div>

          {/* Thumbnails */}
          {imageUrls.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {imageUrls.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition cursor-pointer ${
                    selectedImage === idx ? "border-purple-600 ring-2 ring-purple-600/20" : "border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={url} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Actions */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Seller Badge */}
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 bg-purple-50 dark:bg-purple-950/40 w-fit px-3 py-1 rounded-full border border-purple-200 dark:border-purple-900">
              <User className="w-3.5 h-3.5" />
              <span>Sold by {product.seller?.name || "Verified Merchant"}</span>
            </div>

            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {product.title}
            </h1>

            {/* Price */}
            <div className="text-3xl font-black text-purple-600 dark:text-purple-400">
              {priceFormatted}
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {product.description}
            </p>

            {/* Sizes Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Select Size
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {product.sizes.map((s) => {
                    const isSelected = selectedSize === s.size;
                    return (
                      <button
                        key={s.size}
                        onClick={() => setSelectedSize(s.size)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                          isSelected
                            ? "bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-600/30"
                            : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-purple-400"
                        }`}
                      >
                        {s.size} ({s.stock} in stock)
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Quantity Stepper & Add to Cart */}
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Quantity:
              </label>
              <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-1">
                <button
                  onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
                  className="p-1.5 text-slate-600 hover:text-purple-600 disabled:opacity-30 cursor-pointer"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center text-sm font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-1.5 text-slate-600 hover:text-purple-600 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full py-4 rounded-2xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition cursor-pointer active:scale-98"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Add to Cart ({quantity})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
