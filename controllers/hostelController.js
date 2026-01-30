// Controller for Hostel Management
// Handles all business logic for hostel student allocations
const db = require('../config/db');

/**
 * Add a new hostel student allocation
 * @route POST /api/hostel
 */
exports.addHostelStudent = async (req, res) => {
  try {
    // Extract data from request body
    const { student_name, student_id, hostel_name, room_number, department, allocated_date } = req.body;

    // Validate required fields
    if (!student_name || !student_id || !hostel_name || !room_number || !department || !allocated_date) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required (student_name, student_id, hostel_name, room_number, department, allocated_date)'
      });
    }

    // Check if student_id already exists
    const [existing] = await db.query(
      'SELECT id FROM hostel_students WHERE student_id = ?',
      [student_id]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Student ID already exists in hostel records'
      });
    }

    // Insert hostel student into database
    const [result] = await db.query(
      'INSERT INTO hostel_students (student_name, student_id, hostel_name, room_number, department, allocated_date) VALUES (?, ?, ?, ?, ?, ?)',
      [student_name, student_id, hostel_name, room_number, department, allocated_date]
    );

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Hostel student allocation added successfully',
      data: {
        id: result.insertId,
        student_name,
        student_id,
        hostel_name,
        room_number,
        department,
        allocated_date
      }
    });
  } catch (error) {
    console.error('Error adding hostel student:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add hostel student allocation',
      error: error.message
    });
  }
};

/**
 * Get all hostel student records
 * @route GET /api/hostel
 */
exports.getAllHostelStudents = async (req, res) => {
  try {
    // Query to fetch all hostel students ordered by hostel name and room number
    const [students] = await db.query(
      'SELECT * FROM hostel_students ORDER BY hostel_name, room_number'
    );

    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    console.error('Error fetching hostel students:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hostel students',
      error: error.message
    });
  }
};

/**
 * Get hostel students by hostel name
 * @route GET /api/hostel/hostel/:hostelName
 */
exports.getStudentsByHostel = async (req, res) => {
  try {
    const { hostelName } = req.params;

    // Query students for specific hostel
    const [students] = await db.query(
      'SELECT * FROM hostel_students WHERE hostel_name = ? ORDER BY room_number',
      [hostelName]
    );

    res.status(200).json({
      success: true,
      hostel: hostelName,
      count: students.length,
      data: students
    });
  } catch (error) {
    console.error('Error fetching students by hostel:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hostel students',
      error: error.message
    });
  }
};

/**
 * Get hostel student by student ID
 * @route GET /api/hostel/student/:studentId
 */
exports.getStudentById = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Query specific student record
    const [students] = await db.query(
      'SELECT * FROM hostel_students WHERE student_id = ?',
      [studentId]
    );

    if (students.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student not found in hostel records'
      });
    }

    res.status(200).json({
      success: true,
      data: students[0]
    });
  } catch (error) {
    console.error('Error fetching student by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student record',
      error: error.message
    });
  }
};
