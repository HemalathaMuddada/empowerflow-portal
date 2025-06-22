import React from 'react';
import { Link } from 'react-router-dom'; // Assuming payslips will have their own page

const RecentPayslips = () => {
  return (
    <div className="dashboard-card">
      <h3>Recent Payslips</h3>
      <p>Your latest payslip: <strong>June 2024</strong></p>
      {/* Placeholder for a link to the latest payslip or a short list */}
      <ul>
        <li>June 2024 - <a href="#" onClick={(e) => e.preventDefault()}>Download</a></li>
        <li>May 2024 - <a href="#" onClick={(e) => e.preventDefault()}>Download</a></li>
      </ul>
      <Link to="/dashboard/employee/payslips" className="card-link">View All Payslips</Link>
    </div>
  );
};

export default RecentPayslips;
