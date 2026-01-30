// Routes for Hostel Management
const express = require('express');
const router = express.Router();
const hostelController = require('../controllers/hostelController');

// POST: Add a new hostel student allocation
// Body: { student_name, student_id, hostel_name, room_number, department, allocated_date }
router.post('/', hostelController.addHostelStudent);

// GET: Get all hostel student records
router.get('/', hostelController.getAllHostelStudents);

// GET: Get students by hostel name
router.get('/hostel/:hostelName', hostelController.getStudentsByHostel);

// GET: Get student by student ID
router.get('/student/:studentId', hostelController.getStudentById);

module.exports = router;
