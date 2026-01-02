import React, { useState, useEffect } from 'react';

function RoutineList({ userRole }) {
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [filterBatch, setFilterBatch] = useState('All');

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
    if (filterDepartment === 'All') {
      return ['All'];
    }
    return ['All', ...departmentBatchData[filterDepartment]];
  };

  // Handle department change
  const handleDepartmentChange = (dept) => {
    setFilterDepartment(dept);
    setFilterBatch('All'); // Reset batch when department changes
  };

  const fetchRoutines = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/routines');
      const data = await response.json();

      if (data.success) {
        let filteredRoutines = data.data;
        
        // Filter by department if selected
        if (filterDepartment !== 'All') {
          filteredRoutines = filteredRoutines.filter(routine => routine.department === filterDepartment);
        }
        
        // Filter by batch if selected
        if (filterBatch !== 'All') {
          filteredRoutines = filteredRoutines.filter(routine => routine.batch === filterBatch);
        }
        
        setRoutines(filteredRoutines);
      } else {
        setError('Failed to fetch routines');
      }
    } catch (error) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutines();
    // Listen for routine added event
    window.addEventListener('routineAdded', fetchRoutines);
    return () => window.removeEventListener('routineAdded', fetchRoutines);
  }, [filterDepartment, filterBatch]);

  const formatTime = (time) => {
    if (!time) return '';
    return time.substring(0, 5); // Format HH:MM:SS to HH:MM
  };

  return (
    <div className="list-container">
      <div className="list-header">
        <h2>Class Routines</h2>
        <div className="filter-group" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div>
            <label style={{ marginRight: '10px' }}>Department:</label>
            <select 
              value={filterDepartment} 
              onChange={(e) => handleDepartmentChange(e.target.value)}
              style={{ minWidth: '200px' }}
            >
              <option value="All">All Departments</option>
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
          <div>
            <label style={{ marginRight: '10px' }}>Batch:</label>
            <select 
              value={filterBatch} 
              onChange={(e) => setFilterBatch(e.target.value)}
              disabled={filterDepartment === 'All'}
              style={{ minWidth: '150px' }}
            >
              {getBatchOptions().map(batch => (
                <option key={batch} value={batch}>{batch}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading routines...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : routines.length === 0 ? (
        <div className="no-data">No routines found. Add your first routine above!</div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Teacher</th>
                <th>Department</th>
                <th>Batch</th>
                <th>Start Time</th>
                <th>End Time</th>
              </tr>
            </thead>
            <tbody>
              {routines.map((routine) => (
                <tr key={routine.id}>
                  <td>{routine.course}</td>
                  <td>{routine.teacher}</td>
                  <td><span className="badge" style={{ backgroundColor: '#007bff' }}>{routine.department}</span></td>
                  <td><span className="badge" style={{ backgroundColor: '#6c757d' }}>{routine.batch}</span></td>
                  <td>{formatTime(routine.start_time)}</td>
                  <td>{formatTime(routine.end_time)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="list-footer">
        Total Routines: {routines.length}
      </div>
    </div>
  );
}

export default RoutineList;
