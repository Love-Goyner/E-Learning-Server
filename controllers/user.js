import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmail from "../middlewares/sendEmail.js";
import TryCatch from "../middlewares/TryCatch.js";

export const register = TryCatch(async (req, res) => {
  const { email, name, password } = req.body;

  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({
      message: "User already exist",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  user = {
    name,
    email,
    password: hashPassword,
  };

  const otp = Math.floor(Math.random() * 1000000);

  const activationToken = jwt.sign(
    {
      user,
      otp,
    },
    process.env.Activation_Secret,
    {
      expiresIn: "5m",
    }
  );

  const data = {
    name,
    otp,
  };

  await sendEmail(email, "E - Learning", data);
  return res.status(200).json({
    message: "OTP successfully sent to your email",
    activationToken,
  });
});

export const verifyUser = TryCatch(async (req, res) => {
  const { otp , activationToken } = req.body;

  const verify  = jwt.verify(activationToken, process.env.Activation_Secret);

  if(!verify){
    return res.status(400).json({
      message: "Invalid or expired token"
    })
  }

  if(verify.otp !== otp){
    return res.status(400).json({
      message: "Invalid OTP",
    })
  }

    await User.create({
    name: verify.user.name,
    email: verify.user.email,
    password: verify.user.password
  })

  res.status(200).json({
    message: "User registered successfully",
  })
});

export const loginUser = TryCatch(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({email});

  if(!user) {
    return res.status(400).json({
      message :  "Input correct Credencials"
    })
  }

  const mathPassword = await bcrypt.compare(password, user.password);
  
  if(!mathPassword){
    return res.status(400).json({
      message : "Input Password is incorrect"
    })
  }

  const token = jwt.sign({_id : user._id}, process.env.Jwt_sec, {
    expiresIn : "15d"
  })

  res.status(200).json({
    message : `Hello again ${user.name}`,
    token,
    user
  })
})

export const myProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({user});
})