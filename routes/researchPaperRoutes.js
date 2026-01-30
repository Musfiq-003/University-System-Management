// Routes for Research Paper Management
const express = require('express');
const router = express.Router();
const researchPaperController = require('../controllers/researchPaperController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

// POST: Add a new research paper (Faculty, Students, and Admin)
// Body: { title, author, department, year, status (optional) }
router.post('/', verifyToken, verifyRole(['faculty', 'student', 'admin']), researchPaperController.addResearchPaper);

// PATCH: Update research paper status (Admin only)
// Body: { status }
router.patch('/:id/status', verifyToken, verifyRole(['admin']), researchPaperController.updatePaperStatus);

// GET: Get all research papers (All authenticated users)
// Query params: page, limit, search, department, status, year, user_id
router.get('/', verifyToken, researchPaperController.getAllResearchPapers);

// GET: Get research papers by department (All authenticated users)
router.get('/department/:department', verifyToken, researchPaperController.getPapersByDepartment);

// GET: Get research papers by status (All authenticated users)
router.get('/status/:status', verifyToken, researchPaperController.getPapersByStatus);

// PUT: Update a research paper (Owner or Admin)
router.put('/:id', verifyToken, researchPaperController.updateResearchPaper);

// DELETE: Delete a research paper (Owner or Admin)
router.delete('/:id', verifyToken, researchPaperController.deleteResearchPaper);

module.exports = router;
