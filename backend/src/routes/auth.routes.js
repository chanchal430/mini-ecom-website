import { Router } from "express";
import { registerValidator, loginValidator } from "../validators/auth.validators.js";
import { register, login, getMe, refresh, logout } from "../controller/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * @method POST
 * @description Register User and save data to DB
 * @param req.body = { email, name, password, confirmPassword }
 * @response status = 201 (if Success)
 */
router.post("/register", registerValidator, register);

/**
 * @method POST
 * @description Login User and Return User details
 * @param req.body = { email, password }
 * @response status = 200 (if Success)
 */
router.post("/login", loginValidator, login);

/**
 * @method GET
 * @description Get Logged in User details
 * @response 200 (if successful)
 */
router.get("/me", authenticate, getMe);

/**
 * @method POST
 * @description Create new accessToken and rotate refreshToken 
 * @param req.body = { refreshToken }
 * @response 201 (if Success)
 */
router.post("/refresh-token", refresh);

/**
 * @method POST
 * @description Logout a User delete refresh Token
 * @param req.header = accessToken
 * @response 200 (if success)
 */
router.post("/logout", authenticate, logout);

export default router;