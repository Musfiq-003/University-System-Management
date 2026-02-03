// Controller for Hostel Management
// Handles all business logic for hostel student allocations
const db = require('../config/db');
const response = require('../utils/responseHandler');

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
      return response.error(res, 'All fields are required (student_name, student_id, hostel_name, room_number, department, allocated_date)', 400);
    }

    // Check if student_id already exists
    const [existing] = await db.query(
      'SELECT id FROM hostel_allocations WHERE student_id = ?',
      [student_id]
    );

    if (existing.length > 0) {
      return response.error(res, 'Student ID already exists in hostel records', 409);
    }

    // Insert hostel student into database
    const [result] = await db.query(
      'INSERT INTO hostel_allocations (student_name, student_id, hostel_name, room_number, department, allocated_date, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [student_name, student_id, hostel_name, room_number, department, allocated_date, 'Allocated']
    );

    // Return success response
    return response.success(res, 'Hostel student allocation added successfully', {
      id: result.insertId,
      student_name,
      student_id,
      hostel_name,
      room_number,
      department,
      allocated_date
    }, 201);
  } catch (error) {
    console.error('Error adding hostel student:', error);
    return response.error(res, error, 500);
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
      `SELECT COUNT(*) as total FROM hostel_allocations ${whereClause}`,
      params
    );
    const totalItems = countResult[0].total;

    // Query with pagination
    const [students] = await db.query(
      `SELECT * FROM hostel_allocations ${whereClause} ORDER BY hostel_name, room_number LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return response.paginated(res, students, page, limit, totalItems);
  } catch (error) {
    console.error('Error fetching hostel students:', error);
    return response.error(res, error, 500);
  }
};

/**
 * Update hostel student allocation
 * @route PUT /api/hostel/:id
 */
exports.updateHostelStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { student_name, hostel_name, room_number, department, allocated_date, status } = req.body;

    // Check if record exists
    const [existing] = await db.query('SELECT id FROM hostel_allocations WHERE id = ?', [id]);

    if (existing.length === 0) {
      return response.error(res, 'Hostel student record not found', 404);
    }

    // Update record
    await db.query(
      `UPDATE hostel_allocations SET 
        student_name = COALESCE(?, student_name),
        hostel_name = COALESCE(?, hostel_name),
        room_number = COALESCE(?, room_number),
        department = COALESCE(?, department),
        allocated_date = COALESCE(?, allocated_date),
        status = COALESCE(?, status)
      WHERE id = ?`,
      [student_name, hostel_name, room_number, department, allocated_date, status, id]
    );

    return response.success(res, 'Hostel student record updated successfully');
  } catch (error) {
    console.error('Error updating hostel student:', error);
    return response.error(res, error, 500);
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
    const [existing] = await db.query('SELECT id FROM hostel_allocations WHERE id = ?', [id]);

    if (existing.length === 0) {
      return response.error(res, 'Hostel student record not found', 404);
    }

    // Delete record
    await db.query('DELETE FROM hostel_allocations WHERE id = ?', [id]);

    return response.success(res, 'Hostel student record deleted successfully');
  } catch (error) {
    console.error('Error deleting hostel student:', error);
    return response.error(res, error, 500);
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
      'SELECT * FROM hostel_allocations WHERE hostel_name = ? ORDER BY room_number',
      [hostelName]
    );

    return response.success(res, `Students for ${hostelName} fetched successfully`, students);
  } catch (error) {
    console.error('Error fetching students by hostel:', error);
    return response.error(res, error, 500);
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
      'SELECT * FROM hostel_allocations WHERE student_id = ?',
      [studentId]
    );

    if (students.length === 0) {
      return response.error(res, 'Student not found in hostel records', 404);
    }

    return response.success(res, 'Student hostel record fetched successfully', students[0]);
  } catch (error) {
    console.error('Error fetching student by ID:', error);
    return response.error(res, error, 500);
  }
};
