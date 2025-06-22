import React from 'react';
import { Link } from 'react-router-dom';

const CompensationCard = () => {
  return (
    <div className="dashboard-card">
      <h3>My Compensation</h3>
      <p>View your current salary details, recent hike information, and review cycle.</p>
      {/* Could show a snippet of current gross or next review date if data was easily accessible here */}
      <ul>
        <li>View Salary Structure</li>
        <li>Check Last Increment</li>
      </ul>
      <Link to="/dashboard/employee/hike-info" className="card-link">View Compensation Details</Link>
    </div>
  );
};

export default CompensationCard;
