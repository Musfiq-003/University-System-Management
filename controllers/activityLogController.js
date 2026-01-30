// ======================================================
// Activity Log Controller
// ======================================================
// Handles logging and retrieval of user activities
// ======================================================

const db = require('../config/db');

/**
 * Log user activity
 * @param userId - ID of the user performing the action
 * @param action - Type of action (CREATE, UPDATE, DELETE, READ, LOGIN, LOGOUT)
 * @param entity - Entity type (USER, ROUTINE, RESEARCH_PAPER, HOSTEL, etc.)
 * @param entityId - ID of the affected entity (optional)
 * @param details - Additional details about the action (optional)
 * @param ipAddress - IP address of the user (optional)
 */
exports.logActivity = async (userId, action, entity, entityId = null, details = null, ipAddress = null) => {
  try {
    await db.query(
      'INSERT INTO activity_logs (user_id, action, entity, entity_id, details, ip_address) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, action, entity, entityId, details, ipAddress]
    );
  } catch (error) {
    console.error('Error logging activity:', error);
    // Don't throw error - logging failure shouldn't break the main operation
  }
};

/**
 * Get all activity logs (admin only)
 * @route GET /api/activity-logs
 */
exports.getAllLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, userId, action, entity } = req.query;
    const offset = (page - 1) * limit;

    // Build query dynamically based on filters
    let query = `
      SELECT al.*, u.full_name as user_name, u.email as user_email, u.role as user_role
      FROM activity_logs al
      LEFT JOIN users u ON al.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (userId) {
      query += ' AND al.user_id = ?';
      params.push(userId);
    }

    if (action) {
      query += ' AND al.action = ?';
      params.push(action);
    }

    if (entity) {
      query += ' AND al.entity = ?';
      params.push(entity);
    }

    query += ' ORDER BY al.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [logs] = await db.query(query, params);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM activity_logs WHERE 1=1';
    const countParams = [];

    if (userId) {
      countQuery += ' AND user_id = ?';
      countParams.push(userId);
    }

    if (action) {
      countQuery += ' AND action = ?';
      countParams.push(action);
    }

    if (entity) {
      countQuery += ' AND entity = ?';
      countParams.push(entity);
    }

    const [countResult] = await db.query(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      success: true,
      data: logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total,
        totalPages: Math.ceil(total / limit)
      }
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

/**
 * Get user's own activity logs
 * @route GET /api/activity-logs/me
 */
exports.getMyLogs = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const [logs] = await db.query(
      `SELECT * FROM activity_logs 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [userId, parseInt(limit), parseInt(offset)]
    );

    // Get total count
    const [countResult] = await db.query(
      'SELECT COUNT(*) as total FROM activity_logs WHERE user_id = ?',
      [userId]
    );
    const total = countResult[0].total;

    res.json({
      success: true,
      data: logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching user activity logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activity logs',
      error: error.message
    });
  }
};

/**
 * Get activity statistics (admin only)
 * @route GET /api/activity-logs/stats
 */
exports.getActivityStats = async (req, res) => {
  try {
    const { days = 7 } = req.query;

    // Activity by action type
    const [actionStats] = await db.query(
      `SELECT action, COUNT(*) as count 
       FROM activity_logs 
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
       GROUP BY action 
       ORDER BY count DESC`,
      [parseInt(days)]
    );

    // Activity by entity type
    const [entityStats] = await db.query(
      `SELECT entity, COUNT(*) as count 
       FROM activity_logs 
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
       GROUP BY entity 
       ORDER BY count DESC`,
      [parseInt(days)]
    );

    // Most active users
    const [userStats] = await db.query(
      `SELECT al.user_id, u.full_name, u.email, u.role, COUNT(*) as activity_count
       FROM activity_logs al
       LEFT JOIN users u ON al.user_id = u.id
       WHERE al.created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
       GROUP BY al.user_id, u.full_name, u.email, u.role
       ORDER BY activity_count DESC
       LIMIT 10`,
      [parseInt(days)]
    );

    // Daily activity trend
    const [dailyStats] = await db.query(
      `SELECT DATE(created_at) as date, COUNT(*) as count
       FROM activity_logs
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
       GROUP BY DATE(created_at)
       ORDER BY date ASC`,
      [parseInt(days)]
    );

    res.json({
      success: true,
      data: {
        period: `Last ${days} days`,
        actionStats,
        entityStats,
        userStats,
        dailyStats
      }
    });
  } catch (error) {
    console.error('Error fetching activity stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activity statistics',
      error: error.message
    });
  }
};

/**
 * Delete old logs (admin only)
 * @route DELETE /api/activity-logs/cleanup
 */
exports.cleanupOldLogs = async (req, res) => {
  try {
    const { days = 90 } = req.body;

    const [result] = await db.query(
      'DELETE FROM activity_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)',
      [parseInt(days)]
    );

    res.json({
      success: true,
      message: `Deleted ${result.affectedRows} log entries older than ${days} days`,
      deletedCount: result.affectedRows
    });
  } catch (error) {
    console.error('Error cleaning up logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cleanup old logs',
      error: error.message
    });
  }
};

module.exports = exports;
