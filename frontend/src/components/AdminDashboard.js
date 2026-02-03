import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard({ user }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        pendingUsers: 0,
        facultyCount: 0,
        studentCount: 0
    });

    // Mock Data for Pending Approvals (Hybrid with real data if API supports)
    const [pendingApprovals, setPendingApprovals] = useState([]);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch('/api/auth/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.success) {
                const users = data.data;
                setStats({
                    totalUsers: users.length,
                    pendingUsers: users.filter(u => u.role === 'pending').length,
                    facultyCount: users.filter(u => u.role === 'faculty').length,
                    studentCount: users.filter(u => u.role === 'student').length
                });

                // Setting pending approvals list
                setPendingApprovals(users.filter(u => u.role === 'pending').slice(0, 5));
            }
        } catch (error) {
            console.error('Error fetching admin stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickAction = (action) => {
        switch (action) {
            case 'users': navigate('/users'); break;
            case 'routines': navigate('/routines'); break;
            case 'hostel': navigate('/hostel'); break;
            case 'research': navigate('/research-papers'); break;
            case 'courses': navigate('/courses'); break;
            case 'results': navigate('/results'); break;
            case 'accounts': navigate('/accounts'); break;
            case 'notices': navigate('/notices'); break;
            default: break;
        }
    };

    const getCurrentGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    if (loading) {
        return <div className="loading">Loading dashboard...</div>;
    }

    return (
        <div className="admin-dashboard">
            {/* Hero Section */}
            <div className="admin-hero">
                <div className="hero-content">
                    <h1>{getCurrentGreeting()}, {user?.full_name || 'Admin'} 🛡️</h1>
                    <p className="hero-subtitle">System overview and control center. Everything looks good today.</p>
                </div>
                <div className="admin-badge">
                    <span>👑 System Administrator</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="admin-stats-grid">
                <div className="stat-card blue">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                        <h3>{stats.totalUsers}</h3>
                        <p>Total Users</p>
                    </div>
                </div>
                <div className="stat-card orange">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-info">
                        <h3>{stats.pendingUsers}</h3>
                        <p>Pending Approvals</p>
                    </div>
                </div>
                <div className="stat-card green">
                    <div className="stat-icon">👨‍🏫</div>
                    <div className="stat-info">
                        <h3>{stats.facultyCount}</h3>
                        <p>Faculty Members</p>
                    </div>
                </div>
                <div className="stat-card purple">
                    <div className="stat-icon">🎓</div>
                    <div className="stat-info">
                        <h3>{stats.studentCount}</h3>
                        <p>Active Students</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid">
                {/* Quick Actions Panel */}
                <div className="dashboard-widget quick-actions-panel">
                    <div className="widget-header">
                        <h2>⚡ Quick Actions</h2>
                    </div>
                    <div className="admin-action-card" onClick={() => handleQuickAction('users')}>
                        <span className="action-icon-large">👥</span>
                        <h3>User Management</h3>
                    </div>
                    <div className="admin-action-card" onClick={() => handleQuickAction('routines')}>
                        <span className="action-icon-large">📅</span>
                        <h3>Manage Routines</h3>
                    </div>
                    <div className="admin-action-card" onClick={() => handleQuickAction('courses')}>
                        <span className="action-icon-large">📖</span>
                        <h3>Courses</h3>
                    </div>
                    <div className="admin-action-card" onClick={() => handleQuickAction('notices')}>
                        <span className="action-icon-large">📢</span>
                        <h3>Notices</h3>
                    </div>
                    <div className="admin-action-card" onClick={() => handleQuickAction('results')}>
                        <span className="action-icon-large">📊</span>
                        <h3>Results</h3>
                    </div>
                    <div className="admin-action-card" onClick={() => handleQuickAction('accounts')}>
                        <span className="action-icon-large">💰</span>
                        <h3>Accounts</h3>
                    </div>
                    <div className="admin-action-card" onClick={() => handleQuickAction('hostel')}>
                        <span className="action-icon-large">🏢</span>
                        <h3>Hostel Admin</h3>
                    </div>
                    <div className="admin-action-card" onClick={() => handleQuickAction('research')}>
                        <span className="action-icon-large">📚</span>
                        <h3>Research Papers</h3>
                    </div>
                </div>
            </div>

            {/* Pending Approvals */}
            <div className="dashboard-widget pending-approvals">
                <div className="widget-header">
                    <h2>⏳ Pending Verification</h2>
                </div>
                <div className="table-container">
                    {pendingApprovals.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingApprovals.map(u => (
                                    <tr key={u.id}>
                                        <td>
                                            <div className="user-cell">
                                                <div className="user-avatar-small">{u.full_name.charAt(0)}</div>
                                                {u.full_name}
                                            </div>
                                        </td>
                                        <td>{u.email}</td>
                                        <td><span className="status-badge status-pending">Pending</span></td>
                                        <td>
                                            <button className="action-btn-sm btn-approve" onClick={() => navigate('/users')}>
                                                Review
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '20px', color: '#718096' }}>
                            No pending user approvals needed.
                        </div>
                    )}
                </div>
            </div>

            {/* System Health */}
            <div className="dashboard-widget system-health">
                <div className="widget-header">
                    <h2>❤️ System Health</h2>
                </div>
                <div className="health-metrics">
                    <div className="metric-item">
                        <div className="metric-header">
                            <span>API Uptime</span>
                            <span style={{ color: '#48bb78' }}>99.9%</span>
                        </div>
                        <div className="metric-bar-bg">
                            <div className="metric-bar-fill api-uptime"></div>
                        </div>
                    </div>
                    <div className="metric-item">
                        <div className="metric-header">
                            <span>Database Load</span>
                            <span>24%</span>
                        </div>
                        <div className="metric-bar-bg">
                            <div className="metric-bar-fill db-load"></div>
                        </div>
                    </div>
                    <div className="metric-item">
                        <div className="metric-header">
                            <span>Storage Usage</span>
                            <span>45%</span>
                        </div>
                        <div className="metric-bar-bg">
                            <div className="metric-bar-fill disk-usage"></div>
                        </div>
                    </div>
                    <div style={{ marginTop: '15px', fontSize: '0.85rem', color: '#718096' }}>
                        <p>Last backup: 2 hours ago</p>
                        <p>Server version: v1.2.0</p>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default AdminDashboard;
