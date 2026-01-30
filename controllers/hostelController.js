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
 * Get all hostel student records with search and pagination
 * @route GET /api/hostel
 * Query params: page, limit, search, hostel_name, department
 */
exports.getAllHostelStudents = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      search = '', 
      hostel_name = '', 
      department = '' 
    } = req.query;
    
    const offset = (page - 1) * limit;
    
    // Build query dynamically
    let query = 'SELECT * FROM hostel_students WHERE 1=1';
    const params = [];
    
    if (search) {
      query += ' AND (student_name LIKE ? OR student_id LIKE ? OR room_number LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    
    if (hostel_name) {
      query += ' AND hostel_name = ?';
      params.push(hostel_name);
    }
    
    if (department) {
      query += ' AND department = ?';
      params.push(department);
    }
    
    query += ' ORDER BY hostel_name, room_number LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    // Get students
    const [students] = await db.query(query, params);
    
    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM hostel_students WHERE 1=1';
    const countParams = [];
    
    if (search) {
      countQuery += ' AND (student_name LIKE ? OR student_id LIKE ? OR room_number LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }
    
    if (hostel_name) {
      countQuery += ' AND hostel_name = ?';
      countParams.push(hostel_name);
    }
    
    if (department) {
      countQuery += ' AND department = ?';
      countParams.push(department);
    }
    
    const [countResult] = await db.query(countQuery, countParams);
    const total = countResult[0].total;

    res.status(200).json({
      success: true,
      count: students.length,
      total: total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
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

/**
 * Get hostel students by department
 * @route GET /api/hostel/department/:department
 */
exports.getStudentsByDepartment = async (req, res) => {
  try {
    const { department } = req.params;

    // Query students for specific department
    const [students] = await db.query(
      'SELECT * FROM hostel_students WHERE department = ? ORDER BY hostel_name, room_number',
      [department]
    );

    res.status(200).json({
      success: true,
      department: department,
      count: students.length,
      data: students
    });
  } catch (error) {
    console.error('Error fetching students by department:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hostel students',
      error: error.message
    });
  }
};

/**
 * Update hostel student allocation
 * @route PUT /api/hostel/:id
 */
exports.updateHostelStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { student_name, student_id, hostel_name, room_number, department, allocated_date } = req.body;

    // Validate required fields
    if (!student_name || !student_id || !hostel_name || !room_number || !department || !allocated_date) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required (student_name, student_id, hostel_name, room_number, department, allocated_date)'
      });
    }

    // Check if student_id already exists for a different record
    const [existing] = await db.query(
      'SELECT id FROM hostel_students WHERE student_id = ? AND id != ?',
      [student_id, id]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Student ID already exists in hostel records'
      });
    }

    // Update hostel student in database
    const [result] = await db.query(
      'UPDATE hostel_students SET student_name = ?, student_id = ?, hostel_name = ?, room_number = ?, department = ?, allocated_date = ? WHERE id = ?',
      [student_name, student_id, hostel_name, room_number, department, allocated_date, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Hostel student record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Hostel student allocation updated successfully',
      data: {
        id: parseInt(id),
        student_name,
        student_id,
        hostel_name,
        room_number,
        department,
        allocated_date
      }
    });
  } catch (error) {
    console.error('Error updating hostel student:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update hostel student allocation',
      error: error.message
    });
  }
};

/**
 * Delete hostel student allocation
 * @route DELETE /api/hostel/:id
 */
exports.deleteHostelStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete hostel student from database
    const [result] = await db.query(
      'DELETE FROM hostel_students WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Hostel student record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Hostel student allocation deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting hostel student:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete hostel student allocation',
      error: error.message
    });
  }
};
