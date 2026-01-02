// ======================================================
// Teachers Component - Display Faculty Information
// ======================================================

import React, { useState, useEffect } from 'react';
import './Teachers.css';

function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState('CSE');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDepartments();
    fetchTeachers('CSE');
  }, []);

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:3000/api/departments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setDepartments(data.departments);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchTeachers = async (department) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:3000/api/teachers?department=${department}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setTeachers(data.teachers);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentChange = (dept) => {
    setSelectedDept(dept);
    fetchTeachers(dept);
  };

  const extractRole = (designation) => {
    const lowerDesignation = designation.toLowerCase();
    
    // Check for Dean first (highest priority)
    if (lowerDesignation.includes('dean')) return 'Dean';
    
    // Check for Chairman/Chairperson
    if (lowerDesignation.includes('chairman') || lowerDesignation.includes('chairperson')) return 'Chairman';
    
    // Check for Professor roles
    if (lowerDesignation.includes('professor')) {
      if (lowerDesignation.includes('associate')) return 'Associate Professor';
      if (lowerDesignation.includes('assistant')) return 'Assistant Professor';
      return 'Professor';
    }
    
    // Check for Lecturer
    if (lowerDesignation.includes('lecturer')) return 'Lecturer';
    
    // Default to Lecturer
    return 'Lecturer';
  };

  const getRoleOrder = (role) => {
    const order = { 'Dean': 1, 'Professor': 2, 'Chairman': 3, 'Associate Professor': 4, 'Assistant Professor': 5, 'Lecturer': 6 };
    return order[role] || 999;
  };

  const filteredTeachers = teachers
    .filter(teacher =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.designation.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map(teacher => ({
      ...teacher,
      role: extractRole(teacher.designation)
    }))
    .sort((a, b) => {
      const orderDiff = getRoleOrder(a.role) - getRoleOrder(b.role);
      if (orderDiff !== 0) return orderDiff;
      return a.name.localeCompare(b.name);
    });

  const getRoleColor = (role) => {
    switch(role) {
      case 'Dean': return '#7c3aed';
      case 'Professor': return '#ea580c';
      case 'Chairman': return '#dc2626';
      case 'Associate Professor': return '#2563eb';
      case 'Assistant Professor': return '#16a34a';
      case 'Lecturer': return '#9333ea';
      default: return '#64748b';
    }
  };

  return (
    <div className="teachers-container">
      <div className="teachers-header">
        <div>
          <h1>👨‍🏫 Faculty Members</h1>
          <p>Browse faculty by department</p>
        </div>
        <div className="header-stats">
          <div className="stat-card">
            <span className="stat-number">{teachers.length}</span>
            <span className="stat-label">Total Faculty</span>
          </div>
        </div>
      </div>

      <div className="teachers-controls">
        <div className="controls-row">
          <div className="department-selector">
            <label>Select Department:</label>
            <div className="department-tabs">
              {departments.map((dept) => (
                <button
                  key={dept.id}
                  className={`dept-tab ${selectedDept === dept.code ? 'active' : ''}`}
                  onClick={() => handleDepartmentChange(dept.code)}
                >
                  {dept.code}
                </button>
              ))}
            </div>
          </div>
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name, email, or designation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading faculty information...</p>
        </div>
      ) : filteredTeachers.length > 0 ? (
        <>
          <div className="department-info">
            <h2>{departments.find(d => d.code === selectedDept)?.name || selectedDept}</h2>
            <p>{filteredTeachers.length} faculty member{filteredTeachers.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="teachers-grid">
            {filteredTeachers.map((teacher) => (
              <div key={teacher.id} className="teacher-card">
                <div className="teacher-card-header">
                  <div className="teacher-avatar">
                    {teacher.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                  <div className="teacher-badge" style={{ backgroundColor: getRoleColor(teacher.role) }}>
                    {teacher.role}
                  </div>
                </div>

                <div className="teacher-info">
                  <h3 className="teacher-name">{teacher.name}</h3>
                  <p className="teacher-designation">{teacher.designation}</p>

                  <div className="teacher-contact">
                    <div className="contact-item">
                      <span className="contact-icon">📧</span>
                      <a href={`mailto:${teacher.email}`} className="contact-link">
                        {teacher.email}
                      </a>
                    </div>
                    <div className="contact-item">
                      <span className="contact-icon">📱</span>
                      <a href={`tel:${teacher.mobile || teacher.phone}`} className="contact-link">
                        {teacher.mobile || teacher.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h3>No Faculty Members Found</h3>
          <p>
            {searchTerm 
              ? 'No faculty members match your search criteria. Try different keywords.'
              : `No faculty information available for ${departments.find(d => d.code === selectedDept)?.name || selectedDept} yet.`
            }
          </p>
        </div>
      )}
    </div>
  );
}

export default Teachers;
