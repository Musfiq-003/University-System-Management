// Routes for Hostel Management
const express = require('express');
const router = express.Router();
const hostelController = require('../controllers/hostelController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

// POST: Add a new hostel student allocation (Admin only)
// Body: { student_name, student_id, hostel_name, room_number, department, allocated_date }
router.post('/', verifyToken, verifyRole(['admin']), hostelController.addHostelStudent);

// GET: Get all hostel student records (All authenticated users)
router.get('/', verifyToken, hostelController.getAllHostelStudents);

// GET: Get students by hostel name (All authenticated users)
router.get('/hostel/:hostelName', verifyToken, hostelController.getStudentsByHostel);

// GET: Get student by student ID (All authenticated users)
router.get('/student/:studentId', verifyToken, hostelController.getStudentById);

module.exports = router;
