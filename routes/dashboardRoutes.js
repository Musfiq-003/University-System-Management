const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { verifyToken } = require('../middleware/authMiddleware'); // Assuming this exists

// All dashboard routes are protected
router.use(verifyToken);

router.get('/stats', dashboardController.getStats);
router.get('/accounts', dashboardController.getAccountInfo);
router.get('/courses', dashboardController.getActiveCourses);
router.get('/notices', dashboardController.getNotices);

module.exports = router;
