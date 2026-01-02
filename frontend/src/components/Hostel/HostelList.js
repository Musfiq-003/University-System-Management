import React, { useState, useEffect } from 'react';

function HostelList({ userRole }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchHostel, setSearchHostel] = useState('');
  const [searchStudentId, setSearchStudentId] = useState('');
  const [roomInfo, setRoomInfo] = useState([]);

  // Room configuration with seat capacity
  const roomConfiguration = [
    { hostel: 'Shaheed Rafiq Uddin Hall', room: '101', totalSeats: 4 },
    { hostel: 'Shaheed Rafiq Uddin Hall', room: '102', totalSeats: 4 },
    { hostel: 'Shaheed Rafiq Uddin Hall', room: '103', totalSeats: 4 },
    { hostel: 'Shaheed Rafiq Uddin Hall', room: '201', totalSeats: 4 },
    { hostel: 'Shaheed Rafiq Uddin Hall', room: '202', totalSeats: 4 },
    { hostel: 'Begum Sufia Kamal Hall', room: '101', totalSeats: 4 },
    { hostel: 'Begum Sufia Kamal Hall', room: '102', totalSeats: 4 },
    { hostel: 'Begum Sufia Kamal Hall', room: '103', totalSeats: 4 },
    { hostel: 'Begum Sufia Kamal Hall', room: '201', totalSeats: 4 },
    { hostel: 'Begum Sufia Kamal Hall', room: '202', totalSeats: 4 },
  ];

  const fetchStudents = async (hostel = '', studentId = '') => {
    setLoading(true);
    setError('');
    try {
      let url = '/api/hostel';
      
      if (studentId.trim()) {
        url = `/api/hostel/student/${studentId.trim()}`;
      } else if (hostel.trim()) {
        url = `/api/hostel/hostel/${hostel.trim()}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        // Handle single student response
        const studentData = data.data ? (Array.isArray(data.data) ? data.data : [data.data]) : [];
        setStudents(studentData);
        
        // Calculate room-wise occupancy for students and admin
        if (userRole === 'student' || userRole === 'admin') {
          const roomOccupancy = roomConfiguration.map(room => {
            const occupiedSeats = studentData.filter(
              s => s.hostel_name === room.hostel && s.room_number === room.room
            ).length;
            return {
              ...room,
              occupiedSeats,
              availableSeats: room.totalSeats - occupiedSeats
            };
          });
          setRoomInfo(roomOccupancy);
        }
      } else {
        setError(data.message || 'Failed to fetch hostel records');
        setStudents([]);
        setRoomInfo([]);
      }
    } catch (error) {
      setError('Error connecting to server');
      setStudents([]);
      setRoomInfo([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    // Listen for hostel added event
    window.addEventListener('hostelAdded', () => fetchStudents());
    return () => window.removeEventListener('hostelAdded', () => fetchStudents());
  }, []);

  const handleSearch = () => {
    fetchStudents(searchHostel, searchStudentId);
  };

  const handleReset = () => {
    setSearchHostel('');
    setSearchStudentId('');
    fetchStudents();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="list-container">
      <div className="list-header">
        <h2>{userRole === 'admin' ? 'Hostel Student Records' : 'Hostel Information'}</h2>
        
        {/* Show room-wise seat information for students and admin */}
        {(userRole === 'student' || userRole === 'admin') && roomInfo.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '15px', color: '#1976d2' }}>Room-wise Seat Availability</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
              {roomInfo.map((room, index) => (
                <div 
                  key={index}
                  style={{ 
                    padding: '15px', 
                    backgroundColor: room.availableSeats > 0 ? '#e8f5e9' : '#ffebee', 
                    borderRadius: '8px',
                    border: `2px solid ${room.availableSeats > 0 ? '#4caf50' : '#f44336'}`
                  }}
                >
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#424242' }}>{room.hostel}</h4>
                  <p style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold', color: '#212121' }}>
                    Room {room.room}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span>Available: <strong style={{ color: room.availableSeats > 0 ? '#2e7d32' : '#c62828' }}>{room.availableSeats}</strong></span>
                    <span>Total: <strong>{room.totalSeats}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Only show filters for admin */}
        {userRole === 'admin' && (
          <div className="filter-controls">
            <div className="filter-group">
              <label>Search by Hostel:</label>
              <input
                type="text"
                value={searchHostel}
                onChange={(e) => {
                  setSearchHostel(e.target.value);
                  setSearchStudentId('');
                }}
                placeholder="Enter hostel name"
              />
            </div>
            <div className="filter-group">
              <label>Search by Student ID:</label>
              <input
                type="text"
                value={searchStudentId}
                onChange={(e) => {
                  setSearchStudentId(e.target.value);
                  setSearchHostel('');
                }}
                placeholder="Enter student ID"
              />
            </div>
            <div className="filter-actions">
              <button className="btn btn-secondary" onClick={handleSearch}>
                Search
              </button>
              <button className="btn btn-outline" onClick={handleReset}>
                Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="loading">Loading hostel records...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : userRole === 'admin' ? (
        students.length === 0 ? (
          <div className="no-data">No hostel records found. Add your first allocation above!</div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Student ID</th>
                  <th>Hostel Name</th>
                  <th>Room Number</th>
                  <th>Department</th>
                  <th>Allocated Date</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.student_name}</td>
                    <td><span className="badge">{student.student_id}</span></td>
                    <td>{student.hostel_name}</td>
                    <td>{student.room_number}</td>
                    <td>{student.department}</td>
                    <td>{formatDate(student.allocated_date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <div className="info-message" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
          <p>Submit your hostel allocation request using the form above.</p>
          <p>Your request will be reviewed by the administration.</p>
        </div>
      )}
      
      <div className="list-footer">
        Total Records: {students.length}
      </div>
    </div>
  );
}

export default HostelList;
