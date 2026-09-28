import { body, param } from "express-validator";
import { handleValidationErrors } from "../middlewares/validation.middleware.js";

export const createProductValidator = [
  body("title")
    .exists()
    .withMessage("Title is Required")
    .bail()
    .trim()
    .isString()
    .withMessage("Title must be a String value")
    .bail()
    .isLength({ min: 2, max: 100 })
    .withMessage("Title Must be between 2 to 100 Characters long")
    .bail()
    .matches(/^[a-zA-Z0-9\s\-_',.&()]+$/)
    .withMessage("Title can only contain letters, numbers, spaces, and basic punctuation (- _ ' , . & ())"),
  body("description")
    .exists()
    .withMessage("Description is Required")
    .bail()
    .trim()
    .isString()
    .withMessage("Description must be String value")
    .bail()
    .isLength({ min: 20, max: 500 })
    .withMessage("Description must be between 20 to 500 characters long"),
  body("price.amount")
    .exists()
    .withMessage("Price Amount is Required")
    .bail()
    .isFloat({ min: 0 })
    .withMessage("Price Amount must be a number and cannot be negative"),
  body("price.currency")
    .exists()
    .withMessage("Price currency is Required")
    .bail()
    .isString()
    .withMessage("Price Currency must be String value")
    .bail()
    .isIn(["INR", "USD"])
    .withMessage("Price Currency should be either INR or USD"),
  body("sizes")
    .exists()
    .withMessage("Sizes is Required")
    .bail()
    .isArray()
    .withMessage("Sizes must be array of objects"),
  body("sizes.*.size")
    .exists()
    .withMessage("size is Required in every entry of sizes array")
    .bail()
    .isString()
    .withMessage("size must be string value in sizes array")
    .bail()
    .trim()
    .isIn(["XS", "S", "M", "L", "XL", "XXL"])
    .withMessage("Size must be only among these XS,S,M,L,XL,XXL"),
  body("sizes.*.stock")
    .exists()
    .withMessage("stock is required in every entry of the sizes array")
    .bail()
    .isInt({ min: 0 })
    .withMessage(
      "stock must be a integer value and can not be negative in sizes array",
    )
    .bail(),
  handleValidationErrors,
];

export const productIdValidator = [
  param("id")
    .exists()
    .withMessage("Product Id is Required")
    .bail()
    .isMongoId()
    .withMessage("Invalid Product Id"),
  handleValidationErrors,
];

export const updateProductValidator = [
  body("title")
    .optional()
    .trim()
    .isString()
    .withMessage("Title must be a String value")
    .bail()
    .isLength({ min: 2, max: 100 })
    .withMessage("Title Must be between 2 to 100 Characters long")
    .bail()
    .matches(/^[a-zA-Z0-9\s\-_',.&()]+$/)
    .withMessage("Title can only contain letters, numbers, spaces, and basic punctuation (- _ ' , . & ())"),
  body("description")
    .optional()
    .trim()
    .isString()
    .withMessage("Description must be String value")
    .bail()
    .isLength({ min: 20, max: 500 })
    .withMessage("Description must be between 20 to 500 characters long"),
  body("price").optional().isObject().withMessage("Price must be an object"),
  body("price.amount")
    .if((value, { req }) => req.body.price !== undefined)
    .exists()
    .withMessage("Price Amount is Required").bail()
    .isFloat({ min: 0 })
    .withMessage("Price Amount must be a number and cannot be negative"),
  body("price.currency")
    .if((value, { req }) => req.body.price !== undefined)
    .exists()
    .withMessage("Price Currency is Required").bail()
    .isString()
    .withMessage("Price Currency must be String value")
    .bail()
    .isIn(["INR", "USD"])
    .withMessage("Price Currency should be either INR or USD"),
  body("sizes")
    .optional()
    .isArray()
    .withMessage("Sizes must be array of objects"),
  body("sizes.*.size")
    .optional()
    .isString()
    .withMessage("size must be string value in sizes array")
    .bail()
    .trim()
    .isIn(["XS", "S", "M", "L", "XL", "XXL"])
    .withMessage("Size must be only among these XS,S,M,L,XL,XXL"),
  body("sizes.*.stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage(
      "stock must be a integer value and can not be negative in sizes array",
    )
    .bail(),
  body("deletedImageIds")
    .optional()
    .isArray().withMessage("deletedImageIds must be an array or image id"),
  body("deletedImageIds.*")
    .optional()
    .isString().withMessage("Each deleted image id must be a string").bail()
    .trim()
    .notEmpty().withMessage("deleted image id can not be empty"),
  handleValidationErrors,
];
