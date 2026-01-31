const db = require('../config/db');

// Get Academic Stats (CGPA, Credits) & Hostel Status
exports.getStats = async (req, res) => {
  try {
    const studentId = req.user.studentId;
    if (!studentId) {
      return res.status(400).json({ success: false, message: 'Student ID not found' });
    }

    // Fetch Results
    const [results] = await db.query(
      'SELECT cgpa, credits_completed FROM student_results WHERE studentId = ?',
      [studentId]
    );

    // Fetch Hostel
    const [hostel] = await db.query(
      'SELECT status FROM hostel_allocations WHERE student_id = ? AND status = "Allocated"',
      [studentId]
    );

    res.json({
      success: true,
      data: {
        cgpa: results[0] ? results[0].cgpa : 0.00,
        creditsCompleted: results[0] ? results[0].credits_completed : 0,
        hostelStatus: hostel.length > 0 ? 'Allocated' : 'Not Allocated'
      }
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get Financial Accounts Data & History
exports.getAccountInfo = async (req, res) => {
  try {
    const studentId = req.user.studentId;
    if (!studentId) return res.status(400).json({ success: false, message: 'Student ID not found' });

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

    res.json({
      success: true,
      data: {
        summary: accounts[0] || { payable: 0, paid: 0, due: 0 },
        history: history
      }
    });

  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get Enrolled Active Courses
exports.getActiveCourses = async (req, res) => {
  try {
    const studentId = req.user.studentId;
    if (!studentId) return res.status(400).json({ success: false, message: 'Student ID not found' });

    const query = `
            SELECT c.course_code as code, c.title, c.credit 
            FROM enrollments e
            JOIN courses c ON e.course_code = c.course_code
            WHERE e.studentId = ? AND e.status = 'active'
        `;
    const [courses] = await db.query(query, [studentId]);

    res.json({
      success: true,
      data: courses
    });

  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get Notices
exports.getNotices = async (req, res) => {
  try {
    // Fetch latest 5 notices
    const [notices] = await db.query(
      'SELECT id, title, content, DATE_FORMAT(publish_date, "%d") as date, DATE_FORMAT(publish_date, "%b") as month FROM notices ORDER BY publish_date DESC LIMIT 5'
    );

    res.json({
      success: true,
      data: notices
    });

  } catch (error) {
    console.error('Error fetching notices:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
