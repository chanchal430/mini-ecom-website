import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { FieldError, AlertBanner } from "../../../../shared/components/ErrorMessage";
import { Plus, Trash2, Upload, X, Loader2  } from "lucide-react";

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export const ProductForm = ({ initialData = null, onSubmit, isSubmitting = false }) => {
  const isEditMode = Boolean(initialData?._id);
  const [serverError, setServerError] = useState(null);
  const [newFilePreviews, setNewFilePreviews] = useState([]);
  const [deletedImageIds, setDeletedImageIds] = useState([]);

  const defaultSizes = initialData?.sizes?.length
    ? initialData.sizes
    : [
        { size: "M", stock: 10 },
        { size: "L", stock: 15 },
      ];

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      price: {
        amount: initialData?.price?.amount ?? "",
        currency: initialData?.price?.currency || "INR",
      },
      sizes: defaultSizes,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sizes",
  });

  // Existing images from DB
  const existingImages = (initialData?.images || []).filter(
    (img) => !deletedImageIds.includes(img.fileId)
  );

  const handleToggleDeleteExisting = (fileId) => {
    setDeletedImageIds((prev) =>
      prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId]
    );
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const totalCount = existingImages.length + files.length;
    if (totalCount > 5) {
      alert(`A product can have at most 5 images. You currently have ${existingImages.length} retained images.`);
      e.target.value = "";
      return;
    }

    const previews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));
    setNewFilePreviews(previews);
  };

  const handleRemoveNewFile = (idx) => {
    setNewFilePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleFormSubmit = async (values) => {
    setServerError(null);

    const formData = new FormData();
    formData.append("title", values.title.trim());
    formData.append("description", values.description.trim());
    formData.append(
      "price",
      JSON.stringify({
        amount: Number(values.price.amount),
        currency: values.price.currency,
      })
    );

    const formattedSizes = values.sizes.map((s) => ({
      size: s.size,
      stock: Number(s.stock),
    }));
    formData.append("sizes", JSON.stringify(formattedSizes));

    // Append new image files
    newFilePreviews.forEach((item) => {
      formData.append("images", item.file);
    });

    // In edit mode, append deletedImageIds
    if (isEditMode && deletedImageIds.length > 0) {
      formData.append("deletedImageIds", JSON.stringify(deletedImageIds));
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      const responseData = err.response?.data;
      const msg = responseData?.message || "Failed to save product";
      setServerError({
        message: msg,
        errors: Array.isArray(responseData?.errors) ? responseData.errors : [],
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <AlertBanner message={serverError?.message} errors={serverError?.errors} />

      {/* Title */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
          Product Title *
        </label>
        <input
          type="text"
          placeholder="e.g. Vintage Leather Jacket 90s"
          {...register("title", {
            required: "Title is required",
            minLength: { value: 2, message: "Title must be at least 2 characters" },
            maxLength: { value: 100, message: "Title must be at most 100 characters" },
            pattern: {
              value: /^[a-zA-Z0-9\s\-_',.&()]+$/,
              message: "Title can contain letters, numbers, spaces, and basic punctuation",
            },
          })}
          className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border text-sm outline-none transition ${
            errors.title
              ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
              : "border-slate-200 dark:border-slate-800 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
          }`}
        />
        <FieldError error={errors.title} />
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
          Description (Min. 20 chars) *
        </label>
        <textarea
          rows={4}
          placeholder="Provide detailed description of materials, fit, care instructions..."
          {...register("description", {
            required: "Description is required",
            minLength: { value: 20, message: "Description must be at least 20 characters long" },
            maxLength: { value: 500, message: "Description cannot exceed 500 characters" },
          })}
          className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border text-sm outline-none transition ${
            errors.description
              ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
              : "border-slate-200 dark:border-slate-800 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
          }`}
        />
        <FieldError error={errors.description} />
      </div>

      {/* Price & Currency */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Price Amount *
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="999.00"
            {...register("price.amount", {
              required: "Price amount is required",
              min: { value: 0, message: "Price cannot be negative" },
            })}
            className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border text-sm outline-none transition ${
              errors.price?.amount
                ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                : "border-slate-200 dark:border-slate-800 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
            }`}
          />
          <FieldError error={errors.price?.amount} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Currency
          </label>
          <select
            {...register("price.currency")}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
          >
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
          </select>
        </div>
      </div>

      {/* Sizes & Stock Array */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Inventory by Size
            </h4>
            <p className="text-[11px] text-slate-500">Specify available sizes and their units in stock</p>
          </div>
          <button
            type="button"
            onClick={() => append({ size: "M", stock: 5 })}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 hover:bg-purple-200 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Size</span>
          </button>
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-3">
              {/* Size Select */}
              <select
                {...register(`sizes.${index}.size`, { required: "Size is required" })}
                className="w-32 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold outline-none"
              >
                {AVAILABLE_SIZES.map((sz) => (
                  <option key={sz} value={sz}>
                    Size {sz}
                  </option>
                ))}
              </select>

              {/* Stock Input */}
              <div className="flex-1">
                <input
                  type="number"
                  min="0"
                  placeholder="Stock count"
                  {...register(`sizes.${index}.stock`, {
                    required: "Stock is required",
                    min: { value: 0, message: "Stock cannot be negative" },
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs outline-none"
                />
              </div>

              {/* Remove button */}
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition cursor-pointer"
                  title="Remove size"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Image Upload & Management */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-900/50">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
          Product Images (Max 5 Total)
        </label>
        <p className="text-[11px] text-slate-500 mb-3">
          Stored securely on ImageKit CDN with automatic transformations
        </p>

        {/* Existing Images (Edit mode) */}
        {initialData?.images && initialData.images.length > 0 && (
          <div className="mb-4">
            <span className="text-[11px] font-semibold text-slate-500 block mb-2">
              Existing Images (Click ✖ to remove):
            </span>
            <div className="flex flex-wrap gap-3">
              {initialData.images.map((img) => {
                const fileId = img.fileId;
                const isMarkedDelete = deletedImageIds.includes(fileId);
                return (
                  <div key={fileId || img.url} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                    <img
                      src={img.url}
                      alt="Thumbnail"
                      className={`w-full h-full object-cover transition ${
                        isMarkedDelete ? "opacity-30 grayscale" : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => handleToggleDeleteExisting(fileId)}
                      className={`absolute top-1 right-1 p-1 rounded-full text-white cursor-pointer shadow transition ${
                        isMarkedDelete
                          ? "bg-emerald-600 hover:bg-emerald-700"
                          : "bg-rose-600 hover:bg-rose-700"
                      }`}
                      title={isMarkedDelete ? "Keep image" : "Delete image"}
                    >
                      {isMarkedDelete ? <Plus className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    </button>
                    {isMarkedDelete && (
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-rose-600 bg-rose-50/50">
                        Marked Delete
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* New File Previews */}
        {newFilePreviews.length > 0 && (
          <div className="mb-4">
            <span className="text-[11px] font-semibold text-slate-500 block mb-2">
              New Images to Upload:
            </span>
            <div className="flex flex-wrap gap-3">
              {newFilePreviews.map((p, idx) => (
                <div key={idx} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-purple-500">
                  <img src={p.preview} alt="New Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewFile(idx)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white cursor-pointer hover:bg-rose-700 shadow"
                    title="Remove"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* File Input */}
        <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-purple-600 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition bg-white dark:bg-slate-900">
          <Upload className="w-7 h-7 text-purple-600 mb-2" />
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Click to upload new photos
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WEBP up to 5MB each</span>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="sr-only"
          />
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-purple-600/30 flex items-center justify-center gap-2 transition disabled:opacity-60 cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Saving product...</span>
          </>
        ) : (
          <span>{isEditMode ? "Save Changes" : "Create Product"}</span>
        )}
      </button>
    </form>
  );
};

export default ProductForm;
