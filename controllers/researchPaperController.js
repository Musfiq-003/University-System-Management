// Controller for Research Paper Management
// Handles all business logic for research papers
const db = require('../config/db');
const response = require('../utils/responseHandler');

/**
 * Add a new research paper
 * @route POST /api/research-papers
 */
exports.addResearchPaper = async (req, res) => {
  try {
    // Extract data from request body
    const { title, author, department, year, status } = req.body;

    // Validate required fields
    if (!title || !author || !department || !year) {
      return response.error(res, 'Required fields: title, author, department, year', 400);
    }

    // Set default status if not provided
    const paperStatus = status || 'Draft';

    // Insert research paper into database
    const [result] = await db.query(
      'INSERT INTO research_papers (title, author, department, year, status, user_id) VALUES (?, ?, ?, ?, ?, ?)',
      [title, author, department, year, paperStatus, req.user.user_id]
    );

    // Return success response
    return response.success(res, 'Research paper added successfully', {
      id: result.insertId,
      title,
      author,
      department,
      year,
      status: paperStatus
    }, 201);
  } catch (error) {
    console.error('Error adding research paper:', error);
    return response.error(res, error, 500);
  }
};

/**
 * Update research paper status
 * @route PATCH /api/research-papers/:id/status
 */
exports.updatePaperStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status field
    if (!status) {
      return response.error(res, 'Status field is required', 400);
    }

    // Valid status values
    const validStatuses = ['Draft', 'Under Review', 'Published', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return response.error(res, `Invalid status. Valid values: ${validStatuses.join(', ')}`, 400);
    }

    // Update the status in database
    const [result] = await db.query(
      'UPDATE research_papers SET status = ? WHERE id = ?',
      [status, id]
    );

    // Check if paper was found and updated
    if (result.affectedRows === 0) {
      return response.error(res, 'Research paper not found', 404);
    }

    return response.success(res, 'Research paper status updated successfully', {
      id: parseInt(id),
      status
    });
  } catch (error) {
    console.error('Error updating paper status:', error);
    return response.error(res, error, 500);
  }
};

/**
 * Get all research papers with pagination and search
 * @route GET /api/research-papers
 * @query page, limit, search, department, status, year
 */
exports.getAllResearchPapers = async (req, res) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    // Search and filter parameters
    const search = req.query.search || '';
    const department = req.query.department || '';
    const status = req.query.status || '';
    const year = req.query.year || '';
    const userId = req.query.user_id || '';

    // Build WHERE clause dynamically
    let whereConditions = [];
    let params = [];

    if (search) {
      whereConditions.push('(title LIKE ? OR author LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    if (department) {
      whereConditions.push('department = ?');
      params.push(department);
    }

    if (status) {
      whereConditions.push('status = ?');
      params.push(status);
    }

    if (year) {
      whereConditions.push('year = ?');
      params.push(year);
    }

    if (userId) {
      whereConditions.push('user_id = ?');
      params.push(userId);
    }

    // Role-based visibility restrictions
    if (req.user.role === 'faculty') {
      // Faculty can only see papers where their name appears in the author field
      whereConditions.push('author LIKE ?');
      params.push(`%${req.user.full_name}%`);
    }

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

    // Get total count for pagination
    const [countResult] = await db.query(
      `SELECT COUNT(*) as total FROM research_papers ${whereClause}`,
      params
    );
    const totalItems = countResult[0].total;

    // Query with pagination
    const [papers] = await db.query(
      `SELECT * FROM research_papers ${whereClause} ORDER BY year DESC, created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return response.paginated(res, papers, page, limit, totalItems);
  } catch (error) {
    console.error('Error fetching research papers:', error);
    return response.error(res, error, 500);
  }
};

/**
 * Delete a research paper
 * @route DELETE /api/research-papers/:id
 */
exports.deleteResearchPaper = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if paper exists
    const [existing] = await db.query('SELECT id, user_id FROM research_papers WHERE id = ?', [id]);

    if (existing.length === 0) {
      return response.error(res, 'Research paper not found', 404);
    }

    // Check if user is admin or owner of the paper
    if (req.user.role !== 'admin' && existing[0].user_id !== req.user.user_id) {
      return response.error(res, 'You can only delete your own research papers', 403);
    }

    // Delete the paper
    await db.query('DELETE FROM research_papers WHERE id = ?', [id]);

    return response.success(res, 'Research paper deleted successfully');
  } catch (error) {
    console.error('Error deleting research paper:', error);
    return response.error(res, error, 500);
  }
};

/**
 * Update a research paper
 * @route PUT /api/research-papers/:id
 */
exports.updateResearchPaper = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, department, year, abstract } = req.body;

    // Check if paper exists
    const [existing] = await db.query('SELECT id, user_id FROM research_papers WHERE id = ?', [id]);

    if (existing.length === 0) {
      return response.error(res, 'Research paper not found', 404);
    }

    // Check if user is admin or owner of the paper
    if (req.user.role !== 'admin' && existing[0].user_id !== req.user.user_id) {
      return response.error(res, 'You can only update your own research papers', 403);
    }

    // Update paper (status cannot be updated here, use updatePaperStatus)
    await db.query(
      `UPDATE research_papers SET 
        title = COALESCE(?, title),
        author = COALESCE(?, author),
        department = COALESCE(?, department),
        year = COALESCE(?, year)
      WHERE id = ?`,
      [title, author, department, year, id]
    );

    return response.success(res, 'Research paper updated successfully');
  } catch (error) {
    console.error('Error updating research paper:', error);
    return response.error(res, error, 500);
  }
};

/**
 * Get research papers by department
 * @route GET /api/research-papers/department/:department
 */
exports.getPapersByDepartment = async (req, res) => {
  try {
    const { department } = req.params;

    // Query papers for specific department
    let query = 'SELECT * FROM research_papers WHERE department = ?';
    let params = [department];

    if (req.user.role === 'faculty') {
      query += ' AND author LIKE ?';
      params.push(`%${req.user.full_name}%`);
    }

    query += ' ORDER BY year DESC';

    const [papers] = await db.query(query, params);

    return response.success(res, `Research papers for ${department} fetched successfully`, papers);
  } catch (error) {
    console.error('Error fetching papers by department:', error);
    return response.error(res, error, 500);
  }
};

/**
 * Get research papers by status
 * @route GET /api/research-papers/status/:status
 */
exports.getPapersByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    // Query papers for specific status
    let query = 'SELECT * FROM research_papers WHERE status = ?';
    let params = [status];

    if (req.user.role === 'faculty') {
      query += ' AND author LIKE ?';
      params.push(`%${req.user.full_name}%`);
    }

    query += ' ORDER BY year DESC';

    const [papers] = await db.query(query, params);

    return response.success(res, `Research papers with status ${status} fetched successfully`, papers);
  } catch (error) {
    console.error('Error fetching papers by status:', error);
    return response.error(res, error, 500);
  }
};
