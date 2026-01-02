import React, { useState, useEffect } from 'react';

function ResearchPaperList({ userRole }) {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchDept, setSearchDept] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  const fetchPapers = async () => {
    setLoading(true);
    setError('');
    try {
      let url = '/api/research-papers';
      
      if (filterStatus !== 'All') {
        url = `/api/research-papers/status/${filterStatus}`;
      } else if (searchDept.trim()) {
        url = `/api/research-papers/department/${searchDept.trim()}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setPapers(data.data);
      } else {
        setError('Failed to fetch research papers');
      }
    } catch (error) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPapers();
    // Listen for paper added event
    window.addEventListener('paperAdded', fetchPapers);
    return () => window.removeEventListener('paperAdded', fetchPapers);
  }, [filterStatus]);

  const handleStatusUpdate = async (id) => {
    try {
      const response = await fetch(`/api/research-papers/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        setEditingId(null);
        setNewStatus('');
        fetchPapers();
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      alert('Error connecting to server');
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Published':
        return 'status-published';
      case 'Under Review':
        return 'status-review';
      case 'Draft':
        return 'status-draft';
      case 'Rejected':
        return 'status-rejected';
      default:
        return '';
    }
  };

  return (
    <div className="list-container">
      <div className="list-header">
        <h2>{userRole === 'admin' ? 'Research Papers' : 'Research Paper Information'}</h2>
        
        {/* Show submitted paper count for students and faculty */}
        {userRole !== 'admin' && (
          <div className="info-box" style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#2e7d32' }}>Submitted Papers</h3>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#1b5e20' }}>
              {papers.length} papers submitted
            </p>
          </div>
        )}
        
        {/* Only show filters for admin */}
        {userRole === 'admin' && (
          <div className="filter-controls">
            <div className="filter-group">
              <label>Status:</label>
              <select value={filterStatus} onChange={(e) => {
                setFilterStatus(e.target.value);
                setSearchDept('');
              }}>
                <option value="All">All Status</option>
                <option value="Draft">Draft</option>
                <option value="Under Review">Under Review</option>
                <option value="Published">Published</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Search Department:</label>
              <input
                type="text"
                value={searchDept}
                onChange={(e) => setSearchDept(e.target.value)}
                placeholder="Enter department"
              />
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setFilterStatus('All');
                  fetchPapers();
                }}
              >
                Search
              </button>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="loading">Loading research papers...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : userRole === 'admin' ? (
        papers.length === 0 ? (
          <div className="no-data">No research papers found. Add your first paper above!</div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Department</th>
                  <th>Year</th>
                  <th>Status</th>
                  <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {papers.map((paper) => (
                <tr key={paper.id}>
                  <td>{paper.title}</td>
                  <td>{paper.author}</td>
                  <td>{paper.department}</td>
                  <td>{paper.year}</td>
                  <td>
                    {editingId === paper.id ? (
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="status-select"
                      >
                        <option value="">Select Status</option>
                        <option value="Draft">Draft</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Published">Published</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    ) : (
                      <span className={`status-badge ${getStatusClass(paper.status)}`}>
                        {paper.status}
                      </span>
                    )}
                  </td>
                  <td>
                    {editingId === paper.id ? (
                      <div className="action-buttons">
                        <button
                          className="btn-small btn-success"
                          onClick={() => handleStatusUpdate(paper.id)}
                          disabled={!newStatus}
                        >
                          Save
                        </button>
                        <button
                          className="btn-small btn-cancel"
                          onClick={() => {
                            setEditingId(null);
                            setNewStatus('');
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        className="btn-small btn-edit"
                        onClick={() => {
                          setEditingId(paper.id);
                          setNewStatus(paper.status);
                        }}
                      >
                        Update Status
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )
      ) : (
        <div className="info-message" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
          <p>Submit your research paper using the form above.</p>
          <p>Your submission will be reviewed by the administration.</p>
        </div>
      )}
      
      <div className="list-footer">
        Total Papers: {papers.length}
      </div>
    </div>
  );
}

export default ResearchPaperList;
