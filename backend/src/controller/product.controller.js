import productModel from "../models/product.models.js";
import { deleteFiles, uploadFile } from "../services/storage.service.js";

export const createProduct = async (req, res) => {
  try {
    const files = req.files || [];

    const uploadPromises = files.map((file) => {
      return uploadFile({
        buffer: file.buffer,
        fileName: file.originalname,
      });
    });

    const responses = await Promise.all(uploadPromises);

    const imageObjects = responses.map((response) => ({
      url: response.url,
      fileId: response.fileId,
    }));

    const product = await productModel.create({
      title: req.body.title,
      description: req.body.description,
      images: imageObjects,
      price: {
        amount: req.body.price.amount,
        currency: req.body.price.currency,
      },
      sizes: req.body.sizes,
      seller: req.user.userId,
    });

    return res.status(201).json({
      success: true,
      message: "Product Created Successfully",
      data: {
        product,
      },
    });
  } catch (error) {
    console.log("CREATE PRODUCT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      errors: {
        field: "createProduct",
        message: "Failed to create Product",
      },
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const product = await productModel.find().populate("seller", "name email");

    return res.status(200).json({
      success: true,
      message: "All products Fetched Successfully",
      data: {
        product,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      errors: {
        field: "getAllProduct",
        message: "Failed to List All Products",
      },
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await productModel
      .findById(productId)
      .populate("seller", "name email");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: {
        product,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      errors: {
        field: "getProductById",
        message: "Failed to get Product with this Id",
      },
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // confirm if product exists or not
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // ensure logged in user is seller
    if (product.seller.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You are not authorized to delete this product",
      });
    }

    // delete prd from db
    await productModel.findByIdAndDelete(productId);

    // delete images from imageKit
    const fileIds = (product.images || [])
      .map((img) => (typeof img === "object" ? img.fileId : null))
      .filter(Boolean);

    if (fileIds.length > 0) {
      deleteFiles(fileIds).catch((e) =>
        console.error("Failed to delete images from ImageKit:", e),
      );
    }

    return res.status(200).json({
      success: true,
      message: "Product Deleted Successfully",
      data: {
        product,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      errors: {
        field: "deleteProduct",
        message: "Failed to delete Product with this Id",
      },
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { title, description, price, sizes, deletedImageIds = [] } = req.body;

    const existingProduct = await productModel.findById(productId);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    // verify if this prd belongs to the existing seller
    if (existingProduct.seller.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You are not authorized to update this product",
      });
    }

    // only upload new images if seller is getting images files
    const files = req.files || [];
    const deleteIdsList = Array.isArray(deletedImageIds) ? deletedImageIds : [deletedImageIds];

    // separate existingImage into keep
    const imagesToKeep = (existingProduct.images || []).filter((img) => !deleteIdsList.includes(img.fileId));

    // validate max images length 5 before uploading anything
    if(imagesToKeep.length + files.length > 5) {
      return res.status(400).json({
        success: false,
        message: `A product can have at most 5 images. You currently have ${imagesToKeep.length} retained image(s) and are trying to upload ${files.length} new image(s).`
      })
    }

    // build updatedData for the text fields
    const updateData = {};

    if (title !== undefined) {
      updateData.title = title;
    }

    if (description !== undefined) {
      updateData.description = description;
    }

    if (price !== undefined) {
      updateData.price = {
        amount: price.amount,
        currency: price.currency,
      };
    }

    if (sizes !== undefined) {
      updateData.sizes = sizes;
    }

    // handle new uploads if any
    let newUploadedImages = [];
    if (files.length > 0) {
      const uploadPromises = files.map((file) => {
        return uploadFile({
          buffer: file.buffer,
          fileName: file.originalname,
        });
      });

      const responses = await Promise.all(uploadPromises);

      newUploadedImages = responses.map((response) => ({
        url: response.url,
        fileId: response.fileId,
      }));
    }

    //  update images array only if new files were added or old files were deleted
    if(files.length > 0 || deleteIdsList.length > 0) {
      updateData.images = [...imagesToKeep, ...newUploadedImages];

      // delete only the requested deletedImageIds from imagekit
      if(deleteIdsList.length > 0) {
        deleteFiles(deleteIdsList).catch((e) => console.log("failed to delete images from imageKit", e)
        );
      }
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      productId,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: {
        product: updatedProduct,
      },
    });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      errors: {
        field: "updateProduct",
        message: "Failed to update Product with this Id",
      },
    });
  }
};
