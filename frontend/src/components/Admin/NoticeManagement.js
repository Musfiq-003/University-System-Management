import React, { useState, useEffect } from 'react';
import '../AdminDashboard.css';

function NoticeManagement() {
    const [notices, setNotices] = useState([]);
    const [formData, setFormData] = useState({ title: '', content: '', target_audience: 'all', publish_date: '' });

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const res = await fetch('http://localhost:3000/api/admin/notices', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setNotices(data.data);
        } catch (error) {
            console.error('Error fetching notices:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('auth_token');
            const res = await fetch('http://localhost:3000/api/admin/notices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                alert('Notice published!');
                setFormData({ title: '', content: '', target_audience: 'all', publish_date: '' });
                fetchNotices();
            }
        } catch (error) {
            console.error('Error creating notice:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this notice?')) return;
        try {
            const token = localStorage.getItem('auth_token');
            await fetch(`http://localhost:3000/api/admin/notices/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchNotices();
        } catch (error) {
            console.error('Error deleting notice:', error);
        }
    };

    return (
        <div className="admin-page-container">
            <h2>Notice Board Management</h2>

            <div className="admin-form-card">
                <h3>Publish New Notice</h3>
                <form onSubmit={handleSubmit} className="admin-form-vertical">
                    <input
                        type="text" placeholder="Notice Title"
                        value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required
                    />
                    <textarea
                        placeholder="Notice Content"
                        value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} required
                        rows="4"
                    ></textarea>
                    <div className="form-row">
                        <select
                            value={formData.target_audience} onChange={e => setFormData({ ...formData, target_audience: e.target.value })}
                        >
                            <option value="all">All Users</option>
                            <option value="students">Students Only</option>
                            <option value="faculty">Faculty Only</option>
                        </select>
                        <input
                            type="date"
                            value={formData.publish_date} onChange={e => setFormData({ ...formData, publish_date: e.target.value })}
                        />
                    </div>
                    <button type="submit" className="admin-btn-primary">Publish Notice</button>
                </form>
            </div>

            <div className="admin-cards-grid">
                {notices.map(notice => (
                    <div key={notice.id} className="notice-card-admin">
                        <div className="notice-header">
                            <h4>{notice.title}</h4>
                            <span className="notice-date">{new Date(notice.publish_date).toLocaleDateString()}</span>
                        </div>
                        <p>{notice.content.substring(0, 100)}...</p>
                        <div className="notice-footer">
                            <span className="audience-badge">{notice.target_audience}</span>
                            <button onClick={() => handleDelete(notice.id)} className="admin-btn-danger-sm">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default NoticeManagement;
