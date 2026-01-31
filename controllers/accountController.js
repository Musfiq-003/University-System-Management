const db = require('../config/db');

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
        res.json({ success: true, data: accounts });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Update Account (Update Payment or Fee)
exports.updateAccount = async (req, res) => {
    try {
        const { studentId, payable, paid } = req.body;

        if (!studentId) {
            return res.status(400).json({ success: false, message: 'Student ID required' });
        }

        await db.query(
            `INSERT INTO student_accounts (studentId, payable, paid) 
             VALUES (?, ?, ?) 
             ON DUPLICATE KEY UPDATE payable=VALUES(payable), paid=VALUES(paid)`,
            [studentId, payable || 0, paid || 0]
        );

        res.json({ success: true, message: 'Account Record updated' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
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
        res.json({ success: true, data: history });
    } catch (error) {
        console.error('Error fetching payment history:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Add New Payment Record
exports.addPaymentRecord = async (req, res) => {
    try {
        const { studentId, amount, payment_reason, payment_method, transaction_reference, remarks, status } = req.body;

        if (!studentId || !amount || !payment_reason) {
            return res.status(400).json({ success: false, message: 'Student ID, Amount and Reason are required' });
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

        res.json({ success: true, message: 'Payment recorded successfully' });
    } catch (error) {
        console.error('Error adding payment record:', error);
        res.status(500).json({ success: false, message: 'Server error' });
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

        res.json({
            success: true,
            summary: accountSummary,
            history: history
        });

    } catch (error) {
        console.error('Error fetching my accounts:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
