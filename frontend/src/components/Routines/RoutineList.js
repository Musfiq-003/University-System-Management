import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function RoutineList({ userRole }) {
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [filterBatch, setFilterBatch] = useState('All');

  // Hardcoded for now, ideal to fetch from DB
  const departmentBatchData = {
    'Computer Science & Engineering': ['Batch-91', 'D-78A', 'D-78B'],
    'Business Administration': ['BBA-24', 'BBA-25', 'BBA-20'],
    'Electrical & Electronic Engineering': ['EEE-24'],
    'Law': ['LAW-10'],
    // Add more as needed
  };

  const getBatchOptions = () => {
    if (filterDepartment === 'All' || !departmentBatchData[filterDepartment]) {
      return ['All'];
    }
    return ['All', ...departmentBatchData[filterDepartment]];
  };

  const fetchRoutines = async () => {
    setLoading(true);
    setError('');
    try {
      // Build query string
      let url = '/api/routines?';
      if (filterDepartment !== 'All') url += `department=${encodeURIComponent(filterDepartment)}&`;
      if (filterBatch !== 'All') url += `batch=${encodeURIComponent(filterBatch)}`;

      const token = localStorage.getItem('auth_token');
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (data.success) {
        setRoutines(data.data);
      } else {
        setError(data.message || 'Failed to fetch routines');
        if (data.message === 'No token provided. Please login.') {
          // Optional: Redirect to login or clear bad token?
          console.warn('Authentication token missing or invalid');
        }
      }
    } catch (error) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutines();
    window.addEventListener('routineAdded', fetchRoutines);
    return () => window.removeEventListener('routineAdded', fetchRoutines);
  }, [filterDepartment, filterBatch]);

  // Group routines by Batch (and Department)
  const groupedRoutines = routines.reduce((acc, routine) => {
    const key = `${routine.department} - ${routine.batch}`;
    if (!acc[key]) {
      acc[key] = {
        department: routine.department,
        batch: routine.batch,
        classes: []
      };
    }
    acc[key].classes.push(routine);
    return acc;
  }, {});

  const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this class?')) return;
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/routines/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        fetchRoutines();
      } else {
        alert('Failed to delete');
      }
    } catch (e) {
      alert('Error deleting');
    }
  };

  const renderSchedule = (group) => {
    // Organize classes by Day
    const scheduleByDay = days.reduce((acc, day) => {
      acc[day] = group.classes.filter(c => c.day === day).sort((a, b) => a.start_time.localeCompare(b.start_time));
      return acc;
    }, {});

    return (
      <div key={group.batch} style={{
        margin: '20px 0',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '15px 20px',
          background: 'linear-gradient(to right, #6a11cb 0%, #2575fc 100%)',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ margin: 0 }}>{group.department} - {group.batch}</h3>
          <span style={{ fontSize: '0.9em', opacity: 0.9 }}>{group.classes.length} Classes</span>
        </div>

        <div style={{ padding: '20px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee' }}>
                <th style={{ width: '120px', textAlign: 'left', padding: '10px', color: '#555' }}>Day</th>
                <th style={{ textAlign: 'left', padding: '10px', color: '#555' }}>Schedule</th>
              </tr>
            </thead>
            <tbody>
              {days.map(day => {
                const classes = scheduleByDay[day] || [];
                if (classes.length === 0) return null;

                return (
                  <tr key={day} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '15px 10px', fontWeight: 'bold', color: '#333' }}>{day}</td>
                    <td style={{ padding: '10px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {classes.map(cls => (
                          <div key={cls.id} style={{
                            background: '#f8f9fa',
                            borderLeft: '4px solid #2575fc',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            minWidth: '200px',
                            position: 'relative',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                          }}>
                            <div style={{ fontWeight: 'bold', color: '#2c3e50' }}>{cls.course}</div>
                            <div style={{ fontSize: '0.9em', color: '#555', marginTop: '2px' }}>
                              ⏱ {cls.start_time.slice(0, 5)} - {cls.end_time.slice(0, 5)}
                            </div>
                            <div style={{ fontSize: '0.85em', color: '#666', marginTop: '2px' }}>
                              👤 {cls.teacher} | 📍 {cls.room_number}
                            </div>
                            {userRole === 'admin' && (
                              <button
                                onClick={() => handleDelete(cls.id)}
                                style={{
                                  position: 'absolute',
                                  top: '5px',
                                  right: '5px',
                                  background: 'none',
                                  border: 'none',
                                  color: '#e74c3c',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  padding: '2px'
                                }}
                                title="Remove Class"
                              >
                                ✖
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {Object.keys(scheduleByDay).filter(d => scheduleByDay[d].length > 0).length === 0 && (
                <tr>
                  <td colSpan="2" style={{ padding: '20px', textAlign: 'center', fontStyle: 'italic', color: '#999' }}>
                    No classes scheduled yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="list-container">
      <div className="list-header" style={{ marginBottom: '20px' }}>
        <h2>Class Routines</h2>
        <div style={{ display: 'flex', gap: '15px' }}>
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="All">All Departments</option>
            {Object.keys(departmentBatchData).map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <select
            value={filterBatch}
            onChange={(e) => setFilterBatch(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="All">All Batches</option>
            {getBatchOptions().filter(d => d !== 'All').map(batch => (
              <option key={batch} value={batch}>{batch}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading routines...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : Object.keys(groupedRoutines).length === 0 ? (
        <div className="no-data">No routines found.</div>
      ) : (
        <div>
          {Object.values(groupedRoutines).map(group => renderSchedule(group))}
        </div>
      )}
    </div>
  );
}

export default RoutineList;
