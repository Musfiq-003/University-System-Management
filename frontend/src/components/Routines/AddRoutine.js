import React, { useState } from 'react';

function AddRoutine() {
  const [formData, setFormData] = useState({
    course: '',
    teacher: '',
    department: '',
    start_time: '',
    end_time: '',
    batch: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  // Department and batch data structure
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

  // Get batch options based on selected department
  const getBatchOptions = () => {
    if (!formData.department) return [];
    return departmentBatchData[formData.department] || [];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      // Reset batch if department changes
      if (name === 'department') {
        return { ...prev, [name]: value, batch: '' };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await fetch('/api/routines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ text: 'Routine added successfully!', type: 'success' });
        setFormData({
          course: '',
          teacher: '',
          department: '',
          start_time: '',
          end_time: '',
          batch: ''
        });
        // Trigger refresh of routine list
        window.dispatchEvent(new Event('routineAdded'));
      } else {
        setMessage({ text: data.message || 'Failed to add routine', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Error connecting to server', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Add Class Routine</h2>
      <form onSubmit={handleSubmit} className="form">
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
        
        <div className="form-group">
          <label>Course Name *</label>
          <input
            type="text"
            name="course"
            value={formData.course}
            onChange={handleChange}
            placeholder="e.g., Database Systems"
            required
          />
        </div>

        <div className="form-group">
          <label>Teacher Name *</label>
          <input
            type="text"
            name="teacher"
            value={formData.teacher}
            onChange={handleChange}
            placeholder="e.g., Dr. John Smith"
            required
          />
        </div>

        <div className="form-group">
          <label>Department *</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
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
            onChange={handleChange}
            disabled={!formData.department}
            required
          >
            <option value="">Select Batch</option>
            {getBatchOptions().map(batch => (
              <option key={batch} value={batch}>{batch}</option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Start Time *</label>
            <input
              type="time"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>End Time *</label>
            <input
              type="time"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Adding...' : 'Add Routine'}
        </button>
      </form>
    </div>
  );
}

export default AddRoutine;
