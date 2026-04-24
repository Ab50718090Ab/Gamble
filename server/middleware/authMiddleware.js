import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY_ACCESS_TOKEN;

function AuthMiddleware(req, res, next) {
    const token =
        req.cookies?.accessToken ||
        req.headers.authorization?.split(" ")[1];

    // 🔴 No token
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "No access token found",
        });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);

        // 🔴 safety check
        if (!decoded?.id) {
            return res.status(401).json({
                success: false,
                message: "Invalid token payload",
            });
        }

        req.user = {
            id: decoded.id,
            email: decoded.email,
        };

        next();

    } catch (error) {

        // 🔴 expired token (frontend will trigger refresh)
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Access token expired",
                code: "TOKEN_EXPIRED"
            });
        }

        // 🔴 invalid token
        return res.status(401).json({
            success: false,
            message: "Invalid token",
            error: error.message,
        });
    }
}

export default AuthMiddleware;