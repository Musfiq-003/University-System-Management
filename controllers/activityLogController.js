// ======================================================
// Activity Log Controller
// ======================================================
// Handles logging and retrieval of user activities
// ======================================================

const db = require('../config/db');
const response = require('../utils/responseHandler');

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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const { userId, action, entity } = req.query;
    const offset = (page - 1) * limit;

    // Build query dynamically based on filters
    let whereConditions = ['1=1'];
    let params = [];

    if (userId) {
      whereConditions.push('al.user_id = ?');
      params.push(userId);
    }

    if (action) {
      whereConditions.push('al.action = ?');
      params.push(action);
    }

    if (entity) {
      whereConditions.push('al.entity = ?');
      params.push(entity);
    }

    const whereClause = whereConditions.join(' AND ');

    // Get total count for pagination
    const [countResult] = await db.query(
      `SELECT COUNT(*) as total FROM activity_logs al WHERE ${whereClause}`,
      params
    );
    const totalItems = countResult[0].total;

    // Query with pagination
    const [logs] = await db.query(
      `SELECT al.*, u.full_name as user_name, u.email as user_email, u.role as user_role
      FROM activity_logs al
      LEFT JOIN users u ON al.user_id = u.id
      WHERE ${whereClause}
      ORDER BY al.created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return response.paginated(res, logs, page, limit, totalItems);
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    return response.error(res, error, 500);
  }
};

/**
 * Get user's own activity logs
 * @route GET /api/activity-logs/me
 */
exports.getMyLogs = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    // Get total count
    const [countResult] = await db.query(
      'SELECT COUNT(*) as total FROM activity_logs WHERE user_id = ?',
      [userId]
    );
    const totalItems = countResult[0].total;

    const [logs] = await db.query(
      `SELECT * FROM activity_logs 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );

    return response.paginated(res, logs, page, limit, totalItems);
  } catch (error) {
    console.error('Error fetching user activity logs:', error);
    return response.error(res, error, 500);
  }
};

/**
 * Get activity statistics (admin only)
 * @route GET /api/activity-logs/stats
 */
exports.getActivityStats = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;

    // Activity by action type
    const [actionStats] = await db.query(
      `SELECT action, COUNT(*) as count 
       FROM activity_logs 
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
       GROUP BY action 
       ORDER BY count DESC`,
      [days]
    );

    // Activity by entity type
    const [entityStats] = await db.query(
      `SELECT entity, COUNT(*) as count 
       FROM activity_logs 
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
       GROUP BY entity 
       ORDER BY count DESC`,
      [days]
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
      [days]
    );

    // Daily activity trend
    const [dailyStats] = await db.query(
      `SELECT DATE(created_at) as date, COUNT(*) as count
       FROM activity_logs
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
       GROUP BY DATE(created_at)
       ORDER BY date ASC`,
      [days]
    );

    return response.success(res, 'Activity statistics fetched successfully', {
      period: `Last ${days} days`,
      actionStats,
      entityStats,
      userStats,
      dailyStats
    });
  } catch (error) {
    console.error('Error fetching activity stats:', error);
    return response.error(res, error, 500);
  }
};

/**
 * Delete old logs (admin only)
 * @route DELETE /api/activity-logs/cleanup
 */
exports.cleanupOldLogs = async (req, res) => {
  try {
    const days = parseInt(req.body.days) || 90;

    const [result] = await db.query(
      'DELETE FROM activity_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)',
      [days]
    );

    return response.success(res, `Deleted ${result.affectedRows} log entries older than ${days} days`, {
      deletedCount: result.affectedRows,
      periodDays: days
    });
  } catch (error) {
    console.error('Error cleaning up logs:', error);
    return response.error(res, error, 500);
  }
};

module.exports = exports;
