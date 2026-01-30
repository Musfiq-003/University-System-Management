// Controller for Research Paper Management
// Handles all business logic for research papers
const db = require('../config/db');

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
      return res.status(400).json({
        success: false,
        message: 'Required fields: title, author, department, year'
      });
    }

    // Set default status if not provided
    const paperStatus = status || 'Draft';

    // Insert research paper into database
    const [result] = await db.query(
      'INSERT INTO research_papers (title, author, department, year, status) VALUES (?, ?, ?, ?, ?)',
      [title, author, department, year, paperStatus]
    );

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Research paper added successfully',
      data: {
        id: result.insertId,
        title,
        author,
        department,
        year,
        status: paperStatus
      }
    });
  } catch (error) {
    console.error('Error adding research paper:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add research paper',
      error: error.message
    });
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
      return res.status(400).json({
        success: false,
        message: 'Status field is required'
      });
    }

    // Valid status values
    const validStatuses = ['Draft', 'Under Review', 'Published', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Valid values: ${validStatuses.join(', ')}`
      });
    }

    // Update the status in database
    const [result] = await db.query(
      'UPDATE research_papers SET status = ? WHERE id = ?',
      [status, id]
    );

    // Check if paper was found and updated
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Research paper not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Research paper status updated successfully',
      data: {
        id: parseInt(id),
        status
      }
    });
  } catch (error) {
    console.error('Error updating paper status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update paper status',
      error: error.message
    });
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
    
    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';
    
    // Get total count for pagination
    const [countResult] = await db.query(
      `SELECT COUNT(*) as total FROM research_papers ${whereClause}`,
      params
    );
    const totalItems = countResult[0].total;
    const totalPages = Math.ceil(totalItems / limit);
    
    // Query with pagination
    const [papers] = await db.query(
      `SELECT * FROM research_papers ${whereClause} ORDER BY year DESC, created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    res.status(200).json({
      success: true,
      count: papers.length,
      totalItems,
      totalPages,
      currentPage: page,
      itemsPerPage: limit,
      data: papers
    });
  } catch (error) {
    console.error('Error fetching research papers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch research papers',
      error: error.message
    });
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
      return res.status(404).json({
        success: false,
        message: 'Research paper not found'
      });
    }
    
    // Check if user is admin or owner of the paper
    if (req.user.role !== 'admin' && existing[0].user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own research papers'
      });
    }
    
    // Delete the paper
    await db.query('DELETE FROM research_papers WHERE id = ?', [id]);
    
    res.status(200).json({
      success: true,
      message: 'Research paper deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting research paper:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete research paper',
      error: error.message
    });
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
      return res.status(404).json({
        success: false,
        message: 'Research paper not found'
      });
    }
    
    // Check if user is admin or owner of the paper
    if (req.user.role !== 'admin' && existing[0].user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own research papers'
      });
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
    
    res.status(200).json({
      success: true,
      message: 'Research paper updated successfully'
    });
  } catch (error) {
    console.error('Error updating research paper:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update research paper',
      error: error.message
    });
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
    const [papers] = await db.query(
      'SELECT * FROM research_papers WHERE department = ? ORDER BY year DESC',
      [department]
    );

    res.status(200).json({
      success: true,
      department: department,
      count: papers.length,
      data: papers
    });
  } catch (error) {
    console.error('Error fetching papers by department:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch research papers',
      error: error.message
    });
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
    const [papers] = await db.query(
      'SELECT * FROM research_papers WHERE status = ? ORDER BY year DESC',
      [status]
    );

    res.status(200).json({
      success: true,
      status: status,
      count: papers.length,
      data: papers
    });
  } catch (error) {
    console.error('Error fetching papers by status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch research papers',
      error: error.message
    });
  }
};
