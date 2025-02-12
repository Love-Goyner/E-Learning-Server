import express from "express";
import { isAdmin, isAuth } from "../middlewares/isAuth.js";
import { addLectures, createCourse, deleteCourse, deleteLecture, getAllStats, getAllUser, updateRole } from "../controllers/admin.js";
import { uplodeFile } from "../middlewares/multer.js";

const router = express.Router();

router.post("/course/new", isAuth, isAdmin, uplodeFile, createCourse);
router.post("/course/:id", isAuth, isAdmin, uplodeFile, addLectures);
router.delete("/lecture/:id", isAuth, isAdmin, deleteLecture);
router.delete("/course/:id", isAuth, isAdmin, deleteCourse);
router.get("/stats",isAuth, isAdmin, getAllStats);
router.put("/user/:id",isAuth, isAdmin, updateRole);
router.get("/users",isAuth, isAdmin, getAllUser);

export default router;
