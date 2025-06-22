import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeSwitcher from '../../../components/ThemeSwitcher';
import { speakLogoutMessage, speakText } from '../../../utils/speech';
import './TeamApprovalsPage.css';

const LeaveRequestsApprovalSection = () => {
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [message, setMessage] = useState(''); // For success/error messages

  useEffect(() => {
    loadPendingLeaves();
  }, []);

  const loadPendingLeaves = () => {
    const allTeamLeaveRequests = JSON.parse(localStorage.getItem('teamLeaveRequests') || '[]');
    const pending = allTeamLeaveRequests.filter(req => req.status === 'Pending');
    // Sort by appliedDate ascending (oldest first to prioritize)
    pending.sort((a,b) => new Date(a.appliedDate) - new Date(b.appliedDate));
    setPendingLeaves(pending);
  };

  const handleLeaveAction = (requestId, newStatus) => {
    setMessage('');
    let allTeamLeaveRequests = JSON.parse(localStorage.getItem('teamLeaveRequests') || '[]');
    let employeeName = 'Employee';
    let employeeEmail = 'employee@example.com'; // Placeholder

    const requestIndex = allTeamLeaveRequests.findIndex(req => req.id === requestId);
    if (requestIndex > -1) {
      allTeamLeaveRequests[requestIndex].status = newStatus;
      employeeName = allTeamLeaveRequests[requestIndex].employeeName;
      // In a real app, you'd get employeeEmail from DUMMY_TEAM_MEMBERS or user data
      // For now, we can assume it or add it to the request object if needed for simulation.

      localStorage.setItem('teamLeaveRequests', JSON.stringify(allTeamLeaveRequests));
      loadPendingLeaves(); // Refresh the list
      setMessage(`Leave request for ${employeeName} has been ${newStatus.toLowerCase()}.`);
      speakText(`Leave request ${newStatus.toLowerCase()}.`);

      // Simulate email notification
      console.log(`--- Leave Request ${newStatus} ---
To: ${employeeName} <${employeeEmail}>
CC: HR Department <hr@example.com>
Subject: Your Leave Request has been ${newStatus}

Dear ${employeeName},

Your leave request from ${new Date(allTeamLeaveRequests[requestIndex].startDate).toLocaleDateString()} to ${new Date(allTeamLeaveRequests[requestIndex].endDate).toLocaleDateString()} has been ${newStatus.toLowerCase()}.

Reason (if rejected/applicable): [Lead to provide reason if UI supports it]

Regards,
EmpowerFlow Lead Portal
--------------------------------`);
    } else {
      setMessage('Error: Request not found.');
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-CA');

  return (
    <div className="approval-section tab-content">
      <h4>Pending Leave Requests</h4>
      {message && <p className={`form-message ${message.includes('Error') ? 'error-message' : 'success-message'}`}>{message}</p>}
      {pendingLeaves.length > 0 ? (
        <ul className="approval-list">
          {pendingLeaves.map(req => (
            <li key={req.id} className="approval-item">
              <p><strong>Employee:</strong> {req.employeeName} (ID: {req.employeeId})</p>
              <p><strong>Type:</strong> {req.leaveLabel || req.leaveType}</p>
              <p><strong>Dates:</strong> {formatDate(req.startDate)} to {formatDate(req.endDate)} ({req.days} day(s))</p>
              <p><strong>Reason:</strong> {req.reason}</p>
              <p><strong>Applied On:</strong> {formatDate(req.appliedDate)}</p>
              <div className="approval-actions">
                <button onClick={() => handleLeaveAction(req.id, 'Approved')} className="approve-button">Approve</button>
                <button onClick={() => handleLeaveAction(req.id, 'Rejected')} className="reject-button">Reject</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No pending leave requests.</p>
      )}
    </div>
  );
};

const RegularizationRequestsApprovalSection = () => {
  const [pendingRegularizations, setPendingRegularizations] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadPendingRegularizations();
  }, []);

  const loadPendingRegularizations = () => {
    const allTeamRegRequests = JSON.parse(localStorage.getItem('teamRegularizationRequests') || '[]');
    const pending = allTeamRegRequests.filter(req => req.status === 'Pending');
    // Sort by submissionDate ascending (oldest first)
    pending.sort((a,b) => new Date(a.submissionDate) - new Date(b.submissionDate));
    setPendingRegularizations(pending);
  };

  const handleRegAction = (requestId, newStatus) => {
    setMessage('');
    let allTeamRegRequests = JSON.parse(localStorage.getItem('teamRegularizationRequests') || '[]');
    let employeeName = 'Employee';
    let employeeEmail = 'employee@example.com'; // Placeholder

    const requestIndex = allTeamRegRequests.findIndex(req => req.id === requestId);
    if (requestIndex > -1) {
      allTeamRegRequests[requestIndex].status = newStatus;
      employeeName = allTeamRegRequests[requestIndex].employeeName;
      // Get employeeEmail if available in request or from DUMMY_TEAM_MEMBERS

      localStorage.setItem('teamRegularizationRequests', JSON.stringify(allTeamRegRequests));
      loadPendingRegularizations(); // Refresh list
      setMessage(`Regularization request for ${employeeName} has been ${newStatus.toLowerCase()}.`);
      speakText(`Regularization request ${newStatus.toLowerCase()}.`);

      // Simulate email notification
      console.log(`--- Attendance Regularization ${newStatus} ---
To: ${employeeName} <${employeeEmail}>
CC: HR Department <hr@example.com>
Subject: Your Attendance Regularization Request has been ${newStatus}

Dear ${employeeName},

Your attendance regularization request for date ${new Date(allTeamRegRequests[requestIndex].discrepancyDate).toLocaleDateString()} (Original: ${allTeamRegRequests[requestIndex].originalInTime}-${allTeamRegRequests[requestIndex].originalOutTime}, Requested: ${allTeamRegRequests[requestIndex].requestedInTime}-${allTeamRegRequests[requestIndex].requestedOutTime}) has been ${newStatus.toLowerCase()}.

Reason (if rejected/applicable): [Lead to provide reason if UI supports it]

Regards,
EmpowerFlow Lead Portal
--------------------------------`);
    } else {
      setMessage('Error: Request not found.');
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-CA');

  return (
    <div className="approval-section tab-content">
      <h4>Pending Attendance Regularization Requests</h4>
      {message && <p className={`form-message ${message.includes('Error') ? 'error-message' : 'success-message'}`}>{message}</p>}
      {pendingRegularizations.length > 0 ? (
        <ul className="approval-list">
          {pendingRegularizations.map(req => (
            <li key={req.id} className="approval-item">
              <p><strong>Employee:</strong> {req.employeeName} (ID: {req.employeeId})</p>
              <p><strong>Discrepancy Date:</strong> {formatDate(req.discrepancyDate)}</p>
              <p><strong>Original In/Out:</strong> {req.originalInTime} / {req.originalOutTime}</p>
              <p><strong>Requested In/Out:</strong> {req.requestedInTime} / {req.requestedOutTime}</p>
              <p><strong>Reason:</strong> {req.reason}</p>
              <p><strong>Submitted On:</strong> {formatDate(req.submissionDate)}</p>
              <div className="approval-actions">
                <button onClick={() => handleRegAction(req.id, 'Approved')} className="approve-button">Approve</button>
                <button onClick={() => handleRegAction(req.id, 'Rejected')} className="reject-button">Reject</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No pending attendance regularization requests.</p>
      )}
    </div>
  );
};


function TeamApprovalsPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Lead'); // Assuming lead's name
  const [activeTab, setActiveTab] = useState('leave'); // 'leave' or 'regularization'

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUserName(userData.name || 'Lead');
      } catch (e) { console.error(e); }
    }
    speakText("Team Approvals Management");
  }, []);

  const handleLogout = () => {
    speakLogoutMessage(userName);
    localStorage.removeItem('loggedInUser');
    navigate('/login');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'leave':
        return <LeaveRequestsApprovalSection />;
      case 'regularization':
        return <RegularizationRequestsApprovalSection />;
      default:
        return <LeaveRequestsApprovalSection />;
    }
  };

  return (
    <div className="dashboard-container team-approvals-page fade-in-content">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-and-title">
            <h1>EmpowerFlow</h1>
            <p>Team Request Approvals</p>
          </div>
          <div className="header-actions">
            <ThemeSwitcher />
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
        </div>
      </header>
      <main className="dashboard-content">
        <div style={{ marginBottom: '20px' }}>
            <Link to="/dashboard/lead" className="action-button" style={{backgroundColor: 'var(--secondary-accent-color)'}}>
                &larr; Back to Lead Dashboard
            </Link>
        </div>

        <h2>Manage Team Requests</h2>

        <nav className="approval-tabs">
          <button
            className={`approval-tab-button ${activeTab === 'leave' ? 'active' : ''}`}
            onClick={() => setActiveTab('leave')}>
            Leave Requests
          </button>
          <button
            className={`approval-tab-button ${activeTab === 'regularization' ? 'active' : ''}`}
            onClick={() => setActiveTab('regularization')}>
            Attendance Regularizations
          </button>
        </nav>

        <div className="approval-content-container dashboard-card">
          {renderTabContent()}
        </div>
      </main>
      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} EmpowerFlow Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default TeamApprovalsPage;
