// Controller for Routine Management
// Handles all business logic for class routines
const db = require('../config/db');
const response = require('../utils/responseHandler');

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
      return response.error(res, 'All fields are required: department, batch, course, teacher, day, start_time, end_time, room_number', 400);
    }

    // Insert routine into database
    const [result] = await db.query(
      `INSERT INTO routines (
        department, batch, course, teacher, day, start_time, end_time, room_number
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [department, batch, course, teacher, day, start_time, end_time, room_number]
    );

    // Return success response with the new routine ID
    return response.success(res, 'Class routine added successfully', {
      id: result.insertId,
      department,
      batch,
      course,
      teacher,
      day,
      start_time,
      end_time,
      room_number
    }, 201);
  } catch (error) {
    console.error('Error adding routine:', error);
    return response.error(res, error, 500);
  }
};

/**
 * Get all routines with pagination, filtering and search
 * @route GET /api/routines
 * @query page, limit, department, batch, course, teacher
 */
exports.getAllRoutines = async (req, res) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    // Filter and search parameters
    const { department, batch, course, teacher } = req.query;

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
    if (course) {
      whereClause.push('course LIKE ?');
      params.push(`%${course}%`);
    }
    if (teacher) {
      whereClause.push('teacher LIKE ?');
      params.push(`%${teacher}%`);
    }

    const whereSQL = whereClause.length > 0 ? `WHERE ${whereClause.join(' AND ')}` : '';

    // Get total count for pagination
    const [countResult] = await db.query(
      `SELECT COUNT(*) as total FROM routines ${whereSQL}`,
      params
    );
    const totalItems = countResult[0].total;

    // Query to fetch routines
    // Sorting order: Custom Day order (Sat-Fri), then Start Time
    const [routines] = await db.query(
      `SELECT * FROM routines ${whereSQL} 
       ORDER BY 
       FIELD(day, 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'),
       start_time
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Return the paginated list of routines
    return response.paginated(res, routines, page, limit, totalItems);
  } catch (error) {
    console.error('Error fetching routines:', error);
    return response.error(res, error, 500);
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
      return response.error(res, 'Routine not found', 404);
    }

    // Delete the routine
    await db.query('DELETE FROM routines WHERE id = ?', [id]);

    return response.success(res, 'Routine deleted successfully');
  } catch (error) {
    console.error('Error deleting routine:', error);
    return response.error(res, error, 500);
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
      return response.error(res, 'Routine not found', 404);
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

    return response.success(res, 'Routine updated successfully');
  } catch (error) {
    console.error('Error updating routine:', error);
    return response.error(res, error, 500);
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

    return response.success(res, `Routines for ${day} fetched successfully`, routines);
  } catch (error) {
    console.error('Error fetching routines by day:', error);
    return response.error(res, error, 500);
  }
};
