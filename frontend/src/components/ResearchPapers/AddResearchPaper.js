import React, { useState } from 'react';

function AddResearchPaper({ userRole }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    department: '',
    year: new Date().getFullYear(),
    status: 'Draft'
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
      const response = await fetch('/api/research-papers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ text: 'Research paper added successfully!', type: 'success' });
        setFormData({
          title: '',
          author: '',
          department: '',
          year: new Date().getFullYear(),
          status: 'Draft'
        });
        // Trigger refresh of paper list
        window.dispatchEvent(new Event('paperAdded'));
      } else {
        setMessage({ text: data.message || 'Failed to add research paper', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Error connecting to server', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>{userRole === 'admin' ? 'Add Research Paper' : 'Submit Research Paper'}</h2>
      <form onSubmit={handleSubmit} className="form">
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
        
        <div className="form-group">
          <label>Paper Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Machine Learning in Healthcare"
            required
          />
        </div>

        <div className="form-group">
          <label>Author Name *</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="e.g., Dr. Alice Brown"
            required
          />
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
            <label>Year *</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              min="1900"
              max="2100"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Status *</label>
          <select name="status" value={formData.status} onChange={handleChange} required>
            <option value="Draft">Draft</option>
            <option value="Under Review">Under Review</option>
            <option value="Published">Published</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Submitting...' : (userRole === 'admin' ? 'Add Research Paper' : 'Submit Paper')}
        </button>
      </form>
    </div>
  );
}

export default AddResearchPaper;
