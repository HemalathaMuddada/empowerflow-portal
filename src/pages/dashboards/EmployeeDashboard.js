import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { speakText, getTimeBasedGreeting, speakLogoutMessage } from '../../utils/speech';
import ThemeSwitcher from '../../components/ThemeSwitcher';
import VoiceToggleSwitch from '../../components/VoiceToggleSwitch'; // Import VoiceToggleSwitch
import UpcomingHolidays from '../../components/employeeDashboard/UpcomingHolidays';
import LeaveBalances from '../../components/employeeDashboard/LeaveBalances';
import MyTasks from '../../components/employeeDashboard/MyTasks';
import RecentPayslips from '../../components/employeeDashboard/RecentPayslips';
import DocumentCenterCard from '../../components/employeeDashboard/DocumentCenterCard';
import CompensationCard from '../../components/employeeDashboard/CompensationCard';
import PerformanceReviewCard from '../../components/employeeDashboard/PerformanceReviewCard';
import BirthdaysCard from '../../components/employeeDashboard/BirthdaysCard';
import AttendanceRegularizationCard from '../../components/employeeDashboard/AttendanceRegularizationCard'; // New
import './Dashboard.css';
import './employee/EmployeeDashboard.css'; // Specific styles for Employee Dashboard layout

function EmployeeDashboard() {
  const [userName, setUserName] = useState('Employee');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    let currentUserName = 'Employee'; // Default

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
    // else if (routeUserName) { // Fallback to route state if localStorage fails or is empty
    //   currentUserName = routeUserName;
    // }

    setUserName(currentUserName);

    const justLoggedIn = sessionStorage.getItem('justLoggedIn');
    if (justLoggedIn === 'true') {
      const greeting = getTimeBasedGreeting();
      if (storedUser) { // Ensure user context is available for name
          const welcomeMessage = `${greeting} ${currentUserName}, you have successfully logged into the portal. Welcome to your Employee Dashboard.`;
          speakText(welcomeMessage);
      }
      sessionStorage.removeItem('justLoggedIn'); // Clear flag after speaking
    } else {
      // For subsequent loads of this page (not immediately after login),
      // we might want a very brief page title announcement or nothing.
      // For now, let's make other page title announcements more explicit on those pages.
      // speakText("Employee Dashboard"); // Optional: if every visit should announce page title
    }
    // Cleanup function to stop speech if component unmounts
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleLogout = () => {
    const storedUserForLogout = localStorage.getItem('loggedInUser');
    let currentUserNameForLogout = 'User';
    if (storedUserForLogout) {
      try {
        const userData = JSON.parse(storedUserForLogout);
        currentUserNameForLogout = userData.name || currentUserNameForLogout;
      } catch (e) { /* ignore parsing error */ }
    }

    speakLogoutMessage(currentUserNameForLogout);

    localStorage.removeItem('loggedInUser');
    navigate('/login');
  };

  return (
    <div className="dashboard-container employee-dashboard fade-in-content"> {/* Added fade-in-content */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-and-title">
            <h1>EmpowerFlow</h1>
            <p>Employee Dashboard</p>
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
          <p>Here's an overview of your information and quick actions.</p>
        </div>

        <div className="dashboard-actions">
            <Link to="/dashboard/employee/leave" className="action-button">
              Manage My Leave
            </Link>
            <Link to="/dashboard/employee/work-status-report" className="action-button">
              Submit Work Report
            </Link>
            <Link to="/dashboard/employee/raise-concern" className="action-button">
              Raise a Concern
            </Link>
        </div>

        <div className="dashboard-grid">
          <div className="widget-tile-violet"><UpcomingHolidays /></div>
          <div className="widget-tile-pink"><LeaveBalances /></div>
          <div className="widget-tile-green"><MyTasks /></div>
          <div className="widget-tile-blue"><RecentPayslips /></div>
          <div className="widget-tile-violet"><DocumentCenterCard /></div>
          <div className="widget-tile-pink"><CompensationCard /></div>
          <div className="widget-tile-green"><PerformanceReviewCard /></div>
          <div className="widget-tile-blue"><BirthdaysCard /></div>
          <div className="widget-tile-violet"><AttendanceRegularizationCard /></div>
        </div>
      </main>
      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} EmpowerFlow Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default EmployeeDashboard;
