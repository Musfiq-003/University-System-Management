// Routes for Hostel Management
const express = require('express');
const router = express.Router();
const hostelController = require('../controllers/hostelController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

// GET: Get all hostel student records (protected - all authenticated users)
router.get('/', verifyToken, hostelController.getAllHostelStudents);

// GET: Get students by hostel name (protected - all authenticated users)
router.get('/hostel/:hostelName', verifyToken, hostelController.getStudentsByHostel);

// GET: Get students by department (protected - all authenticated users)
router.get('/department/:department', verifyToken, hostelController.getStudentsByDepartment);

// GET: Get student by student ID (protected - all authenticated users)
router.get('/student/:studentId', verifyToken, hostelController.getStudentById);

// POST: Add a new hostel student allocation (protected - admin only)
router.post('/', verifyToken, verifyRole(['admin']), hostelController.addHostelStudent);

// PUT: Update hostel student allocation (protected - admin only)
router.put('/:id', verifyToken, verifyRole(['admin']), hostelController.updateHostelStudent);

// DELETE: Delete hostel student allocation (protected - admin only)
router.delete('/:id', verifyToken, verifyRole(['admin']), hostelController.deleteHostelStudent);

module.exports = router;
