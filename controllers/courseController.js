const db = require('../config/db');

// Get all courses
exports.getAllCourses = async (req, res) => {
    try {
        const [courses] = await db.query('SELECT * FROM courses ORDER BY course_code');
        res.json({ success: true, data: courses });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Add a new course
exports.createCourse = async (req, res) => {
    try {
        const { course_code, title, credit, department } = req.body;
        // Validate
        if (!course_code || !title || !credit) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        await db.query(
            'INSERT INTO courses (course_code, title, credit, department) VALUES (?, ?, ?, ?)',
            [course_code, title, credit, department]
        );

        res.json({ success: true, message: 'Course created successfully' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, message: 'Course code already exists' });
        }
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Update a course
exports.updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, credit, department } = req.body;

        await db.query(
            'UPDATE courses SET title = ?, credit = ?, department = ? WHERE id = ?',
            [title, credit, department, id]
        );

        res.json({ success: true, message: 'Course updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Delete a course
exports.deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM courses WHERE id = ?', [id]);
        res.json({ success: true, message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
