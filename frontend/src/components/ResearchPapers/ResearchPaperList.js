import React, { useState, useEffect } from 'react';

function ResearchPaperList({ userRole, userName }) {
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

      const token = localStorage.getItem('auth_token');
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (data.success) {
        setPapers(data.data);
      } else {
        setError(data.message || 'Failed to fetch research papers');
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
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/research-papers/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
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
        <h2>{userRole === 'admin' ? 'All Research Papers' : 'My Research Papers'}</h2>

        {/* Show submitted paper count for students and faculty */}
        {userRole !== 'admin' && (
          <div className="info-box" style={{ marginBottom: '20px', padding: '20px', background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#2e7d32', fontSize: '1.2rem' }}>📊 Submission Summary</h3>
            <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#1b5e20' }}>
              Total Papers Submitted: {papers.length}
            </p>
            {papers.length > 0 && (
              <div style={{ marginTop: '12px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <span style={{ padding: '6px 12px', borderRadius: '20px', background: '#fff3e0', color: '#e65100', fontSize: '14px', fontWeight: '600' }}>
                  Draft: {papers.filter(p => p.status === 'Draft').length}
                </span>
                <span style={{ padding: '6px 12px', borderRadius: '20px', background: '#fff9c4', color: '#f57f17', fontSize: '14px', fontWeight: '600' }}>
                  Under Review: {papers.filter(p => p.status === 'Under Review').length}
                </span>
                <span style={{ padding: '6px 12px', borderRadius: '20px', background: '#e8f5e9', color: '#2e7d32', fontSize: '14px', fontWeight: '600' }}>
                  Published: {papers.filter(p => p.status === 'Published').length}
                </span>
                <span style={{ padding: '6px 12px', borderRadius: '20px', background: '#ffebee', color: '#c62828', fontSize: '14px', fontWeight: '600' }}>
                  Rejected: {papers.filter(p => p.status === 'Rejected').length}
                </span>
              </div>
            )}
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
      ) : papers.length === 0 ? (
        <div className="no-data">
          {userRole === 'admin'
            ? 'No research papers found.'
            : 'You have not submitted any research papers yet.'}
        </div>
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
                {userRole === 'admin' && <th>Actions</th>}
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
                    {userRole === 'admin' && editingId === paper.id ? (
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
                  {userRole === 'admin' && (
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
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="list-footer">
        Total Papers: {papers.length}
      </div>
    </div>
  );
}

export default ResearchPaperList;
