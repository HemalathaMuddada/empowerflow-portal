import React from 'react';
import { Link } from 'react-router-dom'; // Assuming tasks will have their own page eventually

const MyTasks = () => {
  return (
    <div className="dashboard-card">
      <h3>My Tasks</h3>
      <p>You have <strong>3</strong> pending tasks.</p>
      {/* Placeholder for task list or summary */}
      <ul>
        <li>Submit Q3 Performance Goals - Due: 2024-07-15</li>
        <li>Complete Security Awareness Training - Due: 2024-07-20</li>
      </ul>
      <Link to="/dashboard/employee/tasks" className="card-link">View All Tasks</Link>
    </div>
  );
};

export default MyTasks;
