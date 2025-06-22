import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeSwitcher from '../../../components/ThemeSwitcher';
import { speakLogoutMessage, speakText } from '../../../utils/speech';
import ApplyLeaveForm from '../../../components/leaveManagement/ApplyLeaveForm';
import LeaveHistory from '../../../components/leaveManagement/LeaveHistory';
// Placeholders for components to be created in next steps
// import DetailedLeaveBalances from '../../../components/leaveManagement/DetailedLeaveBalances';
import './LeaveManagementPage.css'; // For styling tabs and sections

// Temporary placeholders until actual components are built
// const ApplyLeaveForm = () => <div className="tab-content"><p>Apply for Leave form will be here.</p></div>;
// const LeaveHistory = () => <div className="tab-content"><p>Leave History will be displayed here.</p></div>;
const DetailedLeaveBalances = () => <div className="tab-content"><p>Detailed Leave Balances will be shown here.</p></div>;


function LeaveManagementPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('apply'); // 'apply', 'history', 'balances'
  const [userName, setUserName] = useState('Employee');

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUserName(userData.name || 'Employee');
      } catch (e) { console.error(e); }
    }
    speakText("Leave Management Portal");
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'apply':
        return <ApplyLeaveForm />;
      case 'history':
        return <LeaveHistory />;
      case 'balances':
        return <DetailedLeaveBalances />;
      default:
        return <ApplyLeaveForm />;
    }
  };

  return (
    <div className="dashboard-container leave-management-page fade-in-content">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-and-title">
            <h1>EmpowerFlow</h1>
            <p>{userName}'s Leave Management</p>
          </div>
          <div className="header-actions">
            <ThemeSwitcher />
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
        </div>
      </header>
      <main className="dashboard-content">
        <div style={{ marginBottom: '20px' }}>
            <Link to="/dashboard/employee" className="action-button" style={{backgroundColor: 'var(--secondary-accent-color)'}}>
                &larr; Back to Dashboard
            </Link>
        </div>

        <nav className="lm-tabs">
          <button
            className={`lm-tab-button ${activeTab === 'apply' ? 'active' : ''}`}
            onClick={() => setActiveTab('apply')}>
            Apply for Leave
          </button>
          <button
            className={`lm-tab-button ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}>
            My Leave History
          </button>
          <button
            className={`lm-tab-button ${activeTab === 'balances' ? 'active' : ''}`}
            onClick={() => setActiveTab('balances')}>
            My Leave Balances
          </button>
        </nav>

        <div className="lm-tab-content-container">
          {renderTabContent()}
        </div>

      </main>
      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} EmpowerFlow Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LeaveManagementPage;
