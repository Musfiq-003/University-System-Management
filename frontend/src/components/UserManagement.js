// ======================================================
// User Management Component (Admin Only)
// ======================================================
// Allows admin to view all users and assign roles
// ======================================================

import React, { useState, useEffect } from 'react';
import './UserManagement.css';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [updatingUserId, setUpdatingUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:3000/api/auth/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setUsers(data.users);
      } else {
        setAlert({ show: true, message: data.message, type: 'error' });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setAlert({ show: true, message: 'Failed to load users', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      setUpdatingUserId(userId);
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`http://localhost:3000/api/auth/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });

      const data = await response.json();
      
      if (data.success) {
        setAlert({ show: true, message: 'User role updated successfully!', type: 'success' });
        fetchUsers(); // Refresh the list
      } else {
        setAlert({ show: true, message: data.message, type: 'error' });
      }
    } catch (error) {
      console.error('Error updating role:', error);
      setAlert({ show: true, message: 'Failed to update user role', type: 'error' });
    } finally {
      setUpdatingUserId(null);
    }
  };

  const getRoleBadgeClass = (role) => {
    switch(role) {
      case 'admin': return 'badge-admin';
      case 'faculty': return 'badge-faculty';
      case 'student': return 'badge-student';
      case 'pending': return 'badge-pending';
      default: return 'badge-default';
    }
  };

  if (loading) {
    return (
      <div className="user-management">
        <div className="loading">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="user-management">
      <div className="page-header">
        <h1>👥 User Management</h1>
        <p>Manage user roles and permissions</p>
      </div>

      {alert.show && (
        <div className={`alert alert-${alert.type}`}>
          {alert.message}
          <button onClick={() => setAlert({ show: false, message: '', type: '' })}>×</button>
        </div>
      )}

      <div className="users-grid">
        {users.map(user => (
          <div key={user.id} className="user-card">
            <div className="user-card-header">
              <div className="user-avatar">
                {user.full_name.charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                <h3>{user.full_name}</h3>
                <p className="user-email">{user.email}</p>
                <p className="user-date">
                  Joined: {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="user-card-body">
              <div className="user-status">
                <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                  {user.role.toUpperCase()}
                </span>
                <span className={`badge ${user.is_verified ? 'badge-verified' : 'badge-unverified'}`}>
                  {user.is_verified ? '✓ Verified' : '⚠ Unverified'}
                </span>
              </div>

              <div className="role-selector">
                <label>Assign Role:</label>
                <select
                  value={user.role}
                  onChange={(e) => updateUserRole(user.id, e.target.value)}
                  disabled={updatingUserId === user.id}
                  className="role-dropdown"
                >
                  <option value="pending">Pending</option>
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="no-users">
          <p>No users found</p>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
