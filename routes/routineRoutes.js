// Routes for Routine Management
const express = require('express');
const router = express.Router();
const routineController = require('../controllers/routineController');

// POST: Add a new routine
// Body: { course, teacher, day, start_time, end_time }
router.post('/', routineController.addRoutine);

// GET: Get all routines
router.get('/', routineController.getAllRoutines);

// GET: Get routines by specific day
router.get('/day/:day', routineController.getRoutinesByDay);

module.exports = router;
