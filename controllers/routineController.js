// Controller for Routine Management
// Handles all business logic for class routines
const db = require('../config/db');

/**
 * Add a new class session (Single Routine Entry)
 * @route POST /api/routines
 */
exports.addRoutine = async (req, res) => {
  try {
    // Extract data from request body
    const {
      department,
      batch,
      course, // Changed from course object to string
      teacher,
      day,
      start_time,
      end_time,
      room_number
    } = req.body;

    // Validate required fields
    if (!department || !batch || !course || !teacher || !day || !start_time || !end_time || !room_number) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: department, batch, course, teacher, day, start_time, end_time, room_number'
      });
    }

    // Insert routine into database
    const [result] = await db.query(
      `INSERT INTO routines (
        department, batch, course, teacher, day, start_time, end_time, room_number
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [department, batch, course, teacher, day, start_time, end_time, room_number]
    );

    // Return success response with the new routine ID
    res.status(201).json({
      success: true,
      message: 'Class routine added successfully',
      data: {
        id: result.insertId,
        department,
        batch,
        course,
        teacher,
        day,
        start_time,
        end_time,
        room_number
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
 * Get all routines - Flat list sorted by Day and Time
 * @route GET /api/routines
 * @query department - Filter by department
 * @query batch - Filter by batch
 */
exports.getAllRoutines = async (req, res) => {
  try {
    // Filter parameters
    const { department, batch } = req.query;

    // Build dynamic query
    let whereClause = [];
    let params = [];

    if (department && department !== 'All') {
      whereClause.push('department = ?');
      params.push(department);
    }
    if (batch && batch !== 'All') {
      whereClause.push('batch = ?');
      params.push(batch);
    }

    const whereSQL = whereClause.length > 0 ? `WHERE ${whereClause.join(' AND ')}` : '';

    // Query to fetch routines
    // Sorting order: Custom Day order (Sat-Thu), then Start Time
    const [routines] = await db.query(
      `SELECT * FROM routines ${whereSQL} 
       ORDER BY 
       FIELD(day, 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'),
       start_time`
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
 * Delete a routine
 * @route DELETE /api/routines/:id
 */
exports.deleteRoutine = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if routine exists
    const [existing] = await db.query('SELECT id FROM routines WHERE id = ?', [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Routine not found'
      });
    }

    // Delete the routine
    await db.query('DELETE FROM routines WHERE id = ?', [id]);

    res.status(200).json({
      success: true,
      message: 'Routine deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting routine:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete routine',
      error: error.message
    });
  }
};

/**
 * Update a routine
 * @route PUT /api/routines/:id
 */
exports.updateRoutine = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      department, batch, course, teacher, day, start_time, end_time, room_number
    } = req.body;

    // Check if routine exists
    const [existing] = await db.query('SELECT id FROM routines WHERE id = ?', [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Routine not found'
      });
    }

    // Update routine
    await db.query(
      `UPDATE routines SET 
        department = COALESCE(?, department),
        batch = COALESCE(?, batch),
        course = COALESCE(?, course),
        teacher = COALESCE(?, teacher),
        day = COALESCE(?, day),
        start_time = COALESCE(?, start_time),
        end_time = COALESCE(?, end_time),
        room_number = COALESCE(?, room_number)
      WHERE id = ?`,
      [department, batch, course, teacher, day, start_time, end_time, room_number, id]
    );

    res.status(200).json({
      success: true,
      message: 'Routine updated successfully'
    });
  } catch (error) {
    console.error('Error updating routine:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update routine',
      error: error.message
    });
  }
};

/**
 * Get routines by day (legacy support if needed)
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
