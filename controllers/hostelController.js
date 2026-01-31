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
 * Get all hostel student records with pagination and search
 * @route GET /api/hostel
 * @query page, limit, search, hostel_name, department
 */
exports.getAllHostelStudents = async (req, res) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    // Search and filter parameters
    const search = req.query.search || '';
    const hostelName = req.query.hostel_name || '';
    const department = req.query.department || '';
    
    // Build WHERE clause dynamically
    let whereConditions = [];
    let params = [];
    
    if (search) {
      whereConditions.push('(student_name LIKE ? OR student_id LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }
    
    if (hostelName) {
      whereConditions.push('hostel_name = ?');
      params.push(hostelName);
    }
    
    if (department) {
      whereConditions.push('department = ?');
      params.push(department);
    }
    
    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';
    
    // Get total count for pagination
    const [countResult] = await db.query(
      `SELECT COUNT(*) as total FROM hostel_students ${whereClause}`,
      params
    );
    const totalItems = countResult[0].total;
    const totalPages = Math.ceil(totalItems / limit);
    
    // Query with pagination
    const [students] = await db.query(
      `SELECT * FROM hostel_students ${whereClause} ORDER BY hostel_name, room_number LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    res.status(200).json({
      success: true,
      count: students.length,
      totalItems,
      totalPages,
      currentPage: page,
      itemsPerPage: limit,
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
 * Update hostel student allocation
 * @route PUT /api/hostel/:id
 */
exports.updateHostelStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { student_name, hostel_name, room_number, department, allocated_date } = req.body;
    
    // Check if record exists
    const [existing] = await db.query('SELECT id FROM hostel_students WHERE id = ?', [id]);
    
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Hostel student record not found'
      });
    }
    
    // Update record
    await db.query(
      `UPDATE hostel_students SET 
        student_name = COALESCE(?, student_name),
        hostel_name = COALESCE(?, hostel_name),
        room_number = COALESCE(?, room_number),
        department = COALESCE(?, department),
        allocated_date = COALESCE(?, allocated_date)
      WHERE id = ?`,
      [student_name, hostel_name, room_number, department, allocated_date, id]
    );
    
    res.status(200).json({
      success: true,
      message: 'Hostel student record updated successfully'
    });
  } catch (error) {
    console.error('Error updating hostel student:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update hostel student record',
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
    
    // Check if record exists
    const [existing] = await db.query('SELECT id FROM hostel_students WHERE id = ?', [id]);
    
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Hostel student record not found'
      });
    }
    
    // Delete record
    await db.query('DELETE FROM hostel_students WHERE id = ?', [id]);
    
    res.status(200).json({
      success: true,
      message: 'Hostel student record deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting hostel student:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete hostel student record',
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
