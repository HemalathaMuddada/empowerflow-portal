import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { speakText, getTimeBasedGreeting, speakLogoutMessage } from '../../utils/speech';
import ThemeSwitcher from '../../components/ThemeSwitcher';
import SystemOverviewWidget from '../../components/superAdminDashboard/SystemOverviewWidget';
import ActiveCompaniesWidget from '../../components/superAdminDashboard/ActiveCompaniesWidget';
import './Dashboard.css'; // Common dashboard styles
import './SuperAdminDashboard.css'; // For specific styles

function SuperAdminDashboard() {
  const [userName, setUserName] = useState('Super Admin');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    let currentUserName = 'Super Admin'; // Default

    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        // A real app would have robust role checking; here we simulate it
        // For testing, assume 'loggedInUser' might have a 'roles' array or similar
        if (userData && userData.name) { // && userData.roles && userData.roles.includes('SUPER_ADMIN')) {
          currentUserName = userData.name;
        } else {
          // Optional: Redirect if not super admin (for testing, we might allow it)
          // console.warn("User is not designated as Super Admin. Allowing access for now.");
        }
      } catch (e) {
        console.error("Failed to parse user data from localStorage", e);
        // Potentially redirect to login if parsing fails
        // navigate('/login');
        // return;
      }
    } else {
      // No user logged in, redirect to login
      // navigate('/login');
      // return; // Important to prevent further execution
      console.warn("No user logged in. Super Admin Dashboard accessible for dev purposes.");
    }
    setUserName(currentUserName);

    const greeting = getTimeBasedGreeting();
    speakText(`${greeting} ${currentUserName}. Welcome to the Super Admin Dashboard.`);

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [navigate]); // Added navigate to dependency array

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
    <div className="dashboard-container superadmin-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-and-title">
            <h1>EmpowerFlow</h1>
            <p>Super Admin Dashboard</p>
          </div>
          <div className="header-actions">
            <ThemeSwitcher />
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
        </div>
      </header>
      <div className="superadmin-main-layout">
        <nav className="superadmin-sidebar-nav dashboard-card">
          <h3>Super Admin Menu</h3>
          <ul>
            <li><Link to="/dashboard/superadmin/manage-companies" className="nav-link">Company Management</Link></li>
            <li><Link to="/dashboard/superadmin/global-users" className="nav-link">Global User Directory</Link></li>
            <li><Link to="#" className="nav-link-placeholder">Global Settings (TBD)</Link></li>
          </ul>
          <hr />
          <h4>Access Other Portals</h4>
          <ul>
            <li><Link to="/dashboard/employee" className="nav-link">Employee Portal</Link></li>
            <li><Link to="/dashboard/lead" className="nav-link">Lead Portal</Link></li>
            <li><Link to="/dashboard/hr" className="nav-link">HR Portal</Link></li>
            <li><Link to="/dashboard/manager" className="nav-link">Manager Portal</Link></li>
          </ul>
        </nav>
        <main className="superadmin-content-area dashboard-card">
          <div className="dashboard-greeting">
            <h2>Welcome, {userName}!</h2>
            <p>This is the central hub for system-wide configuration and oversight. Select an option from the menu to proceed.</p>
          </div>
          <section className="superadmin-widgets-section">
            <h4>Dashboard Overview & Widgets</h4>
            <div className="widgets-grid">
                <SystemOverviewWidget />
                <ActiveCompaniesWidget />
            </div>
          </section>
        </main>
      </div>
      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} EmpowerFlow Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default SuperAdminDashboard;
