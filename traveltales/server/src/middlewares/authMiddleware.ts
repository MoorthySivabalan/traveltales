import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Not authorized. No token." });
      return;
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { id: string; role: string };

    console.log("Decoded token:", decoded);

    // ✅ IMPORTANT FIX (no mongoose ObjectId)
    req.userId = decoded.id;
    req.userRole = decoded.role;

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};