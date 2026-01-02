// ======================================================
// Department & Teacher Routes
// ======================================================

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken } = require('../middleware/authMiddleware');

// ======================================================
// GET ALL DEPARTMENTS
// ======================================================
router.get('/departments', async (req, res) => {
  try {
    const [departments] = await db.query('SELECT * FROM departments');
    res.json({
      success: true,
      departments
    });
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching departments'
    });
  }
});

// ======================================================
// GET ALL TEACHERS
// ======================================================
router.get('/teachers', async (req, res) => {
  try {
    const { department } = req.query;
    
    let query = 'SELECT * FROM teachers';
    let params = [];
    
    if (department) {
      query += ' WHERE department = ?';
      params.push(department);
    }
    
    const [teachers] = await db.query(query, params);
    
    res.json({
      success: true,
      teachers,
      count: teachers.length
    });
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching teachers'
    });
  }
});

// ======================================================
// GET TEACHER BY ID
// ======================================================
router.get('/teachers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [teachers] = await db.query('SELECT * FROM teachers WHERE id = ?', [id]);
    
    if (teachers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }
    
    res.json({
      success: true,
      teacher: teachers[0]
    });
  } catch (error) {
    console.error('Error fetching teacher:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching teacher'
    });
  }
});

module.exports = router;
