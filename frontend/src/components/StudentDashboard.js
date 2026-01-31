import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentDashboardV3.css';

function StudentDashboard({ user }) {
  const navigate = useNavigate();

  // --- State Management ---
  const [stats, setStats] = useState({
    todayClasses: 0,
    attendance: 0,
    hostelStatus: 'Not Allocated',
    cgpa: 3.75, // Placeholder
    creditsCompleted: 45 // Placeholder
  });

  const [accounts, setAccounts] = useState({
    payable: 55000,
    paid: 30000,
    due: 25000
  });

  const [todaySchedule, setTodaySchedule] = useState([]);
  const [nextClass, setNextClass] = useState(null);
  const [hostelData, setHostelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar toggle

  // Mock Notices -> Now Real Data
  const [notices, setNotices] = useState([]);

  // Mock Active Courses -> Now Real Data
  const [activeCourses, setActiveCourses] = useState([]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const headers = { 'Authorization': `Bearer ${token}` };

      // 1. Fetch Routines
      const routineUrl = `/api/routines?department=${encodeURIComponent(user.department)}&batch=${encodeURIComponent(user.batch)}`;
      const routineRes = await fetch(routineUrl, { headers });
      const routineData = await routineRes.json();

      let classesToday = [];
      let upcomingClass = null;
      let todaysCount = 0;

      if (routineData.success) {
        const routines = routineData.data;
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const todayName = days[new Date().getDay()];

        // Filter for today
        classesToday = routines.filter(r => r.day === todayName);
        todaysCount = classesToday.length;

        // Find next class
        const now = new Date();
        const currentTimeVal = now.getHours() * 60 + now.getMinutes();

        // Sort
        classesToday.sort((a, b) => timeToMinutes(a.start_time) - timeToMinutes(b.start_time));

        for (const cls of classesToday) {
          const classStart = timeToMinutes(cls.start_time);
          if (classStart > currentTimeVal) {
            upcomingClass = cls;
            break;
          }
        }
      }

      // 2. Fetch Hostel Data
      let hostelStatusText = 'Not Allocated';
      if (user.studentId) {
        const hostelRes = await fetch(`/api/hostel/student/${user.studentId}`, { headers });
        const hostelResponseData = await hostelRes.json();
        if (hostelResponseData.success && hostelResponseData.data) {
          setHostelData(hostelResponseData.data);
          hostelStatusText = 'Allocated';
        }
      }

      // Update State
      setTodaySchedule(classesToday);
      setNextClass(upcomingClass);
      setStats(prev => ({
        ...prev,
        todayClasses: todaysCount,
        hostelStatus: hostelStatusText
      }));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const timeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return <div className="loading-screen">Loading Portal...</div>;

  return (
    <div className="dashboard-v3-container">
      {/* --- SIDEBAR --- */}
      <aside className={`portal-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <a href="/" className="brand-logo">
            🎓 DIU Portal
          </a>
        </div>
        <nav className="sidebar-menu">
          <div onClick={() => navigate('/')} className="menu-item active" style={{ cursor: 'pointer' }}>
            <span className="menu-icon">📊</span> Dashboard
          </div>
          <div onClick={() => alert('Course Registration is currently closed.')} className="menu-item" style={{ cursor: 'pointer' }}>
            <span className="menu-icon">📝</span> Course Registration
          </div>
          <div onClick={() => navigate('/routines')} className="menu-item" style={{ cursor: 'pointer' }}>
            <span className="menu-icon">📅</span> Class Routine
          </div>
          <div onClick={() => alert('Detailed results are not available yet. Please check your CGPA in the dashboard overview.')} className="menu-item" style={{ cursor: 'pointer' }}>
            <span className="menu-icon">🏆</span> Result
          </div>
          <div onClick={() => alert('Please see the Accounts Summary card on your dashboard.')} className="menu-item" style={{ cursor: 'pointer' }}>
            <span className="menu-icon">💰</span> Accounts
          </div>
          <div onClick={() => navigate('/hostel')} className="menu-item" style={{ cursor: 'pointer' }}>
            <span className="menu-icon">🏠</span> Hostel
          </div>
          <div onClick={() => navigate('/settings')} className="menu-item" style={{ cursor: 'pointer' }}>
            <span className="menu-icon">⚙️</span> Settings
          </div>
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="portal-main">
        {/* Top Header */}
        <header className="portal-header">
          <div className="header-title">
            <h2>Student Portal</h2>
          </div>
          <div className="header-actions">
            <button className="notification-btn">
              🔔 <span className="badge-dot"></span>
            </button>
            <div className="user-profile-menu" onClick={() => navigate('/profile')}>
              <div className="user-avatar">{user?.full_name?.charAt(0) || 'U'}</div>
              <div className="user-info-text">
                <span className="user-name">{user?.full_name}</span>
                <span className="user-role">{user?.studentId}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="portal-content">

          {/* Overview Grid (Top Row) */}
          <div className="overview-grid">
            {/* CGPA Card */}
            <div className="overview-card">
              <div>
                <div className="card-label">CGPA</div>
                <div className="card-value">{stats.cgpa}</div>
                <div className="card-trend trend-up">
                  <span>📈</span> Top 15%
                </div>
              </div>
              <div style={{ fontSize: '2rem', opacity: 0.2 }}>🏆</div>
            </div>

            {/* Credits Card */}
            <div className="overview-card">
              <div>
                <div className="card-label">Credits Completed</div>
                <div className="card-value">{stats.creditsCompleted}</div>
                <div className="card-trend">
                  <span>📚</span> {activeCourses.length} Active Courses
                </div>
              </div>
              <div style={{ fontSize: '2rem', opacity: 0.2 }}>🎓</div>
            </div>

            {/* Accounts Card */}
            <div className="overview-card">
              <div>
                <div className="card-label">Accounts Info</div>
                <div className="payment-summary">
                  <div className="payment-row"><strong>Payable:</strong> <span>{accounts.payable} ৳</span></div>
                  <div className="payment-row"><strong>Paid:</strong> <span style={{ color: 'green' }}>{accounts.paid} ৳</span></div>
                  <div className="payment-row"><strong>Due:</strong> <span style={{ color: 'red' }}>{accounts.due} ৳</span></div>
                </div>
                <button className="pay-btn">Pay Now</button>
              </div>
            </div>

            {/* Hostel/Attendance Card */}
            <div className="overview-card">
              <div>
                <div className="card-label">Hostel Status</div>
                <div className="card-value" style={{ fontSize: '1.2rem' }}>{stats.hostelStatus}</div>
                <div className="card-trend">
                  {hostelData ? `Room: ${hostelData.room_number}` : 'Join a hostel today'}
                </div>
              </div>
              <div style={{ fontSize: '2rem', opacity: 0.2 }}>🏠</div>
            </div>
          </div>

          {/* Main Content Grid (66% - 33%) */}
          <div className="dashboard-main-grid">

            {/* Left Column */}
            <div className="grid-column">
              {/* Today's Schedule */}
              <div className="portal-widget">
                <div className="widget-header">
                  <h3>📅 Today's Schedule</h3>
                  <button className="widget-action" onClick={() => navigate('/routines')}>View Full Routine</button>
                </div>
                <div className="widget-body">
                  {todaySchedule.length > 0 ? (
                    todaySchedule.map((cls, idx) => (
                      <div key={idx} className="notice-item">
                        <div className="notice-date">
                          <span className="notice-day" style={{ fontSize: '1rem' }}>{formatTime(cls.start_time)}</span>
                        </div>
                        <div className="notice-content">
                          <h4>{cls.course}</h4>
                          <p>Teacher: {cls.teacher} | Room: {cls.room_number}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: '#666', textAlign: 'center' }}>No classes scheduled for today.</p>
                  )}
                </div>
              </div>

              {/* Active Courses */}
              <div className="portal-widget">
                <div className="widget-header">
                  <h3>📚 Current Semester Courses</h3>
                </div>
                <div className="widget-body">
                  {activeCourses.map((course, idx) => (
                    <div key={idx} className="course-list-item">
                      <div className="course-info">
                        <h5>{course.title}</h5>
                        <span>{course.code}</span>
                      </div>
                      <div className="course-credit">{course.credit} Cr.</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="grid-column">
              {/* Profile Snippet */}
              <div className="portal-widget">
                <div className="widget-body">
                  <div className="profile-snippet">
                    <div className="large-avatar">{user?.full_name?.charAt(0)}</div>
                    <h3>{user?.full_name}</h3>
                    <p style={{ color: '#666' }}>{user?.email}</p>
                  </div>
                  <div className="profile-meta-grid">
                    <div className="meta-box">
                      <small>Program</small>
                      <span>{user?.department?.split(' ')[0] || 'N/A'}</span>
                    </div>
                    <div className="meta-box">
                      <small>Batch</small>
                      <span>{user?.batch || 'N/A'}</span>
                    </div>
                    <div className="meta-box">
                      <small>ID</small>
                      <span>{user?.studentId || 'N/A'}</span>
                    </div>
                    <div className="meta-box">
                      <small>Status</small>
                      <span style={{ color: 'green' }}>Active</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notices */}
              <div className="portal-widget">
                <div className="widget-header">
                  <h3>📢 Notice Board</h3>
                </div>
                <div className="widget-body">
                  {notices.map((notice) => (
                    <div key={notice.id} className="notice-item">
                      <div className="notice-date">
                        <span className="notice-day">{notice.date}</span>
                        <span className="notice-month">{notice.month}</span>
                      </div>
                      <div className="notice-content">
                        <h4>{notice.title}</h4>
                        <p>{notice.content}</p>
                      </div>
                    </div>
                  ))}
                  <button className="pay-btn" style={{ marginTop: '1.5rem', background: 'transparent', border: '1px solid #ddd', color: '#666' }}>View All Notices</button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default StudentDashboard;
