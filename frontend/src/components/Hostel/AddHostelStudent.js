import React, { useState } from 'react';

function AddHostelStudent({ userRole }) {
  const [formData, setFormData] = useState({
    student_name: '',
    student_id: '',
    hostel_name: '',
    room_number: '',
    department: '',
    allocated_date: new Date().toISOString().split('T')[0]
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await fetch('/api/hostel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ text: 'Hostel allocation request submitted successfully!', type: 'success' });
        setFormData({
          student_name: '',
          student_id: '',
          hostel_name: '',
          room_number: '',
          department: '',
          allocated_date: new Date().toISOString().split('T')[0]
        });
        // Trigger refresh of hostel list
        window.dispatchEvent(new Event('hostelAdded'));
      } else {
        setMessage({ text: data.message || 'Failed to submit allocation request', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Error connecting to server', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>{userRole === 'admin' ? 'Add Hostel Student Allocation' : 'Hostel Allocation Request'}</h2>
      <form onSubmit={handleSubmit} className="form">
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
        
        <div className="form-row">
          <div className="form-group">
            <label>Student Name *</label>
            <input
              type="text"
              name="student_name"
              value={formData.student_name}
              onChange={handleChange}
              placeholder="e.g., John Doe"
              required
            />
          </div>

          <div className="form-group">
            <label>Student ID *</label>
            <input
              type="text"
              name="student_id"
              value={formData.student_id}
              onChange={handleChange}
              placeholder="e.g., CS2024001"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Hostel Name *</label>
            <input
              type="text"
              name="hostel_name"
              value={formData.hostel_name}
              onChange={handleChange}
              placeholder="e.g., North Hall"
              required
            />
          </div>

          <div className="form-group">
            <label>Room Number *</label>
            <input
              type="text"
              name="room_number"
              value={formData.room_number}
              onChange={handleChange}
              placeholder="e.g., 101"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Department *</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="e.g., Computer Science"
              required
            />
          </div>

          <div className="form-group">
            <label>Allocated Date *</label>
            <input
              type="date"
              name="allocated_date"
              value={formData.allocated_date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (userRole === 'admin' ? 'Adding...' : 'Submitting...') : (userRole === 'admin' ? 'Add Hostel Allocation' : 'Submit Request')}
        </button>
      </form>
    </div>
  );
}

export default AddHostelStudent;
