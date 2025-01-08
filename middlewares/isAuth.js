import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.status(500).json({
        message: "Please Login First",
      });
    }

    const decodedData = jwt.verify(token, process.env.Jwt_sec);

    req.user = await User.findById(decodedData._id);

    next();
  } catch (error) {
    res.status(500).json({
      message: "Please Login First",
    });
  }
};

export const isAdmin = (req, res, next) => {
  try {
    if(req.user.role !== "admin") {
        return res.status(403).json({
            message : "You are not Admin"
        })
    }

    next();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
