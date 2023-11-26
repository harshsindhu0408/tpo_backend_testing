import axios from "axios";
import Student from "../models/students.js";
import jwt from "jsonwebtoken";
import { comparePassword, hashPassword } from "../helpers/bcrypt.js";
import bcrypt from "bcrypt";
import mongoose from 'mongoose';
import noc from "../models/noc.js";

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
        message: "Incorrect Password",
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

// get student profile controller
export const studentProfile = async (req, res) => {
  try {
    const user = await Student.findById(req.user._id).select("-password"); // password excluded

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
      return res
        .status(400)
        .send({ success: false, message: "All fields are mandatory" });
    }

    const studentId = req.user._id;

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
    await Student.findByIdAndUpdate(user._id, { password: hashed });
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
    const loggedInStudentId = req.user._id;

    // Find the logged-in student
    const student = await Student.findById(loggedInStudentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found.',
      });
    }

    // Find all NOCs associated with the student ID
    const studentNOCs = await noc.find({ studentEnrolling: student._id });

    res.status(200).json({
      success: true,
      message: 'All NOCs for the logged-in student retrieved successfully',
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


const updateExistingStudents = async () => {
  let connection;
  try {
    connection = await mongoose.createConnection('mongodb+srv://harshsindhupvt:6EtBMUGjZPz6k3iu@cluster0.3j7h4kw.mongodb.net/UIET_NOC_DP', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const students = await Student.find();

    for (const student of students) {
      if (!student.password.startsWith('$2')) {
        // If the password is not hashed (doesn't start with '$2')
        const hashedPassword = await hashPassword(student.password);

        // Use updateOne to update the document by user ID
        await Student.updateOne(
          { _id: student._id },
          { $set: { password: hashedPassword } }
        );
      }
    }

    console.log('Existing student passwords updated successfully.');
  } catch (error) {
    console.error('Error updating existing student passwords:', error);
  } finally {
    if (connection) {
      connection.close();
    }
  }
};

// Call the function to update existing students
updateExistingStudents();
