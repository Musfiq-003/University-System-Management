const db = require('../config/db');

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
        res.json({ success: true, data: results });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Update or Create Result
exports.updateResult = async (req, res) => {
    try {
        const { studentId, cgpa, credits_completed } = req.body;

        if (!studentId) {
            return res.status(400).json({ success: false, message: 'Student ID required' });
        }

        // Check if student exists
        const [users] = await db.query('SELECT 1 FROM users WHERE studentId = ?', [studentId]);
        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'Student ID not found in database' });
        }

        // Upsert
        await db.query(
            `INSERT INTO student_results (studentId, cgpa, credits_completed) 
             VALUES (?, ?, ?) 
             ON DUPLICATE KEY UPDATE cgpa=VALUES(cgpa), credits_completed=VALUES(credits_completed)`,
            [studentId, cgpa, credits_completed]
        );

        res.json({ success: true, message: 'Result updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
