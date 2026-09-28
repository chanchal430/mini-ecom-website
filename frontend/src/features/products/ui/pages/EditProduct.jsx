import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { getProductByIdApi } from "../../api/product.api";
import { useProducts } from "../../hooks/useProducts";
import ProductForm from "../components/ProductForm";
import { PageLoader } from "../../../../shared/components/Loader";
import { ArrowLeft, Edit3 } from "lucide-react";

export const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateProduct } = useProducts();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await getProductByIdApi(id);
        setProduct(res?.data?.product);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      await updateProduct(id, formData);
      navigate("/seller");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <PageLoader text="Fetching product data..." />;

  if (error || !product) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-rose-500">Product Error</h2>
        <p className="text-xs text-slate-400">{error || "Could not find product to edit."}</p>
        <Link
          to="/seller"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/seller"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
            <Edit3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Edit Product</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Update pricing, description, sizes stock, or add/remove ImageKit photos.
            </p>
          </div>
        </div>

        <ProductForm initialData={product} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
};

export default EditProduct;
