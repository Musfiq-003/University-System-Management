// Controller for Routine Management
// Handles all business logic for class routines
const db = require('../config/db');

/**
 * Add a new class routine
 * @route POST /api/routines
 */
exports.addRoutine = async (req, res) => {
  try {
    // Extract data from request body
    const { course, teacher, department, start_time, end_time, batch } = req.body;

    // Validate required fields
    if (!course || !teacher || !department || !start_time || !end_time || !batch) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required (course, teacher, department, start_time, end_time, batch)'
      });
    }

    // Insert routine into database
    const [result] = await db.query(
      'INSERT INTO routines (course, teacher, department, start_time, end_time, batch) VALUES (?, ?, ?, ?, ?, ?)',
      [course, teacher, department, start_time, end_time, batch]
    );

    // Return success response with the new routine ID
    res.status(201).json({
      success: true,
      message: 'Routine added successfully',
      data: {
        id: result.insertId,
        course,
        teacher,
        department,
        start_time,
        end_time,
        batch
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
 * Get all routines
 * @route GET /api/routines
 */
exports.getAllRoutines = async (req, res) => {
  try {
    // Query to fetch all routines ordered by day and start time
    const [routines] = await db.query(
      'SELECT * FROM routines ORDER BY FIELD(day, "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"), start_time'
    );

    // Return the list of routines
    res.status(200).json({
      success: true,
      count: routines.length,
      data: routines
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
