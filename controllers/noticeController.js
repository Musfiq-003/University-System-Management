const db = require('../config/db');
const response = require('../utils/responseHandler');

// Get all notices
exports.getAllNotices = async (req, res) => {
    try {
        const [notices] = await db.query('SELECT * FROM notices ORDER BY publish_date DESC, created_at DESC');
        return response.success(res, 'Notices fetched successfully', notices);
    } catch (error) {
        console.error('Error fetching notices:', error);
        return response.error(res, error, 500);
    }
};

// Create a notice
exports.createNotice = async (req, res) => {
    try {
        const { title, content, target_audience, publish_date } = req.body;

        if (!title || !content) {
            return response.error(res, 'Title and content are required', 400);
        }

        const [result] = await db.query(
            'INSERT INTO notices (title, content, target_audience, publish_date) VALUES (?, ?, ?, ?)',
            [title, content, target_audience || 'all', publish_date || new Date()]
        );

        return response.success(res, 'Notice published successfully', { id: result.insertId }, 201);
    } catch (error) {
        console.error('Error creating notice:', error);
        return response.error(res, error, 500);
    }
};

// Delete a notice
exports.deleteNotice = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM notices WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return response.error(res, 'Notice not found', 404);
        }

        return response.success(res, 'Notice deleted successfully');
    } catch (error) {
        console.error('Error deleting notice:', error);
        return response.error(res, error, 500);
    }
};
