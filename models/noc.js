import mongoose from "mongoose";

const nocSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    studentEnrolling: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    startingDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    endingDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("noc", nocSchema);
