import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface MyJwtPayload extends JwtPayload {
  email: string;
  role: string;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: MyJwtPayload;
  }
}

export function auth(requiredRole?: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access denied. No valid token provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key"
      ) as MyJwtPayload;

      if (requiredRole && decoded.role !== requiredRole) {
        return res.status(403).json({
          message: `Access denied. ${requiredRole} role required.`,
        });
      }

      req.user = decoded; // ✅ typed as MyJwtPayload now
      next();
    } catch (err) {
      return res.status(403).json({
        message: "Invalid or expired token.",
      });
    }
  };
}
