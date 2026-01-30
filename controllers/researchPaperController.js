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
 * Get all research papers with search and pagination
 * @route GET /api/research-papers
 * Query params: page, limit, search, department, status, year
 */
exports.getAllResearchPapers = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search = '', 
      department = '', 
      status = '', 
      year = '' 
    } = req.query;
    
    const offset = (page - 1) * limit;
    
    // Build query dynamically
    let query = 'SELECT * FROM research_papers WHERE 1=1';
    const params = [];
    
    if (search) {
      query += ' AND (title LIKE ? OR author LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }
    
    if (department) {
      query += ' AND department = ?';
      params.push(department);
    }
    
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    
    if (year) {
      query += ' AND year = ?';
      params.push(parseInt(year));
    }
    
    query += ' ORDER BY year DESC, created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    // Get papers
    const [papers] = await db.query(query, params);
    
    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM research_papers WHERE 1=1';
    const countParams = [];
    
    if (search) {
      countQuery += ' AND (title LIKE ? OR author LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm);
    }
    
    if (department) {
      countQuery += ' AND department = ?';
      countParams.push(department);
    }
    
    if (status) {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }
    
    if (year) {
      countQuery += ' AND year = ?';
      countParams.push(parseInt(year));
    }
    
    const [countResult] = await db.query(countQuery, countParams);
    const total = countResult[0].total;

    res.status(200).json({
      success: true,
      count: papers.length,
      total: total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
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

/**
 * Get single research paper by ID
 * @route GET /api/research-papers/:id
 */
exports.getResearchPaperById = async (req, res) => {
  try {
    const { id } = req.params;

    // Query specific research paper
    const [papers] = await db.query(
      'SELECT * FROM research_papers WHERE id = ?',
      [id]
    );

    if (papers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Research paper not found'
      });
    }

    res.status(200).json({
      success: true,
      data: papers[0]
    });
  } catch (error) {
    console.error('Error fetching research paper:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch research paper',
      error: error.message
    });
  }
};

/**
 * Update entire research paper
 * @route PUT /api/research-papers/:id
 */
exports.updateResearchPaper = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, department, year, status } = req.body;

    // Validate required fields
    if (!title || !author || !department || !year) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: title, author, department, year'
      });
    }

    // Validate status if provided
    if (status) {
      const validStatuses = ['Draft', 'Under Review', 'Published', 'Rejected'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Valid values: ${validStatuses.join(', ')}`
        });
      }
    }

    // Update the research paper in database
    const [result] = await db.query(
      'UPDATE research_papers SET title = ?, author = ?, department = ?, year = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [title, author, department, year, status || 'Draft', id]
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
      message: 'Research paper updated successfully',
      data: {
        id: parseInt(id),
        title,
        author,
        department,
        year,
        status: status || 'Draft'
      }
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
 * Delete research paper
 * @route DELETE /api/research-papers/:id
 */
exports.deleteResearchPaper = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete research paper from database
    const [result] = await db.query(
      'DELETE FROM research_papers WHERE id = ?',
      [id]
    );

    // Check if paper was found and deleted
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Research paper not found'
      });
    }

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
