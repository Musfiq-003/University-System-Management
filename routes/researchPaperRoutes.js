// Routes for Research Paper Management
const express = require('express');
const router = express.Router();
const researchPaperController = require('../controllers/researchPaperController');

// POST: Add a new research paper
// Body: { title, author, department, year, status (optional) }
router.post('/', researchPaperController.addResearchPaper);

// PATCH: Update research paper status
// Body: { status }
router.patch('/:id/status', researchPaperController.updatePaperStatus);

// GET: Get all research papers
router.get('/', researchPaperController.getAllResearchPapers);

// GET: Get research papers by department
router.get('/department/:department', researchPaperController.getPapersByDepartment);

// GET: Get research papers by status
router.get('/status/:status', researchPaperController.getPapersByStatus);

module.exports = router;
