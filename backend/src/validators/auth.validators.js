import { body, validationResult } from "express-validator";
import { handleValidationErrors } from "../middlewares/validation.middleware.js";

export const registerValidator = [
  body("email")
    .exists()
    .withMessage("Email is Required")
    .bail()
    .isString()
    .withMessage("Email must be string value")
    .bail()
    .trim()
    .isEmail()
    .withMessage("Enter a valid Email Address")
    .toLowerCase(),
  body("name")
    .exists()
    .withMessage("Name is Required")
    .bail()
    .trim()
    .isString()
    .withMessage("Name must be string value")
    .bail()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 to 50 Characters long"),
  body("password")
    .hide()
    .exists()
    .withMessage("Password is Required")
    .bail()
    .isString()
    .withMessage("Password must be String value")
    .bail()
    .custom((value) => value.trim().length > 0).withMessage("Password can not be empty or only spaces").bail()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/)
    .withMessage("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
  body("confirmPassword")
    .hide()
    .exists()
    .withMessage("confirmPassword is Required")
    .bail()
    .isString()
    .withMessage("confirmPassword Must be String")
    .bail()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  body("role")
    .optional()
    .isIn(["user","seller"]).withMessage("Role must be either 'user' or 'seller'"),
  handleValidationErrors,
];

export const loginValidator = [
  body("email")
    .exists()
    .withMessage("Email is Required")
    .bail()
    .isString()
    .withMessage("Email must be string value")
    .bail()
    .trim()
    .isEmail()
    .withMessage("Enter a valid email address")
    .toLowerCase(),
  body("password")
    .hide()
    .exists()
    .withMessage("Password is Required")
    .bail()
    .isString()
    .withMessage("Password must be String value")
    .bail()
    .custom((value) => value.trim().length > 0).withMessage("Password can not be empty or only spaces").bail()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 Characters long"),
  handleValidationErrors,
];
