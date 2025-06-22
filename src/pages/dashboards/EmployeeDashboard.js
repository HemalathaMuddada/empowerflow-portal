import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Added Link
import { speakText, getTimeBasedGreeting, speakLogoutMessage } from '../../utils/speech';
import ThemeSwitcher from '../../components/ThemeSwitcher';
import UpcomingHolidays from '../../components/employeeDashboard/UpcomingHolidays'; // To be created
import LeaveBalances from '../../components/employeeDashboard/LeaveBalances'; // To be created
import MyTasks from '../../components/employeeDashboard/MyTasks';
import RecentPayslips from '../../components/employeeDashboard/RecentPayslips';
import DocumentCenterCard from '../../components/employeeDashboard/DocumentCenterCard'; // New
import CompensationCard from '../../components/employeeDashboard/CompensationCard'; // New
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

    const greeting = getTimeBasedGreeting();
    if (storedUser) {
        const welcomeMessage = `${greeting} ${currentUserName}, welcome to your Employee Dashboard.`; // Shortened for brevity on reloads
        speakText(welcomeMessage);
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
    <div className="dashboard-container employee-dashboard"> {/* Added 'employee-dashboard' class for specific layout */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-and-title">
            <h1>EmpowerFlow</h1>
            <p>Employee Dashboard</p>
          </div>
          <div className="header-actions">
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
          {/* These components will be created in subsequent steps */}
          <UpcomingHolidays />
          <LeaveBalances />
          <MyTasks />
          <RecentPayslips />
          <DocumentCenterCard />
          <CompensationCard />
          {/* Example of how more cards can be added:
          <div className="dashboard-card"><h3>Performance Review</h3><p>Status: Upcoming</p><Link to="/dashboard/employee/performance" className="card-link">View Details</Link></div>
          */}
        </div>
      </main>
      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} EmpowerFlow Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default EmployeeDashboard;
