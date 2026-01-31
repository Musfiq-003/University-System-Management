const express = require('express');
const router = express.Router();
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

const courseController = require('../controllers/courseController');
const noticeController = require('../controllers/noticeController');
const resultController = require('../controllers/resultController');
const accountController = require('../controllers/accountController');

// All routes require Admin role
router.use(verifyToken);
router.use(verifyRole(['admin']));

// Courses
router.get('/courses', courseController.getAllCourses);
router.post('/courses', courseController.createCourse);
router.put('/courses/:id', courseController.updateCourse);
router.delete('/courses/:id', courseController.deleteCourse);

// Notices
router.get('/notices', noticeController.getAllNotices);
router.post('/notices', noticeController.createNotice);
router.delete('/notices/:id', noticeController.deleteNotice);

// Results
router.get('/results', resultController.getAllResults);
router.post('/results', resultController.updateResult);

// Accounts
router.get('/accounts', accountController.getAccounts);
router.post('/accounts', accountController.updateAccount);
router.get('/accounts/history/:studentId', accountController.getPaymentHistory);
router.post('/accounts/payment', accountController.addPaymentRecord);

module.exports = router;
