// Routes for Research Paper Management
const express = require('express');
const router = express.Router();
const researchPaperController = require('../controllers/researchPaperController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

// GET: Get all research papers (protected - all authenticated users)
router.get('/', verifyToken, researchPaperController.getAllResearchPapers);

// GET: Get research papers by department (protected - all authenticated users)
router.get('/department/:department', verifyToken, researchPaperController.getPapersByDepartment);

// GET: Get research papers by status (protected - all authenticated users)
router.get('/status/:status', verifyToken, researchPaperController.getPapersByStatus);

// GET: Get single research paper (protected - all authenticated users)
router.get('/:id', verifyToken, researchPaperController.getResearchPaperById);

// POST: Add a new research paper (protected - admin and faculty only)
router.post('/', verifyToken, verifyRole(['admin', 'faculty']), researchPaperController.addResearchPaper);

// PUT: Update research paper (protected - admin and faculty only)
router.put('/:id', verifyToken, verifyRole(['admin', 'faculty']), researchPaperController.updateResearchPaper);

// PATCH: Update research paper status (protected - admin and faculty only)
router.patch('/:id/status', verifyToken, verifyRole(['admin', 'faculty']), researchPaperController.updatePaperStatus);

// DELETE: Delete research paper (protected - admin only)
router.delete('/:id', verifyToken, verifyRole(['admin']), researchPaperController.deleteResearchPaper);

module.exports = router;
