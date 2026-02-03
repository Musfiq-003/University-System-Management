const db = require('../config/db');
const response = require('../utils/responseHandler');

// Get all student results (optionally filter by ID)
exports.getAllResults = async (req, res) => {
    try {
        const { studentId } = req.query;
        let query = 'SELECT r.*, u.full_name, u.department, u.batch FROM student_results r JOIN users u ON r.studentId = u.studentId';
        let params = [];

        if (studentId) {
            query += ' WHERE r.studentId LIKE ?';
            params.push(`%${studentId}%`);
        }

        const [results] = await db.query(query, params);
        return response.success(res, 'Student results fetched successfully', results);
    } catch (error) {
        console.error('Error fetching results:', error);
        return response.error(res, error, 500);
    }
};

// Update or Create Result
exports.updateResult = async (req, res) => {
    try {
        const { studentId, cgpa, credits_completed } = req.body;

        if (!studentId) {
            return response.error(res, 'Student ID required', 400);
        }

        // Check if student exists
        const [users] = await db.query('SELECT 1 FROM users WHERE studentId = ?', [studentId]);
        if (users.length === 0) {
            return response.error(res, 'Student ID not found in database', 404);
        }

        // Upsert
        await db.query(
            `INSERT INTO student_results (studentId, cgpa, credits_completed) 
             VALUES (?, ?, ?) 
             ON DUPLICATE KEY UPDATE cgpa=VALUES(cgpa), credits_completed=VALUES(credits_completed)`,
            [studentId, cgpa, credits_completed]
        );

        return response.success(res, 'Result updated successfully');
    } catch (error) {
        console.error('Error updating result:', error);
        return response.error(res, error, 500);
    }
};
