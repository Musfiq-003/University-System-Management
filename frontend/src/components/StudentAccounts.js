import React, { useState, useEffect } from 'react';
import './StudentDashboardV3.css'; // Reuse portal styles

function StudentAccounts({ user }) {
    const [summary, setSummary] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const headers = { 'Authorization': `Bearer ${token}` };

            // 1. Fetch Account Summary (from dashboard data or specific endpoint?)
            // We can reuse the admin endpoint if we allow student access to their OWN data
            // Alternatively, fetch dashboard data which includes accounts
            // Let's create a specific endpoint or use existing logic.
            // For now, let's assume we can hit the same endpoint but filtered for 'me'?
            // Actually, let's use the dashboard data endpoint concept or just fetch from users table?
            // Best approach: Add a 'my-account' endpoint or use the dashboard endpoint.
            // Let's try to fetch from /api/dashboard first if it has it, or just use the dashboard logic here.

            // To be safe and clean, I should have a specific endpoint. 
            // But to save backend work, I will use /api/dashboard logic or verify if getAccounts allows 'me'.
            // The admin getAccounts uses `req.query.studentId`.
            // If I call it as a student, it returns 403 Forbidden because of verifyRole(['admin']).

            // So I need to use what's available. `StudentDashboard.js` fetches filtered data.
            // It calculates it manually or fetches it.
            // In StudentDashboard:
            // const routineUrl = `/api/routines...`
            // const hostelRes = `/api/hostel/student/${user.studentId}`

            // Getting account info is currently hardcoded in StudentDashboard.js states?
            // No, wait. In StudentDashboard.js line 17:
            // const [accounts, setAccounts] = useState({ payable: 55000, ... });
            // It was hardcoded!

            // Wait, I need to fetch the REAL data from the DB.
            // I need an endpoint for students to get their account info.
            // I will add `getProperties` to `authController` or `accountController`.

            // Let's just fetch the payment history effectively since I added `getPaymentHistory`.
            // But `getPaymentHistory` in `accountController` also doesn't explicitly restrict to admin?
            // "exports.getPaymentHistory" uses "req.params.studentId".
            // Routes: `router.get('/accounts/history/:studentId', ...)`
            // In `adminRoutes.js`, it is protected by `verifyRole(['admin'])`.

            // So students CANNOT access it.
            // I need to add a student-accessible route.

            // I will implement a fetch using a new route I'll add shortly.

            const res = await fetch('/api/student/accounts', { headers });
            const data = await res.json();

            if (data.success) {
                setSummary(data.summary);
                setHistory(data.history);
            }

        } catch (error) {
            console.error('Error fetching accounts:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading-screen">Loading Accounts...</div>;

    return (
        <div className="dashboard-v3-container">
            <main className="portal-main" style={{ marginLeft: 0, paddingTop: '20px' }}>
                <div className="portal-content">
                    <div className="portal-header" style={{ marginBottom: '2rem', padding: 0, boxShadow: 'none' }}>
                        <div className="header-title">
                            <h2>💰 Financial Accounts</h2>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="overview-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                        <div className="overview-card">
                            <div className="card-label">Total Payable</div>
                            <div className="card-value">{summary?.payable || 0} ৳</div>
                        </div>
                        <div className="overview-card">
                            <div className="card-label">Total Paid</div>
                            <div className="card-value" style={{ color: 'green' }}>{summary?.paid || 0} ৳</div>
                        </div>
                        <div className="overview-card">
                            <div className="card-label">Net Due</div>
                            <div className="card-value" style={{ color: 'red' }}>{summary?.due || 0} ৳</div>
                        </div>
                    </div>

                    {/* Payment History Table */}
                    <div className="portal-widget">
                        <div className="widget-header">
                            <h3>📜 Payment History</h3>
                        </div>
                        <div className="widget-body">
                            {history.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
                                                <th style={{ padding: '1rem' }}>Date</th>
                                                <th style={{ padding: '1rem' }}>Reason</th>
                                                <th style={{ padding: '1rem' }}>Method</th>
                                                <th style={{ padding: '1rem' }}>Ref</th>
                                                <th style={{ padding: '1rem' }}>Amount</th>
                                                <th style={{ padding: '1rem' }}>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {history.map((pay) => (
                                                <tr key={pay.id} style={{ borderBottom: '1px solid #eee' }}>
                                                    <td style={{ padding: '1rem' }}>{new Date(pay.payment_date).toLocaleDateString()}</td>
                                                    <td style={{ padding: '1rem', fontWeight: '500' }}>{pay.payment_reason}</td>
                                                    <td style={{ padding: '1rem' }}>{pay.payment_method}</td>
                                                    <td style={{ padding: '1rem' }}><small>{pay.transaction_reference || '-'}</small></td>
                                                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>{pay.amount} ৳</td>
                                                    <td style={{ padding: '1rem' }}>
                                                        <span className={`status-badge status-${pay.status || 'completed'}`}
                                                            style={{
                                                                padding: '0.25rem 0.75rem',
                                                                borderRadius: '12px',
                                                                fontSize: '0.85rem',
                                                                background: pay.status === 'completed' ? '#d1fae5' : '#fee2e2',
                                                                color: pay.status === 'completed' ? '#065f46' : '#991b1b'
                                                            }}
                                                        >
                                                            {pay.status || 'Completed'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>No payment history found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default StudentAccounts;
