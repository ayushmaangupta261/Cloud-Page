import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

interface AuthRequest extends Request {
  user?: IUser;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {

  const token = req.headers.authorization?.split(" ")[1];



  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    // decode the token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    // search the user with the token
    const user = await User.findById({ _id: decoded?.id });

    //  user not present
    if (!user) return res.status(401).json({ message: "User not found" });

    // add user to the req
    req.user = user;

    // call next
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
