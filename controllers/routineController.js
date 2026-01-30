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
 * Get all routines - DIU Format with Pagination and Search
 * @route GET /api/routines
 * @query page - Page number (default: 1)
 * @query limit - Items per page (default: 20)
 * @query department - Filter by department
 * @query batch - Filter by batch
 * @query semester - Filter by semester
 */
exports.getAllRoutines = async (req, res) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    // Filter parameters
    const { department, batch, semester } = req.query;
    
    // Build dynamic query
    let whereClause = [];
    let params = [];
    
    if (department) {
      whereClause.push('department = ?');
      params.push(department);
    }
    if (batch) {
      whereClause.push('batch = ?');
      params.push(batch);
    }
    if (semester) {
      whereClause.push('semester = ?');
      params.push(semester);
    }
    
    const whereSQL = whereClause.length > 0 ? `WHERE ${whereClause.join(' AND ')}` : '';
    
    // Get total count for pagination
    const [countResult] = await db.query(
      `SELECT COUNT(*) as total FROM routines ${whereSQL}`,
      params
    );
    const totalItems = countResult[0]?.total || 0;
    const totalPages = Math.ceil(totalItems / limit);
    
    // Query to fetch routines with pagination
    const [routines] = await db.query(
      `SELECT * FROM routines ${whereSQL} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Parse JSON fields
    const parsedRoutines = routines.map(routine => ({
      ...routine,
      courses: JSON.parse(routine.courses || '[]'),
      time_slots: JSON.parse(routine.time_slots || '{}')
    }));

    // Return the list of routines with pagination info
    res.status(200).json({
      success: true,
      count: parsedRoutines.length,
      totalItems,
      totalPages,
      currentPage: page,
      itemsPerPage: limit,
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
      department, batch, semester, shift, students_count,
      room_number, counselor_name, counselor_contact,
      courses, time_slots, academic_year, effective_from
    } = req.body;
    
    // Check if routine exists
    const [existing] = await db.query('SELECT id FROM routines WHERE id = ?', [id]);
    
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Routine not found'
      });
    }
    
    // Convert objects to JSON strings
    const coursesJSON = courses ? JSON.stringify(courses) : null;
    const timeSlotsJSON = time_slots ? JSON.stringify(time_slots) : null;
    
    // Update routine
    await db.query(
      `UPDATE routines SET 
        department = COALESCE(?, department),
        batch = COALESCE(?, batch),
        semester = COALESCE(?, semester),
        shift = COALESCE(?, shift),
        students_count = COALESCE(?, students_count),
        room_number = COALESCE(?, room_number),
        counselor_name = COALESCE(?, counselor_name),
        counselor_contact = COALESCE(?, counselor_contact),
        courses = COALESCE(?, courses),
        time_slots = COALESCE(?, time_slots),
        academic_year = COALESCE(?, academic_year),
        effective_from = COALESCE(?, effective_from)
      WHERE id = ?`,
      [department, batch, semester, shift, students_count,
       room_number, counselor_name, counselor_contact,
       coursesJSON, timeSlotsJSON, academic_year, effective_from, id]
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
