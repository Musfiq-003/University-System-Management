const db = require('../config/db');
const response = require('../utils/responseHandler');

// Get student accounts (filter by ID)
exports.getAccounts = async (req, res) => {
    try {
        const { studentId } = req.query;
        let query = 'SELECT a.*, u.full_name, u.batch FROM student_accounts a JOIN users u ON a.studentId = u.studentId';
        let params = [];

        if (studentId) {
            query += ' WHERE a.studentId LIKE ?';
            params.push(`%${studentId}%`);
        }

        const [accounts] = await db.query(query, params);
        return response.success(res, 'Student accounts fetched successfully', accounts);
    } catch (error) {
        console.error('Error fetching accounts:', error);
        return response.error(res, error, 500);
    }
};

// Update Account (Update Payment or Fee)
exports.updateAccount = async (req, res) => {
    try {
        const { studentId, payable, paid } = req.body;

        if (!studentId) {
            return response.error(res, 'Student ID required', 400);
        }

        await db.query(
            `INSERT INTO student_accounts (studentId, payable, paid) 
             VALUES (?, ?, ?) 
             ON DUPLICATE KEY UPDATE payable=VALUES(payable), paid=VALUES(paid)`,
            [studentId, payable || 0, paid || 0]
        );

        return response.success(res, 'Account record updated successfully');
    } catch (error) {
        console.error('Error updating account:', error);
        return response.error(res, error, 500);
    }
};

// Get Payment History for a student
exports.getPaymentHistory = async (req, res) => {
    try {
        const { studentId } = req.params;
        const [history] = await db.query(
            'SELECT * FROM payment_history WHERE studentId = ? ORDER BY payment_date DESC',
            [studentId]
        );
        return response.success(res, 'Payment history fetched successfully', history);
    } catch (error) {
        console.error('Error fetching payment history:', error);
        return response.error(res, error, 500);
    }
};

// Add New Payment Record
exports.addPaymentRecord = async (req, res) => {
    try {
        const { studentId, amount, payment_reason, payment_method, transaction_reference, remarks, status } = req.body;

        if (!studentId || !amount || !payment_reason) {
            return response.error(res, 'Student ID, Amount and Reason are required', 400);
        }

        // 1. Insert into payment_history
        await db.query(
            `INSERT INTO payment_history 
            (studentId, amount, payment_reason, payment_method, transaction_reference, remarks, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [studentId, amount, payment_reason, payment_method || 'Cash', transaction_reference, remarks, status || 'completed']
        );

        // 2. If status is completed, update student_accounts total paid
        if (!status || status === 'completed') {
            await db.query(
                `INSERT INTO student_accounts (studentId, paid, payable) VALUES (?, ?, 0) 
                 ON DUPLICATE KEY UPDATE paid = paid + ?`,
                [studentId, amount, amount]
            );
        }

        return response.success(res, 'Payment recorded successfully');
    } catch (error) {
        console.error('Error adding payment record:', error);
        return response.error(res, error, 500);
    }
};

// Get Own Account Details (For Students)
exports.getMyAccounts = async (req, res) => {
    try {
        const studentId = req.user.studentId;

        // 1. Get Summary
        const [summary] = await db.query('SELECT * FROM student_accounts WHERE studentId = ?', [studentId]);

        let accountSummary = {
            payable: 0,
            paid: 0,
            due: 0
        };

        if (summary.length > 0) {
            accountSummary = {
                payable: summary[0].payable,
                paid: summary[0].paid,
                due: summary[0].payable - summary[0].paid
            };
        }

        // 2. Get History
        const [history] = await db.query(
            'SELECT * FROM payment_history WHERE studentId = ? ORDER BY payment_date DESC',
            [studentId]
        );

        return response.success(res, 'My account details fetched successfully', {
            summary: accountSummary,
            history: history
        });

    } catch (error) {
        console.error('Error fetching my accounts:', error);
        return response.error(res, error, 500);
    }
};
