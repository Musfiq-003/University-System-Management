import React, { useState, useEffect } from 'react';
import './Auth/Auth.css'; // Reusing Auth styles for consistent look

function Settings() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        phone_number: '',
        address: '',
        date_of_birth: '',
        gender: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            // We use /me endpoint to get current user data
            const response = await fetch('/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (data.success) {
                const u = data.data.user;
                setUser(u);
                setFormData({
                    phone_number: u.phone_number || '',
                    address: u.address || '',
                    date_of_birth: u.date_of_birth ? u.date_of_birth.split('T')[0] : '',
                    gender: u.gender || ''
                });
            } else {
                setError('Failed to load profile');
            }
        } catch (err) {
            setError('Connection error');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch('/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (data.success) {
                setMessage('Profile updated successfully!');
                // Update local storage user info if needed, or just re-fetch
                fetchUserProfile();
            } else {
                setError(data.message || 'Update failed');
            }
        } catch (err) {
            setError('Update failed. Please try again.');
        }
    };

    if (loading) return <div className="loading">Loading settings...</div>;

    return (
        <div className="list-container">
            <div className="list-header">
                <h2>⚙️ Settings & Profile</h2>
            </div>

            <div className="auth-card" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
                <div className="user-profile-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div className="user-avatar-large" style={{ margin: '0 auto 1rem' }}>
                        {user?.full_name?.charAt(0).toUpperCase()}
                    </div>
                    <h3>{user?.full_name}</h3>
                    <p style={{ color: '#666' }}>{user?.email}</p>
                    <span className={`status-badge status-${user?.role}`}>{user?.role}</span>
                </div>

                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                            />
                        </div>

                        <div className="form-group">
                            <label>Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Date of Birth</label>
                            <input
                                type="date"
                                name="date_of_birth"
                                value={formData.date_of_birth}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Address</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows="3"
                            className="form-textarea"
                            placeholder="Enter your full address"
                        />
                    </div>

                    <div className="form-actions" style={{ marginTop: '2rem' }}>
                        <button type="submit" className="btn btn-primary">
                            Save Changes
                        </button>
                    </div>
                </form>

                <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #eee' }}>
                    <h3>🔒 Security</h3>
                    <p style={{ color: '#666', marginBottom: '1rem' }}>To change your password, please use the "Forgot Password" flow from the login screen or contact IT support.</p>
                </div>
            </div>
        </div>
    );
}

export default Settings;
