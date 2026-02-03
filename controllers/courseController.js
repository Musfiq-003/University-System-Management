const db = require('../config/db');
const response = require('../utils/responseHandler');

// Get all courses
exports.getAllCourses = async (req, res) => {
    try {
        const [courses] = await db.query('SELECT * FROM courses ORDER BY course_code');
        return response.success(res, 'Courses fetched successfully', courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        return response.error(res, error, 500);
    }
};

// Add a new course
exports.createCourse = async (req, res) => {
    try {
        const { course_code, title, credit, department } = req.body;
        // Validate
        if (!course_code || !title || !credit) {
            return response.error(res, 'Missing required fields (course_code, title, credit)', 400);
        }

        await db.query(
            'INSERT INTO courses (course_code, title, credit, department) VALUES (?, ?, ?, ?)',
            [course_code, title, credit, department]
        );

        return response.success(res, 'Course created successfully', { course_code, title, credit, department }, 201);
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return response.error(res, 'Course code already exists', 400);
        }
        console.error('Error creating course:', error);
        return response.error(res, error, 500);
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

        return response.success(res, 'Course updated successfully');
    } catch (error) {
        console.error('Error updating course:', error);
        return response.error(res, error, 500);
    }
};

// Delete a course
exports.deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM courses WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return response.error(res, 'Course not found', 404);
        }

        return response.success(res, 'Course deleted successfully');
    } catch (error) {
        console.error('Error deleting course:', error);
        return response.error(res, error, 500);
    }
};
