import noc from '../models/noc.js';
import Student from '../models/students.js';

export const createNOC = async (req, res) => {
  try {
    const {
      companyName,
      duration,
      startingDate,
      endingDate,
    } = req.body;

    const loggedInStudentId = req.user._id;

    // Validate that all necessary data is provided
    if (!companyName || !duration || !startingDate || !endingDate) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.',
      });
    }

    // Find the logged-in student
    const student = await Student.findById(loggedInStudentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found.',
      });
    }

    // Create a new NOC
    const newNOC = await noc.create({
      companyName,
      duration,
      startingDate,
      endingDate,
      studentEnrolling: student._id,
    });

    // Add the NOC ID to the student's NOCs array
    student.NOCs.push(newNOC._id);
    await student.save();

    res.status(201).json({
      success: true,
      message: 'NOC created successfully.',
      NOC: newNOC,
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
