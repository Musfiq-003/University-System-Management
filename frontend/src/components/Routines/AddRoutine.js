import React, { useState } from 'react';

function AddRoutine() {
  const [formData, setFormData] = useState({
    department: '',
    batch: '',
    semester: '',
    shift: 'Day',
    students_count: '',
    room_number: '',
    counselor_name: '',
    counselor_contact: '',
    academic_year: '',
    effective_from: ''
  });

  const [courses, setCourses] = useState([
    { course_code: '', course_name: '', teacher: '', credits: '', section: '' }
  ]);

  const [timeSlots, setTimeSlots] = useState({
    Saturday: [],
    Sunday: [],
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Department and batch data
  const departmentBatchData = {
    'CSE': [
      ...Array.from({ length: 105 - 67 + 1 }, (_, i) => {
        const num = 67 + i;
        if (num === 78) return ['D-78A', 'D-78B'];
        if (num === 100) return ['D-100A', 'D-100B'];
        return `D-${num}`;
      }).flat(),
      ...Array.from({ length: 125 - 83 + 1 }, (_, i) => `E-${83 + i}`)
    ],
    'Law': Array.from({ length: 73 - 62 + 1 }, (_, i) => `${62 + i}`),
    'BBA': Array.from({ length: 122 - 93 + 1 }, (_, i) => `P-${93 + i}`),
    'Civil': [
      ...Array.from({ length: 27 - 15 + 1 }, (_, i) => `D-${15 + i}`),
      ...Array.from({ length: 73 - 55 + 1 }, (_, i) => `E-${55 + i}`)
    ],
    'Economics': Array.from({ length: 21 - 11 + 1 }, (_, i) => `${11 + i}`),
    'EEE': [
      ...Array.from({ length: 68 - 47 + 1 }, (_, i) => `E-${47 + i}`),
      ...Array.from({ length: 45 - 35 + 1 }, (_, i) => `D-${35 + i}`)
    ],
    'Political Science': Array.from({ length: 29 - 15 + 1 }, (_, i) => `${15 + i}`),
    'English': Array.from({ length: 63 - 53 + 1 }, (_, i) => `Bi-${53 + i}`),
    'Microbiology': Array.from({ length: 5 }, (_, i) => `${i + 1}`),
    'BMB': Array.from({ length: 5 }, (_, i) => `${i + 1}`),
    'Pharmacy': Array.from({ length: 40 - 24 + 1 }, (_, i) => `${24 + i}`),
    'Sociology': Array.from({ length: 50 - 43 + 1 }, (_, i) => `B-${43 + i}`),
    'Development Studies': Array.from({ length: 4 }, (_, i) => `${i + 1}`)
  };

  const timeSlotOptions = [
    '08:00-09:30', '09:30-11:00', '11:00-12:30', '12:30-02:00',
    '02:00-03:30', '03:30-05:00', '05:00-06:30'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Reset batch when department changes
    if (name === 'department') {
      setFormData(prev => ({ ...prev, batch: '' }));
    }
  };

  const handleCourseChange = (index, field, value) => {
    const newCourses = [...courses];
    newCourses[index][field] = value;
    setCourses(newCourses);
  };

  const addCourse = () => {
    setCourses([...courses, { course_code: '', course_name: '', teacher: '', credits: '', section: '' }]);
  };

  const removeCourse = (index) => {
    if (courses.length > 1) {
      setCourses(courses.filter((_, i) => i !== index));
    }
  };

  const handleTimeSlotChange = (day, slot) => {
    setTimeSlots(prev => {
      const daySlots = prev[day] || [];
      if (daySlots.includes(slot)) {
        return { ...prev, [day]: daySlots.filter(s => s !== slot) };
      } else {
        return { ...prev, [day]: [...daySlots, slot] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate courses
      const validCourses = courses.filter(c => c.course_code && c.course_name && c.teacher);
      if (validCourses.length === 0) {
        setError('Please add at least one complete course');
        setLoading(false);
        return;
      }

      const routineData = {
        ...formData,
        students_count: parseInt(formData.students_count) || null,
        courses: validCourses,
        time_slots: timeSlots
      };

      const token = localStorage.getItem('token');
      const response = await fetch('/api/routines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(routineData)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Routine created successfully!');
        // Reset form
        setFormData({
          department: '',
          batch: '',
          semester: '',
          shift: 'Day',
          students_count: '',
          room_number: '',
          counselor_name: '',
          counselor_contact: '',
          academic_year: '',
          effective_from: ''
        });
        setCourses([{ course_code: '', course_name: '', teacher: '', credits: '', section: '' }]);
        setTimeSlots({
          Saturday: [],
          Sunday: [],
          Monday: [],
          Tuesday: [],
          Wednesday: [],
          Thursday: []
        });
        // Dispatch event to refresh routine list
        window.dispatchEvent(new Event('routineAdded'));
      } else {
        setError(data.message || 'Failed to create routine');
      }
    } catch (error) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Create DIU Class Routine</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="form">
        {/* Basic Information */}
        <div className="form-section">
          <h3 style={{ marginBottom: '15px', color: '#667eea' }}>📋 Basic Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Department *</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Department</option>
                <option value="CSE">CSE</option>
                <option value="Law">Law</option>
                <option value="BBA">BBA</option>
                <option value="Civil">Civil</option>
                <option value="Economics">Economics</option>
                <option value="EEE">EEE</option>
                <option value="Political Science">Political Science</option>
                <option value="English">English</option>
                <option value="Microbiology">Microbiology</option>
                <option value="BMB">BMB</option>
                <option value="Pharmacy">Pharmacy</option>
                <option value="Sociology">Sociology</option>
                <option value="Development Studies">Development Studies</option>
              </select>
            </div>

            <div className="form-group">
              <label>Batch *</label>
              <select
                name="batch"
                value={formData.batch}
                onChange={handleInputChange}
                disabled={!formData.department}
                required
              >
                <option value="">Select Batch</option>
                {formData.department && departmentBatchData[formData.department]?.map(batch => (
                  <option key={batch} value={batch}>{batch}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Semester *</label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Semester</option>
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
                <option value="Fall">Fall</option>
              </select>
            </div>

            <div className="form-group">
              <label>Shift *</label>
              <select
                name="shift"
                value={formData.shift}
                onChange={handleInputChange}
                required
              >
                <option value="Day">Day</option>
                <option value="Evening">Evening</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Total Students</label>
              <input
                type="number"
                name="students_count"
                value={formData.students_count}
                onChange={handleInputChange}
                placeholder="e.g., 45"
              />
            </div>

            <div className="form-group">
              <label>Room Number</label>
              <input
                type="text"
                name="room_number"
                value={formData.room_number}
                onChange={handleInputChange}
                placeholder="e.g., 501-A"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Academic Year</label>
              <input
                type="text"
                name="academic_year"
                value={formData.academic_year}
                onChange={handleInputChange}
                placeholder="e.g., 2025-2026"
              />
            </div>

            <div className="form-group">
              <label>Effective From</label>
              <input
                type="date"
                name="effective_from"
                value={formData.effective_from}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Counselor Information */}
        <div className="form-section">
          <h3 style={{ marginBottom: '15px', color: '#667eea' }}>👤 Counselor Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Counselor Name</label>
              <input
                type="text"
                name="counselor_name"
                value={formData.counselor_name}
                onChange={handleInputChange}
                placeholder="Dr. John Doe"
              />
            </div>

            <div className="form-group">
              <label>Counselor Contact</label>
              <input
                type="text"
                name="counselor_contact"
                value={formData.counselor_contact}
                onChange={handleInputChange}
                placeholder="01712345678"
              />
            </div>
          </div>
        </div>

        {/* Course Details */}
        <div className="form-section">
          <h3 style={{ marginBottom: '15px', color: '#667eea' }}>📚 Course Details</h3>
          
          {courses.map((course, index) => (
            <div key={index} style={{ 
              marginBottom: '20px', 
              padding: '15px', 
              background: 'rgba(102, 126, 234, 0.05)', 
              borderRadius: '8px',
              position: 'relative'
            }}>
              <div style={{ marginBottom: '10px', fontWeight: '600', color: '#667eea' }}>
                Course {index + 1}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Course Code *</label>
                  <input
                    type="text"
                    value={course.course_code}
                    onChange={(e) => handleCourseChange(index, 'course_code', e.target.value)}
                    placeholder="e.g., CSE123"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Course Name *</label>
                  <input
                    type="text"
                    value={course.course_name}
                    onChange={(e) => handleCourseChange(index, 'course_name', e.target.value)}
                    placeholder="e.g., Data Structures"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Teacher *</label>
                  <input
                    type="text"
                    value={course.teacher}
                    onChange={(e) => handleCourseChange(index, 'teacher', e.target.value)}
                    placeholder="e.g., Dr. Smith"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Credits</label>
                  <input
                    type="text"
                    value={course.credits}
                    onChange={(e) => handleCourseChange(index, 'credits', e.target.value)}
                    placeholder="e.g., 3.0"
                  />
                </div>

                <div className="form-group">
                  <label>Section</label>
                  <input
                    type="text"
                    value={course.section}
                    onChange={(e) => handleCourseChange(index, 'section', e.target.value)}
                    placeholder="e.g., A"
                  />
                </div>
              </div>

              {courses.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCourse(index)}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '5px 10px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addCourse}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            + Add Another Course
          </button>
        </div>

        {/* Time Slots */}
        <div className="form-section">
          <h3 style={{ marginBottom: '15px', color: '#667eea' }}>🕐 Weekly Time Slots</h3>
          <p style={{ fontSize: '13px', color: '#666', marginBottom: '15px' }}>
            Select time slots for each day when classes are scheduled
          </p>
          
          {Object.keys(timeSlots).map(day => (
            <div key={day} style={{ marginBottom: '15px' }}>
              <div style={{ fontWeight: '600', marginBottom: '8px', color: '#333' }}>{day}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {timeSlotOptions.map(slot => (
                  <label
                    key={slot}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '6px 12px',
                      background: timeSlots[day]?.includes(slot) 
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        : '#f0f0f0',
                      color: timeSlots[day]?.includes(slot) ? 'white' : '#333',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={timeSlots[day]?.includes(slot)}
                      onChange={() => handleTimeSlotChange(day, slot)}
                      style={{ marginRight: '6px' }}
                    />
                    {slot}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="submit-btn"
          style={{ width: '100%', marginTop: '20px' }}
        >
          {loading ? 'Creating Routine...' : '✓ Create Routine'}
        </button>
      </form>
    </div>
  );
}

export default AddRoutine;
