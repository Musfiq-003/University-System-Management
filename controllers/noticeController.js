const db = require('../config/db');

// Get all notices
exports.getAllNotices = async (req, res) => {
    try {
        const [notices] = await db.query('SELECT * FROM notices ORDER BY publish_date DESC, created_at DESC');
        res.json({ success: true, data: notices });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Create a notice
exports.createNotice = async (req, res) => {
    try {
        const { title, content, target_audience, publish_date } = req.body;

        await db.query(
            'INSERT INTO notices (title, content, target_audience, publish_date) VALUES (?, ?, ?, ?)',
            [title, content, target_audience || 'all', publish_date || new Date()]
        );

        res.json({ success: true, message: 'Notice published successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Delete a notice
exports.deleteNotice = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM notices WHERE id = ?', [id]);
        res.json({ success: true, message: 'Notice deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
