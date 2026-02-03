import React, { useState } from 'react';
import '../AdminDashboard.css';

function ResultManagement() {
    const [searchId, setSearchId] = useState('');
    const [studentData, setStudentData] = useState(null);
    const [formData, setFormData] = useState({ cgpa: '', credits_completed: '' });
    const [message, setMessage] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('auth_token');
            // Using search API for results which returns array, we take first match or empty
            const res = await fetch(`/api/admin/results?studentId=${searchId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();

            if (data.success && data.data.length > 0) {
                const result = data.data[0];
                setStudentData(result);
                setFormData({ cgpa: result.cgpa, credits_completed: result.credits_completed });
                setMessage('Student found.');
            } else {
                setStudentData(null);
                setFormData({ cgpa: '', credits_completed: '' });
                setMessage('Student result not found. You can add new entry.');
            }
        } catch (error) {
            console.error('Error searching student:', error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('auth_token');
            const res = await fetch('/api/admin/results', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    studentId: searchId,
                    cgpa: formData.cgpa,
                    credits_completed: formData.credits_completed
                })
            });
            const data = await res.json();
            if (data.success) {
                alert('Result updated successfully!');
                handleSearch(e); // Refresh
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error updating result:', error);
        }
    };

    return (
        <div className="admin-page-container">
            <h2>Result Management</h2>

            <div className="admin-form-card">
                <h3>Search Student</h3>
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text" placeholder="Enter Student ID (e.g. CSE250101)"
                        value={searchId} onChange={e => setSearchId(e.target.value)} required
                    />
                    <button type="submit" className="admin-btn-secondary">Search</button>
                </form>
                {message && <p className="status-message">{message}</p>}
            </div>

            {(studentData || message.includes('add new')) && (
                <div className="admin-form-card">
                    <h3>Update Results for {searchId}</h3>
                    {studentData && <p><strong>Name:</strong> {studentData.full_name} | <strong>Batch:</strong> {studentData.batch}</p>}

                    <form onSubmit={handleUpdate} className="admin-form-grid">
                        <div className="form-group">
                            <label>CGPA</label>
                            <input
                                type="number" step="0.01" max="4.00"
                                value={formData.cgpa} onChange={e => setFormData({ ...formData, cgpa: e.target.value })} required
                            />
                        </div>
                        <div className="form-group">
                            <label>Credits Completed</label>
                            <input
                                type="number" step="0.5"
                                value={formData.credits_completed} onChange={e => setFormData({ ...formData, credits_completed: e.target.value })} required
                            />
                        </div>
                        <button type="submit" className="admin-btn-primary">Save Result</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default ResultManagement;
