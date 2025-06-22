import React from 'react';
import { Link } from 'react-router-dom';

const AttendanceRegularizationCard = () => {
  return (
    <div className="dashboard-card attendance-reg-card">
      <h3>Attendance Regularization</h3>
      <p>Request corrections for any discrepancies in your recorded attendance.</p>
      <ul>
        <li>Missed punch-in/out</li>
        <li>Incorrect timings</li>
      </ul>
      <Link to="/dashboard/employee/attendance-regularization" className="card-link">Request Regularization</Link>
    </div>
  );
};

export default AttendanceRegularizationCard;
