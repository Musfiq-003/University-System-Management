// Controller for Routine Management
// Handles all business logic for class routines
const db = require('../config/db');

/**
 * Add a new class routine - DIU Format
 * @route POST /api/routines
 */
exports.addRoutine = async (req, res) => {
  try {
    // Extract data from request body
    const { 
      department, 
      batch, 
      semester, 
      shift, 
      students_count,
      room_number,
      counselor_name,
      counselor_contact,
      courses, // JSON array of course objects
      time_slots, // JSON object with day-wise time slots
      academic_year,
      effective_from
    } = req.body;

    // Validate required fields
    if (!department || !batch || !semester || !shift || !courses || !time_slots) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: department, batch, semester, shift, courses, time_slots'
      });
    }

    // Convert objects to JSON strings for storage
    const coursesJSON = JSON.stringify(courses);
    const timeSlotsJSON = JSON.stringify(time_slots);

    // Insert routine into database
    const [result] = await db.query(
      `INSERT INTO routines (
        department, batch, semester, shift, students_count, 
        room_number, counselor_name, counselor_contact, 
        courses, time_slots, academic_year, effective_from
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        department, batch, semester, shift, students_count,
        room_number, counselor_name, counselor_contact,
        coursesJSON, timeSlotsJSON, academic_year, effective_from
      ]
    );

    // Return success response with the new routine ID
    res.status(201).json({
      success: true,
      message: 'Routine added successfully',
      data: {
        id: result.insertId,
        department,
        batch,
        semester,
        shift,
        students_count,
        room_number,
        counselor_name,
        counselor_contact,
        courses,
        time_slots,
        academic_year,
        effective_from
      }
    });
  } catch (error) {
    console.error('Error adding routine:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add routine',
      error: error.message
    });
  }
};

/**
 * Get all routines - DIU Format
 * @route GET /api/routines
 */
exports.getAllRoutines = async (req, res) => {
  try {
    // Query to fetch all routines
    const [routines] = await db.query(
      `SELECT * FROM routines ORDER BY created_at DESC`
    );

    // Parse JSON fields
    const parsedRoutines = routines.map(routine => ({
      ...routine,
      courses: JSON.parse(routine.courses || '[]'),
      time_slots: JSON.parse(routine.time_slots || '{}')
    }));

    // Return the list of routines
    res.status(200).json({
      success: true,
      count: parsedRoutines.length,
      data: parsedRoutines
    });
  } catch (error) {
    console.error('Error fetching routines:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch routines',
      error: error.message
    });
  }
};

/**
 * Get routines by day
 * @route GET /api/routines/day/:day
 */
exports.getRoutinesByDay = async (req, res) => {
  try {
    const { day } = req.params;

    // Query routines for specific day
    const [routines] = await db.query(
      'SELECT * FROM routines WHERE day = ? ORDER BY start_time',
      [day]
    );

    res.status(200).json({
      success: true,
      day: day,
      count: routines.length,
      data: routines
    });
  } catch (error) {
    console.error('Error fetching routines by day:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch routines',
      error: error.message
    });
  }
};
