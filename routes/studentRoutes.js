import express from "express";
import {
  loginStudent,
  studentProfile,
  updatePassword,
  getStudentNOCs,
} from "../controllers/studentController.js";
import { requireSignIn } from "../middlewares/authenticationMiddleware.js";
const router = express.Router();

router.route("/login").post(loginStudent);
router.route("/profile").get(requireSignIn, studentProfile);
router.route("/update-password").put(requireSignIn, updatePassword);
router.route("/get-student-nocs").get(requireSignIn, getStudentNOCs);

export default router;