import mongoose from "mongoose";
import bcrypt from "bcrypt";

const studentSchema = new mongoose.Schema(
  {
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    fatherName: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      default: Date.now,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    registerationNumber: {
      type: String,
      required: true,
    },
    rollNumber: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
    admissionYear: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    NOCs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "NOC",
      },
    ],
  },
  { timestamps: true }
);

studentSchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      const registrationNumber = this.registerationNumber;

      // Hash the registration number and set it as the initial password
      const hashedPassword = await bcrypt.hash(registrationNumber, 10);
      this.password = hashedPassword;
    }
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model("Student", studentSchema);
