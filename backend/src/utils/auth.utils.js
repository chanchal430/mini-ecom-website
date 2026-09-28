import jwt from "jsonwebtoken";
import config from "../config/config.js";

export const generateTokens = ({ userId, role }) => {
  try {
    const accessToken = jwt.sign({ userId, role }, config.ACCESS_JWT_SECRET, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign({ userId, role }, config.REFRESH_JWT_SECRET, {
      expiresIn: "7d",
    });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("Error Generating Tokens", error.message);
  }
};

export const readAccessTokens = (token) => {
  return jwt.verify(token, config.ACCESS_JWT_SECRET)
}

export const readRefreshToken = (token) => {
  return jwt.verify(token, config.REFRESH_JWT_SECRET);
}