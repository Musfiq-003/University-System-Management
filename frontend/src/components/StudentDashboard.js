import React, { useState, useEffect } from 'react';
import './StudentDashboard.css';

function StudentDashboard({ user }) {
  const [stats, setStats] = useState({
    todayClasses: 4,
    attendance: 92,
    hostelStatus: 'Allocated',
    papers: 3
  });
  
  const [todaySchedule, setTodaySchedule] = useState([
    { time: '08:30 AM', course: 'Data Structures', teacher: 'Dr. Ahmed Khan', room: 'Lab 301', status: 'upcoming' },
    { time: '10:30 AM', course: 'Database Systems', teacher: 'Prof. Sarah Ahmed', room: 'Room 205', status: 'upcoming' },
    { time: '01:00 PM', course: 'Web Development', teacher: 'Dr. Kamal Hossain', room: 'Lab 402', status: 'upcoming' },
    { time: '03:00 PM', course: 'Operating Systems', teacher: 'Prof. Rita Begum', room: 'Room 310', status: 'upcoming' }
  ]);

  const [assignments, setAssignments] = useState([
    { title: 'Database Project', course: 'Database Systems', dueDate: 'Jan 5, 2025', priority: 'high' },
    { title: 'Algorithm Analysis', course: 'Data Structures', dueDate: 'Jan 8, 2025', priority: 'medium' },
    { title: 'Web Portfolio', course: 'Web Development', dueDate: 'Jan 12, 2025', priority: 'low' }
  ]);

  const [notifications, setNotifications] = useState([
    { type: 'exam', message: 'Final exams start in 7 days', time: '1 hour ago', icon: '📝' },
    { type: 'routine', message: 'Tomorrow\'s routine updated', time: '3 hours ago', icon: '📅' },
    { type: 'hostel', message: 'Hostel fee payment reminder', time: '5 hours ago', icon: '🏠' }
  ]);

  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getNextClass = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    for (let cls of todaySchedule) {
      const [time, period] = cls.time.split(' ');
      const [hours, minutes] = time.split(':');
      let classTime = parseInt(hours) * 60 + parseInt(minutes);
      if (period === 'PM' && parseInt(hours) !== 12) classTime += 720;
      
      if (classTime > currentTime) {
        return cls;
      }
    }
    return null;
  };

  const nextClass = getNextClass();

  return (
    <div className="student-dashboard">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>{getCurrentGreeting()}, {user?.name || 'Student'} 🎓</h1>
          <p className="hero-subtitle">Ready to conquer your day? Let's make it productive!</p>
          <div className="student-meta">
            <span className="meta-item">📚 Batch: {user?.batch || 'D-78A'}</span>
            <span className="meta-item">🏛️ {user?.department || 'Computer Science & Engineering'}</span>
            <span className="meta-item">🆔 ID: {user?.studentId || 'CS2024001'}</span>
          </div>
        </div>
        <div className="hero-illustration">
          <div className="floating-card card-1">📚</div>
          <div className="floating-card card-2">✨</div>
          <div className="floating-card card-3">🎯</div>
        </div>
      </div>

      {/* Next Class Highlight */}
      {nextClass && (
        <div className="next-class-banner">
          <div className="next-class-content">
            <div className="next-class-badge">UP NEXT</div>
            <h2>⏰ {nextClass.course}</h2>
            <div className="next-class-details">
              <span>👨‍🏫 {nextClass.teacher}</span>
              <span>📍 {nextClass.room}</span>
              <span>🕐 {nextClass.time}</span>
            </div>
          </div>
          <button className="join-class-btn">Join Class →</button>
        </div>
      )}

      {/* Stats Overview */}
      <div className="stats-overview">
        <div className="stat-box blue-gradient">
          <div className="stat-icon-large">📚</div>
          <div className="stat-info">
            <div className="stat-number">{stats.todayClasses}</div>
            <div className="stat-text">Classes Today</div>
          </div>
          <div className="stat-sparkline">▁▃▄▇█</div>
        </div>
        
        <div className="stat-box green-gradient">
          <div className="stat-icon-large">✅</div>
          <div className="stat-info">
            <div className="stat-number">{stats.attendance}%</div>
            <div className="stat-text">Attendance</div>
          </div>
          <div className="stat-sparkline">▃▅▆▇█</div>
        </div>
        
        <div className="stat-box purple-gradient">
          <div className="stat-icon-large">🏠</div>
          <div className="stat-info">
            <div className="stat-number">{stats.hostelStatus}</div>
            <div className="stat-text">Hostel Status</div>
          </div>
          <div className="stat-sparkline">█▇▆▅▃</div>
        </div>
        
        <div className="stat-box orange-gradient">
          <div className="stat-icon-large">📄</div>
          <div className="stat-info">
            <div className="stat-number">{stats.papers}</div>
            <div className="stat-text">Papers Submitted</div>
          </div>
          <div className="stat-sparkline">▂▄▆▇█</div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Today's Schedule */}
        <div className="dashboard-widget schedule-widget">
          <div className="widget-header">
            <h2>📅 Today's Schedule</h2>
            <span className="widget-badge">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          </div>
          <div className="schedule-list">
            {todaySchedule.map((cls, index) => (
              <div key={index} className="schedule-item">
                <div className="schedule-time-badge">{cls.time}</div>
                <div className="schedule-details">
                  <h4>{cls.course}</h4>
                  <p>👨‍🏫 {cls.teacher}</p>
                  <span className="schedule-room">📍 {cls.room}</span>
                </div>
                <div className="schedule-status">
                  <span className="status-dot"></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assignments & Deadlines */}
        <div className="dashboard-widget assignments-widget">
          <div className="widget-header">
            <h2>📝 Pending Assignments</h2>
            <span className="widget-badge">{assignments.length} Due</span>
          </div>
          <div className="assignments-list">
            {assignments.map((assignment, index) => (
              <div key={index} className={`assignment-item priority-${assignment.priority}`}>
                <div className="assignment-priority">
                  {assignment.priority === 'high' && '🔴'}
                  {assignment.priority === 'medium' && '🟡'}
                  {assignment.priority === 'low' && '🟢'}
                </div>
                <div className="assignment-content">
                  <h4>{assignment.title}</h4>
                  <p className="assignment-course">{assignment.course}</p>
                  <div className="assignment-footer">
                    <span className="due-date">📅 Due: {assignment.dueDate}</span>
                    <button className="submit-btn">Submit</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="view-all-btn">View All Assignments →</button>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-widget actions-widget">
          <div className="widget-header">
            <h2>⚡ Quick Actions</h2>
          </div>
          <div className="actions-grid">
            <button className="quick-action-card blue">
              <div className="action-icon">📅</div>
              <span>View Routine</span>
            </button>
            <button className="quick-action-card green">
              <div className="action-icon">🏠</div>
              <span>Hostel Request</span>
            </button>
            <button className="quick-action-card purple">
              <div className="action-icon">📄</div>
              <span>Submit Paper</span>
            </button>
            <button className="quick-action-card orange">
              <div className="action-icon">👨‍🏫</div>
              <span>Faculty List</span>
            </button>
            <button className="quick-action-card red">
              <div className="action-icon">📊</div>
              <span>My Progress</span>
            </button>
            <button className="quick-action-card teal">
              <div class="action-icon">💬</div>
              <span>Messages</span>
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="dashboard-widget notifications-widget">
          <div className="widget-header">
            <h2>🔔 Notifications</h2>
            <button className="mark-read-btn">Mark all as read</button>
          </div>
          <div className="notifications-list">
            {notifications.map((notif, index) => (
              <div key={index} className="notification-item">
                <div className="notification-icon">{notif.icon}</div>
                <div className="notification-content">
                  <p className="notification-message">{notif.message}</p>
                  <span className="notification-time">{notif.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Academic Progress */}
        <div className="dashboard-widget progress-widget">
          <div className="widget-header">
            <h2>📊 Academic Progress</h2>
          </div>
          <div className="progress-content">
            <div className="cgpa-circle">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="8"/>
                <circle cx="50" cy="50" r="45" fill="none" stroke="url(#gradient)" strokeWidth="8" 
                  strokeDasharray="282.7" strokeDashoffset="70.675" strokeLinecap="round"
                  transform="rotate(-90 50 50)"/>
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#667eea"/>
                    <stop offset="100%" stopColor="#764ba2"/>
                  </linearGradient>
                </defs>
              </svg>
              <div className="cgpa-text">
                <div className="cgpa-value">3.75</div>
                <div className="cgpa-label">CGPA</div>
              </div>
            </div>
            <div className="semester-info">
              <div className="info-item">
                <span className="info-label">Current Semester</span>
                <span className="info-value">7th Semester</span>
              </div>
              <div className="info-item">
                <span className="info-label">Credits Completed</span>
                <span className="info-value">108 / 145</span>
              </div>
              <div className="info-item">
                <span className="info-label">Current Courses</span>
                <span className="info-value">6 Courses</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hostel Info */}
        <div className="dashboard-widget hostel-widget">
          <div className="widget-header">
            <h2>🏠 Hostel Information</h2>
          </div>
          <div className="hostel-card">
            <div className="hostel-image">
              <div className="hostel-badge">Allocated</div>
            </div>
            <div className="hostel-details">
              <div className="hostel-detail-row">
                <span className="detail-label">Building</span>
                <span className="detail-value">North Hall</span>
              </div>
              <div className="hostel-detail-row">
                <span className="detail-label">Room Number</span>
                <span className="detail-value">405-B</span>
              </div>
              <div className="hostel-detail-row">
                <span className="detail-label">Floor</span>
                <span className="detail-value">4th Floor</span>
              </div>
              <div className="hostel-detail-row">
                <span className="detail-label">Roommate</span>
                <span className="detail-value">Ahmed Hassan</span>
              </div>
            </div>
            <button className="hostel-action-btn">View Details →</button>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="dashboard-widget events-widget">
          <div className="widget-header">
            <h2>📆 Upcoming Events</h2>
          </div>
          <div className="events-timeline">
            <div className="event-card">
              <div className="event-date-badge">
                <span className="event-day">05</span>
                <span className="event-month">JAN</span>
              </div>
              <div className="event-info">
                <h4>Final Examinations</h4>
                <p>Semester exams begin</p>
                <span className="event-countdown">⏱️ In 6 days</span>
              </div>
            </div>
            <div className="event-card">
              <div className="event-date-badge purple">
                <span className="event-day">12</span>
                <span className="event-month">JAN</span>
              </div>
              <div className="event-info">
                <h4>Project Presentation</h4>
                <p>Final year project demo</p>
                <span className="event-countdown">⏱️ In 13 days</span>
              </div>
            </div>
            <div className="event-card">
              <div className="event-date-badge green">
                <span className="event-day">20</span>
                <span className="event-month">JAN</span>
              </div>
              <div className="event-info">
                <h4>Result Publication</h4>
                <p>Semester results out</p>
                <span className="event-countdown">⏱️ In 21 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
