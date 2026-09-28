export const formatPrice = (price) => {
  if (!price) return "₹0";
  const amount = price.amount?.toLocaleString() || 0;
  return price.currency === "USD" ? `$${amount}` : `₹${amount}`;
};

export const getProductImageUrls = (images = []) => {
  if (!Array.isArray(images)) return [];
  return images
    .map((img) => (typeof img === "string" ? img : img?.url))
    .filter(Boolean);
};

export const calculateTotalStock = (sizes = []) => {
  if (!Array.isArray(sizes)) return 0;
  return sizes.reduce((acc, curr) => acc + (curr?.stock || 0), 0);
};

export const getSellerId = (seller) => {
  if (!seller) return null;
  return typeof seller === "object" ? seller._id || seller.id : seller;
};
