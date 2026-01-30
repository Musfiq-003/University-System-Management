// Routes for Routine Management
const express = require('express');
const router = express.Router();
const routineController = require('../controllers/routineController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

// POST: Add a new routine (Faculty and Admin only)
// Body: { department, batch, semester, shift, courses, time_slots, etc. }
router.post('/', verifyToken, verifyRole(['faculty', 'admin']), routineController.addRoutine);

// GET: Get all routines (All authenticated users)
router.get('/', verifyToken, routineController.getAllRoutines);

// GET: Get routines by specific day (All authenticated users)
router.get('/day/:day', verifyToken, routineController.getRoutinesByDay);

module.exports = router;
