// Routes for Routine Management
const express = require('express');
const router = express.Router();
const routineController = require('../controllers/routineController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

// GET: Get all routines (protected - all authenticated users)
router.get('/', verifyToken, routineController.getAllRoutines);

// GET: Get routines by specific day (protected - all authenticated users)
router.get('/day/:day', verifyToken, routineController.getRoutinesByDay);

// GET: Get routines by department (protected - all authenticated users)
router.get('/department/:department', verifyToken, routineController.getRoutinesByDepartment);

// GET: Get routines by batch (protected - all authenticated users)
router.get('/batch/:batch', verifyToken, routineController.getRoutinesByBatch);

// GET: Get single routine (protected - all authenticated users)
router.get('/:id', verifyToken, routineController.getRoutineById);

// POST: Add a new routine (protected - admin and faculty only)
router.post('/', verifyToken, verifyRole(['admin', 'faculty']), routineController.addRoutine);

// PUT: Update routine (protected - admin and faculty only)
router.put('/:id', verifyToken, verifyRole(['admin', 'faculty']), routineController.updateRoutine);

// DELETE: Delete routine (protected - admin only)
router.delete('/:id', verifyToken, verifyRole(['admin']), routineController.deleteRoutine);

module.exports = router;
