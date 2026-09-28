import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useProducts } from "../../hooks/useProducts";
import ProductForm from "../components/ProductForm";
import { ArrowLeft, PlusCircle } from "lucide-react";

export const CreateProduct = () => {
  const navigate = useNavigate();
  const { createProduct } = useProducts();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      await createProduct(formData);
      navigate("/seller");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Create New Product</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Fill in product details, pricing, sizes, and upload up to 5 images.
            </p>
          </div>
        </div>

        <ProductForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
};

export default CreateProduct;
