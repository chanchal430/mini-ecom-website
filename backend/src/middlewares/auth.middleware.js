import { readAccessTokens } from "../utils/auth.utils.js";

export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Access Token missing or invalid format in Authorization Header"
        });
    }

    const accessToken = authHeader.split(" ")[1];

    if(!accessToken) {
        return res.status(401).json({
            success: false,
            message: "Access Token Not Found"
        })
    }

    try {
        const decoded = readAccessTokens(accessToken);
        req.user = decoded;
        next()
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or Expire Access Token"
        })
    }
}

export const authenticateSeller = (req, res, next) => {
    if(req.user?.role !== "seller") {
        return res.status(403).json({
            success: false,
            message: "Forbidden: User is not authorized as a seller"
        })
    }
    next();
}