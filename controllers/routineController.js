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
 * Get all routines with search and pagination
 * @route GET /api/routines
 * Query params: page, limit, search, department, batch, day
 */
exports.getAllRoutines = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      search = '', 
      department = '', 
      batch = '', 
      day = '' 
    } = req.query;
    
    const offset = (page - 1) * limit;
    
    // Build query dynamically
    let query = 'SELECT * FROM routines WHERE 1=1';
    const params = [];
    
    if (search) {
      query += ' AND (course LIKE ? OR teacher LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }
    
    if (department) {
      query += ' AND department = ?';
      params.push(department);
    }
    
    if (batch) {
      query += ' AND batch = ?';
      params.push(batch);
    }
    
    if (day) {
      query += ' AND day = ?';
      params.push(day);
    }
    
    query += ` ORDER BY 
       CASE day 
         WHEN 'Monday' THEN 1
         WHEN 'Tuesday' THEN 2
         WHEN 'Wednesday' THEN 3
         WHEN 'Thursday' THEN 4
         WHEN 'Friday' THEN 5
         WHEN 'Saturday' THEN 6
         WHEN 'Sunday' THEN 7
       END, start_time
       LIMIT ? OFFSET ?`;
    
    params.push(parseInt(limit), parseInt(offset));
    
    // Get routines
    const [routines] = await db.query(query, params);
    
    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM routines WHERE 1=1';
    const countParams = [];
    
    if (search) {
      countQuery += ' AND (course LIKE ? OR teacher LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm);
    }
    
    if (department) {
      countQuery += ' AND department = ?';
      countParams.push(department);
    }
    
    if (batch) {
      countQuery += ' AND batch = ?';
      countParams.push(batch);
    }
    
    if (day) {
      countQuery += ' AND day = ?';
      countParams.push(day);
    }
    
    const [countResult] = await db.query(countQuery, countParams);
    const total = countResult[0].total;

    // Return paginated response
    res.status(200).json({
      success: true,
      count: routines.length,
      total: total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
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

/**
 * Get routines by department
 * @route GET /api/routines/department/:department
 */
exports.getRoutinesByDepartment = async (req, res) => {
  try {
    const { department } = req.params;

    // Query routines for specific department
    const [routines] = await db.query(
      `SELECT * FROM routines WHERE department = ? ORDER BY 
       CASE day 
         WHEN 'Monday' THEN 1
         WHEN 'Tuesday' THEN 2
         WHEN 'Wednesday' THEN 3
         WHEN 'Thursday' THEN 4
         WHEN 'Friday' THEN 5
         WHEN 'Saturday' THEN 6
         WHEN 'Sunday' THEN 7
       END, start_time`,
      [department]
    );

    res.status(200).json({
      success: true,
      department: department,
      count: routines.length,
      data: routines
    });
  } catch (error) {
    console.error('Error fetching routines by department:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch routines',
      error: error.message
    });
  }
};

/**
 * Get routines by batch
 * @route GET /api/routines/batch/:batch
 */
exports.getRoutinesByBatch = async (req, res) => {
  try {
    const { batch } = req.params;

    // Query routines for specific batch
    const [routines] = await db.query(
      `SELECT * FROM routines WHERE batch = ? ORDER BY 
       CASE day 
         WHEN 'Monday' THEN 1
         WHEN 'Tuesday' THEN 2
         WHEN 'Wednesday' THEN 3
         WHEN 'Thursday' THEN 4
         WHEN 'Friday' THEN 5
         WHEN 'Saturday' THEN 6
         WHEN 'Sunday' THEN 7
       END, start_time`,
      [batch]
    );

    res.status(200).json({
      success: true,
      batch: batch,
      count: routines.length,
      data: routines
    });
  } catch (error) {
    console.error('Error fetching routines by batch:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch routines',
      error: error.message
    });
  }
};

/**
 * Get routine by ID
 * @route GET /api/routines/:id
 */
exports.getRoutineById = async (req, res) => {
  try {
    const { id } = req.params;

    // Query specific routine
    const [routines] = await db.query(
      'SELECT * FROM routines WHERE id = ?',
      [id]
    );

    if (routines.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Routine not found'
      });
    }

    res.status(200).json({
      success: true,
      data: routines[0]
    });
  } catch (error) {
    console.error('Error fetching routine by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch routine',
      error: error.message
    });
  }
};

/**
 * Update routine
 * @route PUT /api/routines/:id
 */
exports.updateRoutine = async (req, res) => {
  try {
    const { id } = req.params;
    const { course, teacher, department, day, start_time, end_time, batch } = req.body;

    // Validate required fields
    if (!course || !teacher || !department || !start_time || !end_time || !batch) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required (course, teacher, department, day, start_time, end_time, batch)'
      });
    }

    // Update routine in database
    const [result] = await db.query(
      'UPDATE routines SET course = ?, teacher = ?, department = ?, day = ?, start_time = ?, end_time = ?, batch = ? WHERE id = ?',
      [course, teacher, department, day, start_time, end_time, batch, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Routine not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Routine updated successfully',
      data: {
        id: parseInt(id),
        course,
        teacher,
        department,
        day,
        start_time,
        end_time,
        batch
      }
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
 * Delete routine
 * @route DELETE /api/routines/:id
 */
exports.deleteRoutine = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete routine from database
    const [result] = await db.query(
      'DELETE FROM routines WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Routine not found'
      });
    }

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
