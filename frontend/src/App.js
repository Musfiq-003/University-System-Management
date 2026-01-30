import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import './App.css';

// Import components
import AddRoutine from './components/Routines/AddRoutine';
import RoutineList from './components/Routines/RoutineList';
import AddResearchPaper from './components/ResearchPapers/AddResearchPaper';
import ResearchPaperList from './components/ResearchPapers/ResearchPaperList';
import AddHostelStudent from './components/Hostel/AddHostelStudent';
import HostelList from './components/Hostel/HostelList';
import Home from './components/Home';
import FacultyDashboard from './components/FacultyDashboard';
import StudentDashboard from './components/StudentDashboard';

// Import authentication components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import VerifyOTP from './components/Auth/VerifyOTP';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';
import UserManagement from './components/UserManagement';
import Teachers from './components/Teachers/Teachers';

// Main App Layout Component (with sidebar)
function AppLayout() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Load user info on mount
  useEffect(() => {
    const userInfo = localStorage.getItem('user_info');
    if (userInfo) {
      try {
        setUser(JSON.parse(userInfo));
      } catch (error) {
        console.error('Error parsing user info:', error);
      }
    }
  }, []);
  
  // Update active tab based on route
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setActiveTab('home');
    else if (path === '/routines') setActiveTab('routines');
    else if (path.includes('research')) setActiveTab('research');
    else if (path === '/hostel') setActiveTab('hostel');
  }, [location]);
  
  // Handle logout
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_info');
      navigate('/login');
    }
  };

  return (
    <div className="App">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">🎓</div>
            <div>
              <h2>University</h2>
              <p>Management System</p>
            </div>
          </div>
        </div>
        
        {/* User Profile Section */}
        {user && (
          <div className="user-profile">
            <div className="user-avatar-large">
              {user.full_name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="user-details">
              <h3>{user.full_name}</h3>
              <span className={`user-role role-${user.role}`}>{user.role}</span>
            </div>
          </div>
        )}
        
        <ul className="nav-menu">
          <li className={activeTab === 'home' ? 'active' : ''}>
            <Link to="/" onClick={() => setActiveTab('home')}>
              <span className="nav-icon">🏠</span>
              <span>Home</span>
            </Link>
          </li>
          <li className={activeTab === 'routines' ? 'active' : ''}>
            <Link to="/routines" onClick={() => setActiveTab('routines')}>
              <span className="nav-icon">📅</span>
              <span>Routines</span>
            </Link>
          </li>
          <li className={activeTab === 'research' ? 'active' : ''}>
            <Link to="/research-papers" onClick={() => setActiveTab('research')}>
              <span className="nav-icon">📚</span>
              <span>Research Papers</span>
            </Link>
          </li>
          {/* Only show Hostel for students and admin, not faculty */}
          {user && user.role !== 'faculty' && (
            <li className={activeTab === 'hostel' ? 'active' : ''}>
              <Link to="/hostel" onClick={() => setActiveTab('hostel')}>
                <span className="nav-icon">🏢</span>
                <span>Hostel</span>
              </Link>
            </li>
          )}
          <li className={activeTab === 'teachers' ? 'active' : ''}>
            <Link to="/teachers" onClick={() => setActiveTab('teachers')}>
              <span className="nav-icon">👨‍🏫</span>
              <span>Faculty</span>
            </Link>
          </li>
          {user && user.role === 'admin' && (
            <li className={activeTab === 'users' ? 'active' : ''}>
              <Link to="/users" onClick={() => setActiveTab('users')}>
                <span className="nav-icon">👥</span>
                <span>User Management</span>
              </Link>
            </li>
          )}
        </ul>
        
        {/* Logout Button */}
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <span className="nav-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-wrapper">
        <div className="top-bar">
          <h1 className="page-title">
            {activeTab === 'home' && 'Dashboard'}
            {activeTab === 'routines' && 'Routine'}
            {activeTab === 'research' && 'Research Papers'}
            {activeTab === 'hostel' && user?.role !== 'faculty' && 'Hostel'}
          </h1>
          <div className="user-info">
            <div className="user-menu-wrapper">
              <div className="user-avatar" onClick={() => setShowUserMenu(!showUserMenu)}>
                {user?.full_name?.charAt(0).toUpperCase() || 'A'}
              </div>
              {showUserMenu && (
                <div className="user-dropdown-menu">
                  <div className="user-dropdown-header">
                    <div className="user-dropdown-name">{user?.full_name}</div>
                    <div className="user-dropdown-role">{user?.role}</div>
                  </div>
                  <div className="user-dropdown-divider"></div>
                  <button onClick={handleLogout} className="user-dropdown-item logout-item">
                    <span>🚪</span> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="main-content">
          <Routes>
            <Route path="/" element={
              user?.role === 'faculty' ? <FacultyDashboard user={user} /> :
              user?.role === 'student' ? <StudentDashboard user={user} /> :
              <Home />
            } />
            <Route path="/routines" element={
              <div>
                {user && user.role === 'admin' && <AddRoutine />}
                <RoutineList userRole={user?.role} />
              </div>
            } />
            <Route path="/research-papers" element={
              <div>
                <AddResearchPaper userRole={user?.role} />
                <ResearchPaperList userRole={user?.role} />
              </div>
            } />
            {/* Only allow students and admin to access hostel */}
            {user?.role !== 'faculty' && (
              <Route path="/hostel" element={
                <div>
                  <AddHostelStudent userRole={user?.role} />
                  <HostelList userRole={user?.role} />
                </div>
              } />
            )}
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/users" element={<UserManagement />} />
          </Routes>
        </div>

        {/* Footer */}
        <footer className="footer">
          <p>&copy; 2025 University Management System. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

// Main App Component with Router
function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes (No Authentication Required) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Protected Routes (Authentication Required) */}
        <Route path="/*" element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
