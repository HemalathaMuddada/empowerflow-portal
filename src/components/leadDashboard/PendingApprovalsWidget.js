import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Styles for this widget can be added to a new LeadDashboard.css or an existing dashboard CSS

const PendingApprovalsWidget = () => {
  const [pendingLeaveCount, setPendingLeaveCount] = useState(0);
  const [pendingRegCount, setPendingRegCount] = useState(0);

  useEffect(() => {
    // Load teamLeaveRequests from localStorage
    const teamLeaveReqs = JSON.parse(localStorage.getItem('teamLeaveRequests') || '[]');
    setPendingLeaveCount(teamLeaveReqs.filter(req => req.status === 'Pending').length);

    // Load teamRegularizationRequests from localStorage
    const teamRegReqs = JSON.parse(localStorage.getItem('teamRegularizationRequests') || '[]');
    setPendingRegCount(teamRegReqs.filter(req => req.status === 'Pending').length);

    // Note: For live updates if these change elsewhere, a global state/event system would be needed.
    // For now, this loads on component mount.
  }, []);

  return (
    <div className="dashboard-card lead-widget pending-approvals-widget">
      <h3>Pending Approvals</h3>
      { (pendingLeaveCount === 0 && pendingRegCount === 0) ? (
        <p>No pending approvals at the moment.</p>
      ) : (
        <ul>
          {pendingLeaveCount > 0 && (
            <li>
              <strong>Leave Requests:</strong> {pendingLeaveCount} pending
            </li>
          )}
          {pendingRegCount > 0 && (
            <li>
              <strong>Attendance Regularizations:</strong> {pendingRegCount} pending
            </li>
          )}
        </ul>
      )}
      <Link to="/dashboard/lead/approvals" className="card-link">Manage Approvals</Link>
    </div>
  );
};

export default PendingApprovalsWidget;
