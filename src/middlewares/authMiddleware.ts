/** @format */

import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

// Extend the Request interface
interface AuthRequest extends Request {
  user?: any; // Modify this type based on your actual user type
}

const { SIGNATURE } = process.env as { SIGNATURE: string }; // Replace with your actual secret key

const authMiddleware = (
  req: AuthRequest, // Use the extended interface
  res: Response,
  next: NextFunction
) => {
  const authorizationHeader = req.header("Authorization");

  if (!authorizationHeader) {
    return res
      .status(401)
      .json({ message: "No Authorization header, authorization denied" });
  }

  const [bearer, token] = authorizationHeader.split(" ");

  if (!token || bearer.toLowerCase() !== "bearer") {
    return res
      .status(401)
      .json({ message: "Invalid Authorization header format" });
  }

  try {
    const decoded = jwt.verify(token, SIGNATURE);

    req.user = (decoded as { user: any }).user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Your session has been expired !" });
  }
};

export default authMiddleware;
