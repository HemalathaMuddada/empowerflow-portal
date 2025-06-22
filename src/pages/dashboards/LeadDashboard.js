import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNavigate, Link } from 'react-router-dom'; // Added Link
import { speakText, getTimeBasedGreeting, speakLogoutMessage } from '../../utils/speech';
import ThemeSwitcher from '../../components/ThemeSwitcher';
import '../Dashboard.css'; // Common dashboard styles
import './lead/LeadDashboard.css'; // Specific styles for Lead Dashboard

// Import Employee Dashboard Cards for self-service section
import UpcomingHolidays from '../../components/employeeDashboard/UpcomingHolidays';
import LeaveBalances from '../../components/employeeDashboard/LeaveBalances';
import MyTasks from '../../components/employeeDashboard/MyTasks';
import RecentPayslips from '../../components/employeeDashboard/RecentPayslips';
import DocumentCenterCard from '../../components/employeeDashboard/DocumentCenterCard';
import CompensationCard from '../../components/employeeDashboard/CompensationCard';
import PerformanceReviewCard from '../../components/employeeDashboard/PerformanceReviewCard';
import BirthdaysCard from '../../components/employeeDashboard/BirthdaysCard';
import AttendanceRegularizationCard from '../../components/employeeDashboard/AttendanceRegularizationCard';

// Import Lead Specific Widgets
import PendingApprovalsWidget from '../../components/leadDashboard/PendingApprovalsWidget';
import TeamTasksOverviewWidget from '../../components/leadDashboard/TeamTasksOverviewWidget';


function LeadDashboard() {
  const [userName, setUserName] = useState('Lead');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    let currentUserName = 'Lead';

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
        const welcomeMessage = `${greeting} ${currentUserName}, welcome to your Lead Dashboard.`;
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
    <div className="dashboard-container lead-dashboard fade-in-content">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-and-title">
            <h1>EmpowerFlow</h1>
            <p>Lead Dashboard</p>
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
          <p>Manage your tasks and oversee your team's activities.</p>
        </div>

        <div className="lead-sections-container">
            {/* Team Overview Section */}
            <section className="lead-section team-overview-section">
                <h2 className="section-title">Team Overview</h2>
                <div className="dashboard-grid">
                    <PendingApprovalsWidget />
                    <TeamTasksOverviewWidget />
                    {/* Add more team-specific widgets here later */}
                </div>
            </section>

            {/* My Dashboard Section (Employee Self-Service) */}
            <section className="lead-section my-dashboard-section">
                <h2 className="section-title">My Dashboard (Self-Service)</h2>
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
                    <UpcomingHolidays />
                    <LeaveBalances />
                    <MyTasks />
                    <RecentPayslips />
                    <DocumentCenterCard />
                    <CompensationCard />
                    <PerformanceReviewCard />
                    <AttendanceRegularizationCard/>
                    <BirthdaysCard />
                </div>
            </section>
        </div>

      </main>
      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} EmpowerFlow Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LeadDashboard;
