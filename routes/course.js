import express from "express";
import { addCourseToSubscription, fetchLecture, fetchLectures, getAllCourse, getMyCourse, getSingleCourse } from "../controllers/course.js";
import { isAuth }  from "../middlewares/isAuth.js"

const router = express.Router();

router.get("/course/all", getAllCourse);
router.get("/course/:id", getSingleCourse);
router.get("/lectures/:id", isAuth , fetchLectures);
router.get("/lecture/:id", isAuth , fetchLecture);
router.get("/mycourse", isAuth , getMyCourse);
router.get("/addcourse/:id", isAuth , addCourseToSubscription);

export default router;