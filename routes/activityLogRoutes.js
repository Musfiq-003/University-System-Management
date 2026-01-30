// ======================================================
// Activity Log Routes
// ======================================================

const express = require('express');
const router = express.Router();
const activityLogController = require('../controllers/activityLogController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

// GET: Get all activity logs (admin only)
router.get('/', verifyToken, verifyRole(['admin']), activityLogController.getAllLogs);

// GET: Get user's own activity logs
router.get('/me', verifyToken, activityLogController.getMyLogs);

// GET: Get activity statistics (admin only)
router.get('/stats', verifyToken, verifyRole(['admin']), activityLogController.getActivityStats);

// DELETE: Cleanup old logs (admin only)
router.delete('/cleanup', verifyToken, verifyRole(['admin']), activityLogController.cleanupOldLogs);

module.exports = router;
