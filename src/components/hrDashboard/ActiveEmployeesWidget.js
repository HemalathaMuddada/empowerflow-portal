import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ActiveEmployeesWidget = () => {
  const [activeCount, setActiveCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const itemStr = localStorage.getItem('masterEmployeeList');
    let employeeList = [];
    if (itemStr && itemStr !== 'undefined') {
      try {
        employeeList = JSON.parse(itemStr);
      } catch (e) {
        console.error("Failed to parse 'masterEmployeeList' from localStorage:", e);
        employeeList = []; // Fallback to empty array on error
      }
    }
    setTotalCount(employeeList.length);
    setActiveCount(employeeList.filter(emp => emp.status === 'Active').length);
  }, []); // Add dependencies if this needs to re-run on employee list changes

  return (
    <div className="dashboard-card hr-widget active-employees-widget">
      <h3>Employee Headcount</h3>
      <p className="metric-large">{activeCount}</p>
      <p className="metric-label">Active Employees</p>
      <p className="metric-small">Total Employees: {totalCount}</p>
      <Link to="/dashboard/hr/manage-employees" className="card-link">Manage Employees</Link>
    </div>
  );
};

export default ActiveEmployeesWidget;
