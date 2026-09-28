import { validationResult } from "express-validator";

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedError = errors.array().map((e) => ({
      field: e.path,
      message: e.msg,
    }));

    return res.status(400).json({
      success: false,
      message: "Invalid Request",
      errors: formattedError,
    });
  }

  next();
};
