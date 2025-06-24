import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Added Link here
import { speakText, getTimeBasedGreeting, speakLogoutMessage } from '../../utils/speech';
import ThemeSwitcher from '../../components/ThemeSwitcher';
import TeamQuickSummaryWidget from '../../components/managerDashboard/TeamQuickSummaryWidget'; // Import widget
import ManagerTasksWidget from '../../components/managerDashboard/ManagerTasksWidget'; // Import widget
import './Dashboard.css'; // Common dashboard styles
import './ManagerDashboard.css'; // Specific styles for Manager Dashboard if needed

function ManagerDashboard() {
  const [userName, setUserName] = useState('Manager');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    let currentUserName = 'Manager';

    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        if (userData && userData.name) {
          currentUserName = userData.name;
        }
      } catch (e) {
        console.error("Failed to parse user data from localStorage", e);
      }
    }
    setUserName(currentUserName);

    const greeting = getTimeBasedGreeting();
    if (storedUser) {
        const welcomeMessage = `${greeting} ${currentUserName}, you have successfully logged into the portal. Welcome to your Manager Dashboard.`;
        speakText(welcomeMessage);
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleLogout = () => {
    const storedUserForLogout = localStorage.getItem('loggedInUser');
    let currentUserNameForLogout = 'User';
    if (storedUserForLogout) {
      try {
        const userData = JSON.parse(storedUserForLogout);
        currentUserNameForLogout = userData.name || currentUserNameForLogout;
      } catch (e) { /* ignore */ }
    }
    speakLogoutMessage(currentUserNameForLogout);
    localStorage.removeItem('loggedInUser');
    navigate('/login');
  };

  return (
    <div className="dashboard-container manager-dashboard"> {/* Added manager-dashboard class for specific styling if needed */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-and-title">
            <h1>EmpowerFlow</h1>
            <p>Manager Dashboard</p>
          </div>
          <div className="header-actions">
            <ThemeSwitcher />
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
        </div>
      </header>
      <main className="dashboard-main-content-area"> {/* Changed class for clarity */}
        <div className="dashboard-greeting">
          <h2>Welcome, {userName}!</h2>
          <p>Oversee operations, manage your teams, and access company-wide insights.</p>
        </div>

        {/* Navigation Section */}
        <nav className="manager-dashboard-nav dashboard-card"> {/* Added dashboard-card for styling */}
          <h3>Portal Navigation</h3>
          <div className="nav-section">
            <h4>My Personal Tools (Employee View)</h4>
            <ul>
              <li><Link to="/dashboard/employee/leave" className="nav-link">Leave Management</Link></li>
              <li><Link to="/dashboard/employee/payslips" className="nav-link">My Payslips</Link></li>
              <li><Link to="/dashboard/employee/attendance" className="nav-link">My Attendance</Link></li>
              <li><Link to="/dashboard/employee/tasks" className="nav-link">My Tasks</Link></li>
              <li><Link to="/dashboard/employee/documents" className="nav-link">Document Center</Link></li>
              <li><Link to="/dashboard/employee/declarations" className="nav-link">My Declarations</Link></li>
              {/* Add other relevant employee links here */}
            </ul>
          </div>
          <div className="nav-section">
            <h4>Managerial Functions</h4>
            <ul>
              {/* Future links to manager specific pages */}
              <li><span className="nav-link-placeholder">View Company Roster (coming soon)</span></li>
              <li><span className="nav-link-placeholder">Manage HR Users (coming soon)</span></li>
              <li><span className="nav-link-placeholder">Upload Hike Documents (coming soon)</span></li>
            </ul>
          </div>
        </nav>

        {/* Widgets Section (will be populated in a future step) */}
        <section className="manager-widgets-section">
          <h3>Key Insights & Widgets</h3>
          <div className="widgets-grid">
            <TeamQuickSummaryWidget />
            <ManagerTasksWidget />
            {/* Add more manager-specific widgets here as they are developed */}
          </div>
        </section>

        {/* Main Content / Placeholder for future views managed by this dashboard */}
        {/* This section might be removed or repurposed if manager functions are always separate pages */}
        <section className="manager-main-view dashboard-card">
          <h3>Manager Dashboard Overview</h3>
          <p>Welcome to your central hub for management tasks and insights. Use the navigation links to access various tools and reports.</p>
          <p>Future updates will populate this dashboard with more interactive widgets and direct access to key managerial functions.</p>
        </section>

      </main>
      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} EmpowerFlow Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default ManagerDashboard;
