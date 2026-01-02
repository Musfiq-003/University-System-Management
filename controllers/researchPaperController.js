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
 * Get all research papers
 * @route GET /api/research-papers
 */
exports.getAllResearchPapers = async (req, res) => {
  try {
    // Query to fetch all research papers ordered by year (descending)
    const [papers] = await db.query(
      'SELECT * FROM research_papers ORDER BY year DESC, created_at DESC'
    );

    res.status(200).json({
      success: true,
      count: papers.length,
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
