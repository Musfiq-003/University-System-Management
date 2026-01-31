// Routes for Hostel Management
const express = require('express');
const router = express.Router();
const hostelController = require('../controllers/hostelController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

// POST: Add a new hostel student allocation (Admin only)
// Body: { student_name, student_id, hostel_name, room_number, department, allocated_date }
router.post('/', verifyToken, verifyRole(['admin', 'student']), hostelController.addHostelStudent);

// GET: Get all hostel student records (All authenticated users)
// Query params: page, limit, search, hostel_name, department
router.get('/', verifyToken, hostelController.getAllHostelStudents);

// GET: Get students by hostel name (All authenticated users)
router.get('/hostel/:hostelName', verifyToken, hostelController.getStudentsByHostel);

// GET: Get student by student ID (All authenticated users)
router.get('/student/:studentId', verifyToken, hostelController.getStudentById);

// PUT: Update hostel student allocation (Admin only)
router.put('/:id', verifyToken, verifyRole(['admin']), hostelController.updateHostelStudent);

// DELETE: Delete hostel student allocation (Admin only)
router.delete('/:id', verifyToken, verifyRole(['admin']), hostelController.deleteHostelStudent);

module.exports = router;
