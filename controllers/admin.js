import TryCatch from "../middlewares/TryCatch.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";
import { rm, unlink }from "fs"
import { promisify } from "util";
import fs from "fs";
import {User} from "../models/User.js"

export const createCourse = TryCatch(async (req, res) => {
  const { title, description, category, createdBy, duration, price } = req.body;

  const image = req.file;

  const newCourse = await Courses.create({
    title,
    description,
    category,
    createdBy,
    image: image?.path,
    duration,
    price,
  });

  res.status(200).json({
    message: "Course Creates Successfully",
    newCourse,
  });
});

export const addLectures = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);

  if (!course) {
    return res.status(400).json({
      message: "No Course with this id",
    });
  }

  const { title, description } = req.body;
  const file = req.file;

  const lecture = await Lecture.create({
    title,
    description,
    video: file?.path,
    course: course._id,
  });
  

  res.status(201).json({
    message: "Lecture is Created Successfully",
    lecture,
  });
});

export const deleteLecture = TryCatch(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);

  rm(lecture.video, ()=>{
    console.log("Lecture Video deleted Successfully")
  })

  await lecture.deleteOne();

  res.json({
    message: "Lecture is deleted Succesfully"
  })
})

const unlinkAsync = promisify(fs.unlink);

export const deleteCourse = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);

  const lectures = await Lecture.find({course: course._id});

  await Promise.all(
    lectures.map(async (lecture) => {
      await unlinkAsync(lecture.video);
      console.log("Lecture Video Deleted Successfully");
    })
  )

  rm(course.image, () =>{
    console.log("Course Image Deleted Successfully");
  })

  await Lecture.find({course : req.params.id}).deleteMany();
  await course.deleteOne();

  await User.updateMany({}, {$pull : { subscription : req.params.id}});

  res.status(200).json({
    message: "Course have been Deleted Successfully"
  })
})

export const getAllStats = TryCatch(async (req, res) => {
  const courses = (await (Courses.find())).length;
  const lectures = (await (Lecture.find())).length;
  const users = (await (User.find())).length;

  const stats = {
    courses,
    lectures,
    users
  }

  res.status(200).json({
    stats
  })
})

export const getAllUser = TryCatch(async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user.id } }).select("-password");
  return res.json({ users });
})

export const updateRole = TryCatch(async (req, res) => {
  const user = await User.findById(req.params.id);

  if(user.role === "admin"){
    user.role = "user"
    await user.save();
    
    return res.status(200).json({
      message : "Role Updated"
    })
  }

  if(user.role === "user"){
    user.role = "admin"
    await user.save();
    
    return res.status(200).json({
      message : "Role Updated to Admin"
    })
  }
})