import express from "express"
import { Url } from "../models/urlModel.js"
import { User } from "../models/userModel.js"
import { nanoid } from 'nanoid'
import bcrypt from 'bcryptjs'




export const signup = async (req, res) => {
  try {

    let { name, email, password, mobileNo, confirmPassword, userType } = req.body;

    if (!name || !email || !password || !mobileNo || !confirmPassword) {
      return res.status(400).json({
        status: "failure",
        message: "All the fields are required",
        data: null,
      });
    }

    let EmailExists = await User.findOne({ email: email })

    if (EmailExists) {
      return res.status(400).json({
        status: "failure",
        message: "Email Allready exists",
        data: null,
      });
    }



    if (mobileNo.length != 10) {
      return res.status(400).json({
        status: "failure",
        message: "Please enter valid mobile no",
        data: null,
      });
    }


    if (password.length < 8) {
      return res.status(400).json({
        status: "failure",
        message: "Password must be of atleast 8 character",
        data: null,
      });
    }

    if (password != confirmPassword) {
      return res.status(400).json({
        status: "failure",
        message: "password and confirm password does not match",
        data: null,
      });
    }


    const round = 5

    let hashedPassword = bcrypt.hashSync(password, round);


    let userData = {
      name: name,
      email: email,
      mobileNo: mobileNo,
      password: hashedPassword,
      userType: userType
    }


    try {
      const createUrl = await User.create(userData);
      const userObject = createUrl.toJSON();
      delete userObject.password

      return res.status(200).json({
        status: "success",
        message: "User created successfully",
        data: userObject,
      });
    } catch (error) {

      return res.status(500).json({
        status: "failure",
        message: "Something went wrong",
        data: error || error.stack,
      });
    }

  } catch (error) {

    console.log(error)
  }


}


export const login = async (req, res) => {
  try {

    let { email, password } = req.body;

    let Userexists = await User.findOne({ email: email })

    if (!Userexists) {
      return res.status(200).json({
        status: false,
        message: "Email does not exists",
        data: null,
      });
    }

   let  ResObject={
      name:Userexists.name,
      email:Userexists.email,
      userType:Userexists.userType
    }

    let HashedPassword = Userexists.password

    let PasswordMatch = bcrypt.compareSync(password, HashedPassword);

    if(PasswordMatch){
    
      return res.status(200).json({
        status: true,
        message: "Logged in sucessfully",
        data: ResObject,
      });
    
    }else{
     
      return res.status(200).json({
        status: "false",
        message: "password does not match",
        data: null,
      });
    }





  } catch (error) {

    console.log(error)
  }


}


