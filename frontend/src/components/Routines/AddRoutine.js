import React, { useState } from 'react';

function AddRoutine() {
  const [formData, setFormData] = useState({
    department: '',
    batch: '',
    course: '',
    teacher: '',
    day: 'Saturday',
    start_time: '',
    end_time: '',
    room_number: ''
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
    // ... other departments can be added here as needed
  };

  const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('auth_token');
      // Append seconds if missing to match TIME format
      const payload = {
        ...formData,
        start_time: formData.start_time.length === 5 ? `${formData.start_time}:00` : formData.start_time,
        end_time: formData.end_time.length === 5 ? `${formData.end_time}:00` : formData.end_time
      };

      const response = await fetch('/api/routines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Class added successfully!');
        // Keep department and batch for easier consecutive entry
        setFormData(prev => ({
          ...prev,
          course: '',
          teacher: '',
          day: 'Saturday',
          start_time: '',
          end_time: '',
          room_number: ''
        }));
        // Dispatch event to refresh routine list
        window.dispatchEvent(new Event('routineAdded'));
      } else {
        setError(data.message || 'Failed to add class');
      }
    } catch (error) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2>Add Class Session</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="form">
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
              <option value="Computer Science & Engineering">Computer Science & Engineering</option>
              <option value="Electrical & Electronic Engineering">Electrical & Electronic Engineering</option>
              <option value="Civil Engineering">Civil Engineering</option>
              <option value="Business Administration">Business Administration</option>
              <option value="Law">Law</option>
            </select>
          </div>

          <div className="form-group">
            <label>Batch *</label>
            <input
              type="text"
              name="batch"
              value={formData.batch}
              onChange={handleInputChange}
              placeholder="e.g. Batch-91"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Course Name/Code *</label>
            <input
              type="text"
              name="course"
              value={formData.course}
              onChange={handleInputChange}
              placeholder="e.g. Operating System (0613-301)"
              required
            />
          </div>

          <div className="form-group">
            <label>Teacher *</label>
            <input
              type="text"
              name="teacher"
              value={formData.teacher}
              onChange={handleInputChange}
              placeholder="e.g. Md. Nazmus Sakib"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Day *</label>
            <select
              name="day"
              value={formData.day}
              onChange={handleInputChange}
              required
            >
              {days.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Room Number *</label>
            <input
              type="text"
              name="room_number"
              value={formData.room_number}
              onChange={handleInputChange}
              placeholder="e.g. Room-604"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Start Time *</label>
            <input
              type="time"
              name="start_time"
              value={formData.start_time}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>End Time *</label>
            <input
              type="time"
              name="end_time"
              value={formData.end_time}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="submit-btn"
          style={{ width: '100%', marginTop: '20px' }}
        >
          {loading ? 'Adding Class...' : '✓ Add Class'}
        </button>
      </form>
    </div>
  );
}

export default AddRoutine;
