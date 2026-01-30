// Controller for Dashboard Statistics
// Handles aggregated data for admin and user dashboards
const db = require('../config/db');

/**
 * Get admin dashboard statistics
 * @route GET /api/dashboard/admin/stats
 */
exports.getAdminStats = async (req, res) => {
  try {
    // Get user counts by role
    const [userStats] = await db.query(`
      SELECT 
        role,
        COUNT(*) as count 
      FROM users 
      GROUP BY role
    `);
    
    // Get pending approvals count
    const [pendingUsers] = await db.query(`
      SELECT COUNT(*) as count FROM users WHERE role = 'pending'
    `);
    
    // Get total research papers and by status
    const [paperStats] = await db.query(`
      SELECT 
        status,
        COUNT(*) as count 
      FROM research_papers 
      GROUP BY status
    `);
    
    // Get total routines
    const [routineCount] = await db.query(`
      SELECT COUNT(*) as count FROM routines
    `);
    
    // Get hostel occupancy
    const [hostelStats] = await db.query(`
      SELECT 
        hostel_name,
        COUNT(*) as students 
      FROM hostel_students 
      GROUP BY hostel_name
    `);
    
    // Get departments count
    const [deptCount] = await db.query(`
      SELECT COUNT(*) as count FROM departments
    `);
    
    // Get teachers count
    const [teacherCount] = await db.query(`
      SELECT COUNT(*) as count FROM teachers
    `);
    
    // Get recent activity (last 7 days login attempts)
    const [recentLogins] = await db.query(`
      SELECT 
        DATE(attempt_time) as date,
        COUNT(*) as attempts,
        SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) as successful
      FROM login_attempts 
      WHERE attempt_time >= datetime('now', '-7 days')
      GROUP BY DATE(attempt_time)
      ORDER BY date DESC
    `);
    
    // Format user stats
    const users = {
      total: 0,
      byRole: {}
    };
    userStats.forEach(stat => {
      users.byRole[stat.role] = stat.count;
      users.total += stat.count;
    });
    
    // Format paper stats
    const papers = {
      total: 0,
      byStatus: {}
    };
    paperStats.forEach(stat => {
      papers.byStatus[stat.status] = stat.count;
      papers.total += stat.count;
    });
    
    res.status(200).json({
      success: true,
      data: {
        users,
        pendingApprovals: pendingUsers[0].count,
        researchPapers: papers,
        routines: routineCount[0].count,
        hostel: hostelStats,
        departments: deptCount[0].count,
        teachers: teacherCount[0].count,
        recentLoginActivity: recentLogins
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
};

/**
 * Get faculty dashboard statistics
 * @route GET /api/dashboard/faculty/stats
 */
exports.getFacultyStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email;
    
    // Get user's research papers
    const [myPapers] = await db.query(`
      SELECT status, COUNT(*) as count 
      FROM research_papers 
      WHERE user_id = ?
      GROUP BY status
    `, [userId]);
    
    // Get user's routines (if they're a counselor)
    const [myRoutines] = await db.query(`
      SELECT COUNT(*) as count 
      FROM routines 
      WHERE counselor_name LIKE ? OR created_by = ?
    `, [`%${userEmail}%`, userId]);
    
    // Get department info
    const [deptInfo] = await db.query(`
      SELECT department FROM users WHERE id = ?
    `, [userId]);
    
    // Get department stats if user has department
    let departmentPapers = [];
    if (deptInfo[0]?.department) {
      const [papers] = await db.query(`
        SELECT status, COUNT(*) as count 
        FROM research_papers 
        WHERE department = ?
        GROUP BY status
      `, [deptInfo[0].department]);
      departmentPapers = papers;
    }
    
    // Format papers
    const papers = {
      total: 0,
      byStatus: {}
    };
    myPapers.forEach(stat => {
      papers.byStatus[stat.status] = stat.count;
      papers.total += stat.count;
    });
    
    res.status(200).json({
      success: true,
      data: {
        myResearchPapers: papers,
        myRoutines: myRoutines[0].count,
        department: deptInfo[0]?.department || null,
        departmentPapers: departmentPapers
      }
    });
  } catch (error) {
    console.error('Error fetching faculty stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
};

/**
 * Get student dashboard statistics
 * @route GET /api/dashboard/student/stats
 */
exports.getStudentStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's research papers
    const [myPapers] = await db.query(`
      SELECT status, COUNT(*) as count 
      FROM research_papers 
      WHERE user_id = ?
      GROUP BY status
    `, [userId]);
    
    // Get user info for department and batch
    const [userInfo] = await db.query(`
      SELECT department, batch FROM users WHERE id = ?
    `, [userId]);
    
    // Get hostel info if student is in hostel
    const [hostelInfo] = await db.query(`
      SELECT * FROM hostel_students 
      WHERE student_id = (SELECT student_id FROM users WHERE id = ?)
    `, [userId]);
    
    // Get routine for student's batch if available
    let batchRoutine = null;
    if (userInfo[0]?.batch) {
      const [routine] = await db.query(`
        SELECT * FROM routines 
        WHERE batch = ? 
        ORDER BY created_at DESC 
        LIMIT 1
      `, [userInfo[0].batch]);
      batchRoutine = routine[0] || null;
    }
    
    // Format papers
    const papers = {
      total: 0,
      byStatus: {}
    };
    myPapers.forEach(stat => {
      papers.byStatus[stat.status] = stat.count;
      papers.total += stat.count;
    });
    
    res.status(200).json({
      success: true,
      data: {
        myResearchPapers: papers,
        department: userInfo[0]?.department || null,
        batch: userInfo[0]?.batch || null,
        hostel: hostelInfo[0] || null,
        hasRoutine: batchRoutine !== null
      }
    });
  } catch (error) {
    console.error('Error fetching student stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
};

/**
 * Get activity logs (Admin only)
 * @route GET /api/dashboard/activity-logs
 */
exports.getActivityLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;
    
    // Get login attempts as activity log
    const [logs] = await db.query(`
      SELECT 
        la.id,
        la.email,
        la.ip_address,
        la.success,
        la.attempt_time,
        u.name as user_name,
        u.role as user_role
      FROM login_attempts la
      LEFT JOIN users u ON la.email = u.email
      ORDER BY la.attempt_time DESC
      LIMIT ? OFFSET ?
    `, [limit, offset]);
    
    // Get total count
    const [countResult] = await db.query(`
      SELECT COUNT(*) as total FROM login_attempts
    `);
    
    res.status(200).json({
      success: true,
      count: logs.length,
      totalItems: countResult[0].total,
      totalPages: Math.ceil(countResult[0].total / limit),
      currentPage: page,
      data: logs
    });
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activity logs',
      error: error.message
    });
  }
};
