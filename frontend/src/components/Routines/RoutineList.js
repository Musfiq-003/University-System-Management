import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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

  const downloadPDF = (routine) => {
    const doc = new jsPDF();
    
    // DIU Header with Logo placeholder
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 51, 102);
    doc.text('DAFFODIL INTERNATIONAL UNIVERSITY', 105, 15, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Class Routine', 105, 25, { align: 'center' });
    
    // Horizontal line
    doc.setLineWidth(0.5);
    doc.line(14, 28, 196, 28);
    
    // Basic Information Box
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    let yPos = 38;
    
    // Left column
    doc.text(`Department: `, 14, yPos);
    doc.setFont(undefined, 'normal');
    doc.text(routine.department || 'N/A', 45, yPos);
    
    doc.setFont(undefined, 'bold');
    doc.text(`Batch: `, 14, yPos + 6);
    doc.setFont(undefined, 'normal');
    doc.text(routine.batch || 'N/A', 45, yPos + 6);
    
    doc.setFont(undefined, 'bold');
    doc.text(`Semester: `, 14, yPos + 12);
    doc.setFont(undefined, 'normal');
    doc.text(routine.semester || 'N/A', 45, yPos + 12);
    
    // Right column
    doc.setFont(undefined, 'bold');
    doc.text(`Shift: `, 120, yPos);
    doc.setFont(undefined, 'normal');
    doc.text(routine.shift || 'N/A', 140, yPos);
    
    doc.setFont(undefined, 'bold');
    doc.text(`Room: `, 120, yPos + 6);
    doc.setFont(undefined, 'normal');
    doc.text(routine.room_number || 'N/A', 140, yPos + 6);
    
    doc.setFont(undefined, 'bold');
    doc.text(`Students: `, 120, yPos + 12);
    doc.setFont(undefined, 'normal');
    doc.text(String(routine.students_count || 'N/A'), 140, yPos + 12);
    
    yPos += 20;
    
    // Counselor Info
    if (routine.counselor_name) {
      doc.setFont(undefined, 'bold');
      doc.text(`Counselor: `, 14, yPos);
      doc.setFont(undefined, 'normal');
      doc.text(`${routine.counselor_name}${routine.counselor_contact ? ' | ' + routine.counselor_contact : ''}`, 45, yPos);
      yPos += 8;
    }
    
    // Course Details Table
    if (routine.courses && routine.courses.length > 0) {
      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.text('Course Details', 14, yPos);
      yPos += 5;
      
      const courseData = routine.courses.map(course => [
        course.course_code || '',
        course.course_name || '',
        course.teacher || '',
        course.credits || '',
        course.section || ''
      ]);
      
      doc.autoTable({
        startY: yPos,
        head: [['Code', 'Course Name', 'Teacher', 'Credits', 'Section']],
        body: courseData,
        theme: 'grid',
        headStyles: {
          fillColor: [0, 51, 102],
          textColor: 255,
          fontSize: 9,
          fontStyle: 'bold',
          halign: 'center'
        },
        bodyStyles: {
          fontSize: 8,
          textColor: 50
        },
        alternateRowStyles: {
          fillColor: [240, 248, 255]
        },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 70 },
          2: { cellWidth: 50 },
          3: { cellWidth: 20 },
          4: { cellWidth: 17 }
        },
        margin: { left: 14, right: 14 }
      });
      
      yPos = doc.lastAutoTable.finalY + 10;
    }
    
    // Time Slots Table
    if (routine.time_slots && Object.keys(routine.time_slots).length > 0) {
      // Check if we need new page
      if (yPos > 200) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.text('Weekly Schedule', 14, yPos);
      yPos += 5;
      
      const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
      const timeSlotData = days.map(day => {
        const slots = routine.time_slots[day] || [];
        return [day, slots.length > 0 ? slots.join(', ') : 'No class'];
      });
      
      doc.autoTable({
        startY: yPos,
        head: [['Day', 'Time Slots']],
        body: timeSlotData,
        theme: 'grid',
        headStyles: {
          fillColor: [0, 51, 102],
          textColor: 255,
          fontSize: 9,
          fontStyle: 'bold',
          halign: 'center'
        },
        bodyStyles: {
          fontSize: 8,
          textColor: 50
        },
        alternateRowStyles: {
          fillColor: [240, 248, 255]
        },
        columnStyles: {
          0: { cellWidth: 30, fontStyle: 'bold' },
          1: { cellWidth: 152 }
        },
        margin: { left: 14, right: 14 }
      });
      
      yPos = doc.lastAutoTable.finalY + 10;
    }
    
    // Academic Year and Date info
    if (routine.academic_year || routine.effective_from) {
      if (yPos > 260) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      if (routine.academic_year) {
        doc.text(`Academic Year: ${routine.academic_year}`, 14, yPos);
        yPos += 5;
      }
      if (routine.effective_from) {
        doc.text(`Effective From: ${new Date(routine.effective_from).toLocaleDateString('en-GB')}`, 14, yPos);
      }
    }
    
    // Footer on all pages
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont(undefined, 'italic');
      doc.setTextColor(100);
      doc.text(
        `Generated: ${new Date().toLocaleDateString('en-GB')} | DIU Management System`,
        105,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
      doc.text(
        `Page ${i} of ${pageCount}`,
        196,
        doc.internal.pageSize.height - 10,
        { align: 'right' }
      );
    }
    
    // Download with intelligent filename
    const filename = `DIU_Routine_${routine.department}_${routine.batch}_${routine.semester}.pdf`;
    doc.save(filename);
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
        <div style={{ display: 'grid', gap: '20px' }}>
          {routines.map((routine) => (
            <div key={routine.id} style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(245,247,250,0.95) 100%)',
              backdropFilter: 'blur(10px)',
              borderRadius: '15px',
              padding: '25px',
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.1)',
              border: '1px solid rgba(102, 126, 234, 0.1)'
            }}>
              {/* Header Section */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                paddingBottom: '15px',
                borderBottom: '2px solid rgba(102, 126, 234, 0.2)'
              }}>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', color: '#667eea', fontSize: '20px' }}>
                    {routine.department} - Batch {routine.batch}
                  </h3>
                  <div style={{ display: 'flex', gap: '15px', fontSize: '14px', color: '#666' }}>
                    <span>📅 {routine.semester}</span>
                    <span>🕐 {routine.shift} Shift</span>
                    {routine.room_number && <span>🚪 Room {routine.room_number}</span>}
                    {routine.students_count && <span>👥 {routine.students_count} Students</span>}
                  </div>
                </div>
                <button
                  onClick={() => downloadPDF(routine)}
                  style={{
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                  }}
                >
                  📥 Download PDF
                </button>
              </div>

              {/* Counselor Info */}
              {routine.counselor_name && (
                <div style={{
                  background: 'rgba(102, 126, 234, 0.05)',
                  padding: '12px 15px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  fontSize: '14px'
                }}>
                  <strong style={{ color: '#667eea' }}>👤 Counselor:</strong> {routine.counselor_name}
                  {routine.counselor_contact && ` | 📞 ${routine.counselor_contact}`}
                </div>
              )}

              {/* Courses Table */}
              {routine.courses && routine.courses.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#667eea', fontSize: '16px' }}>📚 Courses</h4>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      fontSize: '13px'
                    }}>
                      <thead>
                        <tr style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                          <th style={{ padding: '12px', textAlign: 'left', borderRadius: '8px 0 0 0' }}>Code</th>
                          <th style={{ padding: '12px', textAlign: 'left' }}>Course Name</th>
                          <th style={{ padding: '12px', textAlign: 'left' }}>Teacher</th>
                          <th style={{ padding: '12px', textAlign: 'center' }}>Credits</th>
                          <th style={{ padding: '12px', textAlign: 'center', borderRadius: '0 8px 0 0' }}>Section</th>
                        </tr>
                      </thead>
                      <tbody>
                        {routine.courses.map((course, idx) => (
                          <tr key={idx} style={{
                            background: idx % 2 === 0 ? 'rgba(102, 126, 234, 0.02)' : 'transparent',
                            borderBottom: '1px solid rgba(102, 126, 234, 0.1)'
                          }}>
                            <td style={{ padding: '10px', fontWeight: '600', color: '#667eea' }}>{course.course_code}</td>
                            <td style={{ padding: '10px' }}>{course.course_name}</td>
                            <td style={{ padding: '10px' }}>{course.teacher}</td>
                            <td style={{ padding: '10px', textAlign: 'center' }}>{course.credits || '-'}</td>
                            <td style={{ padding: '10px', textAlign: 'center' }}>{course.section || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Time Slots */}
              {routine.time_slots && Object.keys(routine.time_slots).length > 0 && (
                <div>
                  <h4 style={{ margin: '0 0 10px 0', color: '#667eea', fontSize: '16px' }}>🕐 Weekly Schedule</h4>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'].map(day => {
                      const slots = routine.time_slots[day] || [];
                      return (
                        <div key={day} style={{
                          display: 'flex',
                          gap: '15px',
                          padding: '10px 15px',
                          background: slots.length > 0 ? 'rgba(102, 126, 234, 0.05)' : 'rgba(200, 200, 200, 0.05)',
                          borderRadius: '6px',
                          fontSize: '13px'
                        }}>
                          <div style={{ fontWeight: '600', width: '80px', color: '#667eea' }}>{day}</div>
                          <div style={{ flex: 1, color: slots.length > 0 ? '#333' : '#999' }}>
                            {slots.length > 0 ? slots.join(' | ') : 'No class'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Footer Info */}
              {(routine.academic_year || routine.effective_from) && (
                <div style={{
                  marginTop: '20px',
                  paddingTop: '15px',
                  borderTop: '1px solid rgba(102, 126, 234, 0.1)',
                  fontSize: '12px',
                  color: '#666',
                  display: 'flex',
                  gap: '20px'
                }}>
                  {routine.academic_year && <span>📖 Academic Year: {routine.academic_year}</span>}
                  {routine.effective_from && <span>📅 Effective From: {new Date(routine.effective_from).toLocaleDateString('en-GB')}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      <div className="list-footer">
        Total Routines: {routines.length}
      </div>
    </div>
  );
}

export default RoutineList;
