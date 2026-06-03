import jwt from "jsonwebtoken";
import User from "../models/User.js";
export const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
            const user = await User.findById(decoded.id).select("-passwordHash");
            if (!user) {
                res.status(401).json({ message: "Not authorized, user not found" });
                return;
            }
            req.user = user;
            next();
        }
        catch (error) {
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    }
    if (!token) {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(403).json({
                message: `User is not authorized to access this route`,
            });
            return;
        }
        const userRole = String(req.user.role || "")
            .trim()
            .toLowerCase();
        const allowedRoles = roles.map((role) => String(role).trim().toLowerCase());
        if (roles.length > 0 && !allowedRoles.includes(userRole)) {
            console.log(`Authorize middleware failed: User role is ${req.user.role}, required roles: ${roles.join(", ")}`);
            res.status(403).json({
                message: `Role ${req.user.role} is not authorized to access this route`,
            });
            return;
        }
        next();
    };
};
//# sourceMappingURL=auth.js.map