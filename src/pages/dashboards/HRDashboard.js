import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { speakText, getTimeBasedGreeting, speakLogoutMessage } from '../../utils/speech';
import ThemeSwitcher from '../../components/ThemeSwitcher';
import VoiceToggleSwitch from '../../components/VoiceToggleSwitch'; // Import
import './Dashboard.css';
import './hr/HRDashboard.css';

// Import HR Dashboard Widgets
import ActiveEmployeesWidget from '../../components/hrDashboard/ActiveEmployeesWidget';
import PendingReviewsWidget from '../../components/hrDashboard/PendingReviewsWidget';
import NewHiresWidget from '../../components/hrDashboard/NewHiresWidget';
import OpenConcernsWidget from '../../components/hrDashboard/OpenConcernsWidget';


function HRDashboard() {
  const [userName, setUserName] = useState('HR Professional');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    let currentUserName = 'HR Professional';

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

    const justLoggedIn = sessionStorage.getItem('justLoggedIn');
    if (justLoggedIn === 'true') {
      const greeting = getTimeBasedGreeting();
      if (storedUser) {
        const welcomeMessage = `${greeting} ${currentUserName}, you have successfully logged into the portal. Welcome to the HR Management Portal.`;
        speakText(welcomeMessage);
      }
      sessionStorage.removeItem('justLoggedIn');
    } else {
      // speakText("HR Management Portal");
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
    <div className="dashboard-container hr-dashboard fade-in-content">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-and-title">
            <h1>EmpowerFlow</h1>
            <p>Human Resources Dashboard</p>
          </div>
          <div className="header-actions">
            <VoiceToggleSwitch />
            <ThemeSwitcher />
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
        </div>
      </header>
      <main className="dashboard-content">
        <div className="dashboard-greeting">
            <h2>Welcome, {userName}!</h2>
            <p>Oversee and manage all HR operations from here.</p>
        </div>

        <nav className="hr-main-navigation">
            <Link to="/dashboard/hr/manage-employees" className="action-button">Manage Employees</Link>
            <Link to="/dashboard/hr/manage-holidays" className="action-button">Manage Holidays</Link>
            <Link to="/dashboard/hr/manage-documents" className="action-button">Manage Documents</Link>
            <Link to="/dashboard/hr/manage-hikes" className="action-button">Manage Hikes</Link>
            <Link to="/dashboard/hr/view-declarations" className="action-button">View Declarations</Link>
            {/* Add more primary navigation links as features are built */}
        </nav>

        <div className="hr-widgets-grid">
            <ActiveEmployeesWidget />
            <PendingReviewsWidget />
            <NewHiresWidget />
            <OpenConcernsWidget />
            {/* More widgets can be added here */}
        </div>

      </main>
      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} EmpowerFlow Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HRDashboard;
