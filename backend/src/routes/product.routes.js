import { Router } from "express";
import {
  authenticate,
  authenticateSeller,
} from "../middlewares/auth.middleware.js";
import {
  createProductValidator,
  productIdValidator,
  updateProductValidator,
} from "../validators/product.validator.js";
import {
  createProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
  updateProduct
} from "../controller/product.controller.js";
import { parseProductData } from "../middlewares/product.middleware.js";
import { upload } from "../config/multer.js";

const router = Router();

/**
 * @method POST
 * @description Seller can create product and save data in DB, images will be stored in ImageKit
 * @param req.body = { title, description, price: { amount, currency }, sizes: [{size, stock}, {size, stock}]}
 * @param req.files = images
 * @response 201 (If Successful)
 */
router.post(
  "/",
  authenticate,
  authenticateSeller,
  upload.array("images"),
  parseProductData,
  createProductValidator,
  createProduct,
);

/**
 * @method GET
 * @description Get all Products from DB
 */
router.get("/", getAllProducts);

/**
 * @method GET
 * @description Get product by Id
 */
router.get("/:id", productIdValidator, getProductById);

/**
 * @method DELETE
 * @description Seller can Delete a particular product
 */
router.delete(
  "/:id",
  authenticate,
  authenticateSeller,
  productIdValidator,
  deleteProduct,
);

/**
 * @method PUT
 * @description Update full Product by id
 */
router.put("/:id", authenticate, authenticateSeller, productIdValidator, upload.array("images"), parseProductData, updateProductValidator, updateProduct);

export default router;
