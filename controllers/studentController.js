import axios from "axios";
import Student from "../models/students.js";
import jwt from "jsonwebtoken";
import { comparePassword, hashPassword } from "../helpers/bcrypt.js";
import bcrypt from "bcrypt";
import mongoose from 'mongoose';

// loginStudent controller
export const loginStudent = async (req, res) => {
  try {
    const { registerationNumber, password } = req.body;
    //vaildation
    if (!registerationNumber || !password) {
      return res.status(400).send({
        success: false,
        message: "Invalid Registeration number or Password",
      });
    }
    //check student
    const user = await Student.findOne({ registerationNumber });
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "This registerationNumber is not registered with us",
      });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(400).send({
        success: false,
        message: "Password is not hashed",
      });
    }

    //token
    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECERT, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

export const studentProfile = async (req, res) => {
  try {
    const user = await Student.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//ChangePasswordController
export const updatePassword = async (req, res) => {
  try {
    const { oldpassword, newpassword } = req.body;
    if (!oldpassword || !newpassword) {
      res
        .status(400)
        .send({ success: false, message: "All fields are mandatory" });
    }

    const studentId = req.user._id; // Change the parameter name to studentId
    console.log("During password change: ", studentId);

    // Find the student by ID
    const user = await Student.findById(studentId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Not Registered",
      });
    }

    const match = await comparePassword(oldpassword, user.password);
    if (!match) {
      return res.status(400).send({
        success: false,
        message: "Enter your old password correctly",
      });
    }

    const hashed = await hashPassword(newpassword);
    await students.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

export const getStudentNOCs = async (req, res) => {
    try {
      const userId = req.user._id;
  
      // Find the student using the user ID
      const student = await Student.findOne({ _id: userId });
  
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found',
        });
      }
  
      // Populate the NOCs array to get all associated NOCs
      await student.populate('NOCs').execPopulate();
      const studentNOCs = student.NOCs;
  
      res.status(200).json({
        success: true,
        message: 'Student NOCs retrieved successfully',
        NOCs: studentNOCs,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
};
  

// const updateExistingStudents = async () => {
//   try {
//     const students = await Student.find();
//     console.log("students:", students);

//     for (const student of students) {
//       if (!student.password.startsWith('$2')) {
//         // If the password is not hashed (doesn't start with '$2')
//         const hashedPassword = await bcrypt.hash(student.password, 10);
        
//         // Use findByIdAndUpdate to update the document by its _id
//         await Student.findByIdAndUpdate(
//           student._id,
//           { $set: { password: hashedPassword } },
//           { new: true } // Return the updated document
//         );
//       }
//     }

//     console.log('Existing student passwords updated successfully.');
//   } catch (error) {
//     console.error('Error updating existing student passwords:', error);
//   } finally {
//     mongoose.connection.close();
//   }
// };
// // Call the function to update existing students
// updateExistingStudents();
