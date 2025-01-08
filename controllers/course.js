import TryCatch from "../middlewares/TryCatch.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";
import { User } from "../models/User.js";

export const getAllCourse = TryCatch(async (req, res) => {
    const courses = await Courses.find();

    res.json({
        courses
    })
})

export const getSingleCourse = TryCatch(async (req, res) => {
    const course = await Courses.findById(req.params.id)

    res.json({
        course
    })
})

export const fetchLectures = TryCatch(async (req, res) => {
    const lectures = await Lecture.find({ course : req.params.id})

    const user = await User.findById(req.user._id);

    if(user.role === "admin"){
        return res.json({ lectures })
    }

    if(!user.subscription.includes(req.params.id)){
        return res.status(400).json({
            message : "You Are Not Subscribed To This Course"
        })
    }

    res.json({lectures })
})

export const fetchLecture = TryCatch(async (req, res) => {
    const lecture = await Lecture.findById(req.params.id)

    const user = await User.findById(req.user._id);

    if(user.role === "admin"){
        return res.json({ lecture })
    }

    if(!user.subscription.includes(lecture.course)){
        return res.status(400).json({
            message : "You Are Not Subscribed To This Course"
        })
    }

    res.json({lecture})
})

export const getMyCourse = TryCatch(async (req, res) => {
    const courses = await Courses.find({_id : req.user.subscription})

    res.json({
        courses,
    })
})

export const addCourseToSubscription = TryCatch(async (req, res) => {
    const user = await User.findById(req.user._id);
    const course = await Courses.findById(req.params.id);
  
    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }
  
    if (user.subscription.includes(course._id)) {
      return res.status(400).json({
        message: "You are already subscribed to this course",
      });
    }
  
    // Add the course to the user's subscription
    user.subscription.push(course._id);
  
    await user.save();
  
    res.status(200).json({
      message: "Course added to your subscription successfully",
      course,
    });
  });
  