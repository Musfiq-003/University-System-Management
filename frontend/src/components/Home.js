import React from 'react';

function Home() {
  return (
    <div className="home-container">
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <h3>Total Routines</h3>
            <div className="stat-icon blue">📅</div>
          </div>
          <p className="stat-value">24</p>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <h3>Research Papers</h3>
            <div className="stat-icon purple">📚</div>
          </div>
          <p className="stat-value">156</p>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <h3>Hostel Students</h3>
            <div className="stat-icon green">🏠</div>
          </div>
          <p className="stat-value">342</p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="hero-section">
        <h1>Welcome to University Management System</h1>
        <p className="hero-subtitle">Manage your university operations efficiently and effectively</p>
      </div>

      {/* Features Grid */}
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">📅</div>
          <h3>Routine</h3>
          <p>Organize and manage class schedules with complete course details, teacher assignments, and timings.</p>
          <ul>
            <li>Add new class schedules</li>
            <li>View all routines organized by day</li>
            <li>Filter routines by specific days</li>
          </ul>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📚</div>
          <h3>Research Papers</h3>
          <p>Track research papers with comprehensive status management and department-wise categorization.</p>
          <ul>
            <li>Add and manage research papers</li>
            <li>Update publication status</li>
            <li>Track papers by department</li>
          </ul>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🏠</div>
          <h3>Hostel</h3>
          <p>Efficiently manage student hostel allocations with detailed room and building assignments.</p>
          <ul>
            <li>Register student allocations</li>
            <li>View all hostel records</li>
            <li>Search by student or hostel</li>
          </ul>
        </div>
      </div>

      {/* Getting Started Section */}
      <div className="info-section">
        <h2>Getting Started</h2>
        <div className="info-content">
          <div className="info-item">
            <span className="step-number">1</span>
            <div>
              <h4>Navigate to a Module</h4>
              <p>Use the sidebar navigation to access Routines, Research Papers, or Hostel Management</p>
            </div>
          </div>
          <div className="info-item">
            <span className="step-number">2</span>
            <div>
              <h4>Add New Records</h4>
              <p>Fill out the intuitive forms to add new routines, papers, or hostel allocations</p>
            </div>
          </div>
          <div className="info-item">
            <span className="step-number">3</span>
            <div>
              <h4>View and Manage Data</h4>
              <p>Browse records in organized tables with powerful search and filter capabilities</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
