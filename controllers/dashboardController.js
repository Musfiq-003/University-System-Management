const db = require('../config/db');
const response = require('../utils/responseHandler');

// Get Academic Stats (CGPA, Credits) & Hostel Status
exports.getStats = async (req, res) => {
  try {
    const studentId = req.user.studentId;
    if (!studentId) {
      return response.error(res, 'Student ID not found in session', 400);
    }

    // Fetch Results
    const [results] = await db.query(
      'SELECT cgpa, credits_completed FROM student_results WHERE studentId = ?',
      [studentId]
    );

    // Fetch Hostel - Using regularized table name hostel_allocations
    const [hostel] = await db.query(
      'SELECT status FROM hostel_allocations WHERE student_id = ? AND status = "Allocated"',
      [studentId]
    );

    return response.success(res, 'Stats fetched successfully', {
      cgpa: results[0] ? parseFloat(results[0].cgpa) : 0.00,
      creditsCompleted: results[0] ? parseFloat(results[0].credits_completed) : 0,
      hostelStatus: hostel.length > 0 ? 'Allocated' : 'Not Allocated'
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    return response.error(res, error, 500);
  }
};

// Get Financial Accounts Data & History
exports.getAccountInfo = async (req, res) => {
  try {
    const studentId = req.user.studentId;
    if (!studentId) return response.error(res, 'Student ID not found in session', 400);

    // 1. Get Summary
    const [accounts] = await db.query(
      'SELECT payable, paid, due FROM student_accounts WHERE studentId = ?',
      [studentId]
    );

    // 2. Get History
    const [history] = await db.query(
      'SELECT * FROM payment_history WHERE studentId = ? ORDER BY payment_date DESC',
      [studentId]
    );

    return response.success(res, 'Account info fetched successfully', {
      summary: accounts[0] || { payable: 0, paid: 0, due: 0 },
      history: history
    });

  } catch (error) {
    console.error('Error fetching accounts:', error);
    return response.error(res, error, 500);
  }
};

// Get Enrolled Active Courses
exports.getActiveCourses = async (req, res) => {
  try {
    const studentId = req.user.studentId;
    if (!studentId) return response.error(res, 'Student ID not found in session', 400);

    const query = `
            SELECT c.course_code as code, c.title, c.credit 
            FROM enrollments e
            JOIN courses c ON e.course_code = c.course_code
            WHERE e.studentId = ? AND e.status = 'active'
        `;
    const [courses] = await db.query(query, [studentId]);

    return response.success(res, 'Active courses fetched successfully', courses);

  } catch (error) {
    console.error('Error fetching courses:', error);
    return response.error(res, error, 500);
  }
};

// Get Notices
exports.getNotices = async (req, res) => {
  try {
    // Fetch latest 5 notices
    const [notices] = await db.query(
      'SELECT id, title, content, DATE_FORMAT(publish_date, "%d") as date, DATE_FORMAT(publish_date, "%b") as month FROM notices ORDER BY publish_date DESC LIMIT 5'
    );

    return response.success(res, 'Latest notices fetched successfully', notices);

  } catch (error) {
    console.error('Error fetching notices:', error);
    return response.error(res, error, 500);
  }
};
