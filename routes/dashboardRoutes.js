// Routes for Dashboard Statistics
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

// GET: Admin dashboard statistics (Admin only)
router.get('/admin/stats', verifyToken, verifyRole(['admin']), dashboardController.getAdminStats);

// GET: Faculty dashboard statistics (Faculty only)
router.get('/faculty/stats', verifyToken, verifyRole(['faculty']), dashboardController.getFacultyStats);

// GET: Student dashboard statistics (Student only)
router.get('/student/stats', verifyToken, verifyRole(['student']), dashboardController.getStudentStats);

// GET: Activity logs (Admin only)
router.get('/activity-logs', verifyToken, verifyRole(['admin']), dashboardController.getActivityLogs);

module.exports = router;
