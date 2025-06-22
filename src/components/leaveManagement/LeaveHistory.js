import React, { useState, useEffect } from 'react';
import './LeaveHistory.css'; // We'll create this CSS file

function LeaveHistory() {
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load leave history from localStorage
    const storedLeaves = localStorage.getItem('appliedLeaves');
    if (storedLeaves) {
      try {
        // Sort by appliedDate in descending order (most recent first)
        const parsedLeaves = JSON.parse(storedLeaves);
        parsedLeaves.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));
        setLeaveHistory(parsedLeaves);
      } catch (e) {
        console.error("Failed to parse leave history from localStorage", e);
        setLeaveHistory([]);
      }
    }
    setLoading(false);
  }, []); // Re-run if a dependency changes that indicates new leave applied (not handled here directly)
          // A more robust solution would use context or a state management library to trigger refresh.
          // For now, user might need to re-navigate or refresh tab to see immediate updates if form is on same page.

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-CA'); // YYYY-MM-DD format
  };

  if (loading) {
    return <div className="tab-content"><p>Loading leave history...</p></div>;
  }

  return (
    <div className="leave-history-container tab-content">
      <h3>My Leave History</h3>
      {leaveHistory.length > 0 ? (
        <div className="table-responsive-wrapper">
          <table className="leave-history-table">
            <thead>
              <tr>
                <th>Applied Date</th>
                <th>Leave Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaveHistory.map(leave => (
                <tr key={leave.id}>
                  <td>{formatDate(leave.appliedDate)}</td>
                  <td>{leave.leaveLabel || leave.leaveType}</td>
                  <td>{formatDate(leave.startDate)}</td>
                  <td>{formatDate(leave.endDate)}</td>
                  <td>{leave.days}</td>
                  <td className="reason-cell" title={leave.reason}>{leave.reason}</td>
                  <td>
                    <span className={`status-badge status-${leave.status?.toLowerCase() || 'pending'}`}>
                      {leave.status || 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>You have not applied for any leaves yet.</p>
      )}
    </div>
  );
}

export default LeaveHistory;
