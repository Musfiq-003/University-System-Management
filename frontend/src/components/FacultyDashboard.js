import React, { useState, useEffect } from 'react';
import './FacultyDashboard.css';

function FacultyDashboard({ user }) {
  const [stats, setStats] = useState({
    todayClasses: 3,
    totalCourses: 5,
    activeBatches: 8,
    researchPapers: 12
  });
  
  const [upcomingClasses, setUpcomingClasses] = useState([
    { time: '09:00 AM', course: 'Database Systems', batch: 'D-78A', room: 'Room 301' },
    { time: '11:30 AM', course: 'Web Development', batch: 'D-80', room: 'Room 205' },
    { time: '02:00 PM', course: 'Data Structures', batch: 'E-100', room: 'Lab 402' }
  ]);

  const [recentActivity, setRecentActivity] = useState([
    { action: 'Research paper submitted', time: '2 hours ago', icon: '📄' },
    { action: 'Routine updated for D-78A', time: '5 hours ago', icon: '📅' },
    { action: 'New student enrolled', time: '1 day ago', icon: '👨‍🎓' }
  ]);

  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="faculty-dashboard">
      {/* Welcome Header */}
      <div className="welcome-header">
        <div className="greeting-section">
          <h1>{getCurrentGreeting()}, {user?.name || 'Professor'} 👋</h1>
          <p className="subtitle">Here's what's happening with your classes today</p>
        </div>
        <div className="faculty-badge">
          <div className="badge-icon">🎓</div>
          <div className="badge-info">
            <span className="badge-role">Faculty Member</span>
            <span className="badge-dept">{user?.department || 'Computer Science'}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper blue-icon">
            <svg className="stat-icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.todayClasses}</div>
            <div className="stat-label">Classes Today</div>
          </div>
          <div className="stat-sparkline">
            <svg viewBox="0 0 50 20" preserveAspectRatio="none">
              <polyline points="0,15 10,12 20,14 30,8 40,10 50,5" fill="none" stroke="#667eea" strokeWidth="2"/>
            </svg>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon-wrapper green-icon">
            <svg className="stat-icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalCourses}</div>
            <div className="stat-label">Total Courses</div>
          </div>
          <div className="stat-sparkline">
            <svg viewBox="0 0 50 20" preserveAspectRatio="none">
              <polyline points="0,12 10,10 20,8 30,6 40,5 50,3" fill="none" stroke="#48bb78" strokeWidth="2"/>
            </svg>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon-wrapper orange-icon">
            <svg className="stat-icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.activeBatches}</div>
            <div className="stat-label">Active Batches</div>
          </div>
          <div className="stat-sparkline">
            <svg viewBox="0 0 50 20" preserveAspectRatio="none">
              <polyline points="0,18 10,16 20,15 30,13 40,12 50,10" fill="none" stroke="#ed8936" strokeWidth="2"/>
            </svg>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon-wrapper purple-icon">
            <svg className="stat-icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 2v6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.researchPapers}</div>
            <div className="stat-label">Papers Submitted</div>
          </div>
          <div className="stat-sparkline">
            <svg viewBox="0 0 50 20" preserveAspectRatio="none">
              <polyline points="0,14 10,11 20,13 30,9 40,7 50,4" fill="none" stroke="#9f7aea" strokeWidth="2"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="content-grid">
        {/* Today's Schedule */}
        <div className="dashboard-card schedule-card">
          <div className="card-header">
            <h2>📅 Today's Schedule</h2>
            <span className="card-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
          </div>
          <div className="schedule-timeline">
            {upcomingClasses.map((cls, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <div className="timeline-time">{cls.time}</div>
                  <div className="timeline-details">
                    <h3>{cls.course}</h3>
                    <div className="timeline-meta">
                      <span className="batch-tag">{cls.batch}</span>
                      <span className="room-tag">📍 {cls.room}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="view-full-schedule">View Full Schedule →</button>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card quick-actions-card">
          <div className="card-header">
            <h2>⚡ Quick Actions</h2>
          </div>
          <div className="quick-actions-grid">
            <button className="action-btn primary">
              <span className="action-icon">📝</span>
              <span className="action-text">Submit Research</span>
            </button>
            <button className="action-btn secondary">
              <span className="action-icon">📅</span>
              <span className="action-text">View Routines</span>
            </button>
            <button className="action-btn success">
              <span className="action-icon">👨‍🎓</span>
              <span className="action-text">My Students</span>
            </button>
            <button className="action-btn info">
              <span className="action-icon">📊</span>
              <span className="action-text">Reports</span>
            </button>
            <button className="action-btn warning">
              <span className="action-icon">📧</span>
              <span className="action-text">Messages</span>
            </button>
            <button className="action-btn dark">
              <span className="action-icon">⚙️</span>
              <span className="action-text">Settings</span>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-card activity-card">
          <div className="card-header">
            <h2>🔔 Recent Activity</h2>
          </div>
          <div className="activity-list">
            {recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">{activity.icon}</div>
                <div className="activity-details">
                  <p className="activity-action">{activity.action}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Research Overview */}
        <div className="dashboard-card research-card">
          <div className="card-header">
            <h2>🔬 Research Overview</h2>
          </div>
          <div className="research-stats">
            <div className="research-stat-item">
              <div className="research-circle published">
                <span className="research-number">8</span>
              </div>
              <span className="research-label">Published</span>
            </div>
            <div className="research-stat-item">
              <div className="research-circle review">
                <span className="research-number">2</span>
              </div>
              <span className="research-label">Under Review</span>
            </div>
            <div className="research-stat-item">
              <div className="research-circle draft">
                <span className="research-number">2</span>
              </div>
              <span className="research-label">Draft</span>
            </div>
          </div>
          <div className="research-progress">
            <div className="progress-label">
              <span>Publications This Year</span>
              <span className="progress-value">5/8</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '62.5%' }}></div>
            </div>
          </div>
        </div>

        {/* Department Info */}
        <div className="dashboard-card department-card">
          <div className="card-header">
            <h2>🏛️ Department Info</h2>
          </div>
          <div className="department-info">
            <div className="info-row">
              <span className="info-label">Department</span>
              <span className="info-value">{user?.department || 'Computer Science & Engineering'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Designation</span>
              <span className="info-value">{user?.designation || 'Assistant Professor'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Office</span>
              <span className="info-value">Room 405, Block B</span>
            </div>
            <div className="info-row">
              <span className="info-label">Office Hours</span>
              <span className="info-value">Mon-Fri, 10:00 AM - 4:00 PM</span>
            </div>
          </div>
        </div>

        {/* Academic Calendar */}
        <div className="dashboard-card calendar-card">
          <div className="card-header">
            <h2>📆 Upcoming Events</h2>
          </div>
          <div className="calendar-events">
            <div className="calendar-event">
              <div className="event-date">
                <span className="event-day">31</span>
                <span className="event-month">DEC</span>
              </div>
              <div className="event-details">
                <h4>Faculty Meeting</h4>
                <p>Department Review Session</p>
              </div>
            </div>
            <div className="calendar-event">
              <div className="event-date">
                <span className="event-day">05</span>
                <span className="event-month">JAN</span>
              </div>
              <div className="event-details">
                <h4>Exam Schedule</h4>
                <p>Final Examinations Begin</p>
              </div>
            </div>
            <div className="calendar-event">
              <div className="event-date">
                <span className="event-day">15</span>
                <span className="event-month">JAN</span>
              </div>
              <div className="event-details">
                <h4>Research Seminar</h4>
                <p>AI & Machine Learning Workshop</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FacultyDashboard;
