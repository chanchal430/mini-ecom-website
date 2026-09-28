import userModel from "../models/user.models.js";
import bcrypt from "bcryptjs";
import { generateTokens, readRefreshToken } from "../utils/auth.utils.js";

export const register = async (req, res) => {
  try {
    const { email, name, password, role = "user" } = req.body;

    const isUserAlreadyExists = await userModel.findOne({ email });

    if (isUserAlreadyExists) {
      return res.status(409).json({
        success: false,
        message: "User Already Exists with this Email! Please Login",
        errors: {
          field: "email",
          message: "Email Already Exists",
        },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      email,
      name,
      passwordHash: hashedPassword,
      role: ["user", "seller"].includes(role) ? role : "user",
    });

    return res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in Register Controller",
      errors: {
        field: "Register",
        message: error.message,
      },
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const { accessToken, refreshToken } = generateTokens({
      userId: user._id,
      role: user.role,
    });

    await userModel.findByIdAndUpdate(user._id, {
      refreshToken,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });

    return res.status(200).json({
      success: "true",
      message: "User Logged in Successfully",
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      accessToken,
    });
  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Error in Login Controller",
      errors: {
        field: "Login",
        message: error.message,
      },
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await userModel.findById(userId);

    return res.status(200).json({
      success: true,
      message: "User Fetched Successfully",
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in getMe Controller",
      errors: {
        field: "getMe",
        message: error.message,
      },
    });
  }
};

export const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh Token Not Found",
      });
    }

    const { userId } = readRefreshToken(refreshToken);

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (refreshToken !== user.refreshToken) {
      await userModel.findByIdAndUpdate(user._id, { refreshToken: null });

      return res.status(401).json({
        success: false,
        message: "Refresh Token mismatch or reuse detected",
      });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens({
      userId: user._id,
      role: user.role,
    });

    await userModel.findByIdAndUpdate(user._id, {
      refreshToken: newRefreshToken,
    });
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });

    return res.status(201).json({
      success: true,
      message: "Token refreshed Successfully",
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      accessToken,
    });
  } catch (error) {
    console.log("REFRESH ERROR:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid Refresh Token",
      errors: {
        field: "refresh",
        message: error.message,
      },
    });
  }
};

export const logout = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await userModel.findByIdAndUpdate(userId, {
      refreshToken: null,
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "User Logged Out Successful",
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Invalid Request",
      errors: {
        field: "logout",
        message: error.message,
      },
    });
  }
};
