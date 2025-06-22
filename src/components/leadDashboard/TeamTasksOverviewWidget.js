import React from 'react';
import { Link } from 'react-router-dom';

const TeamTasksOverviewWidget = () => {
  return (
    <div className="dashboard-card lead-widget team-tasks-widget">
      <h3>Team Tasks Overview</h3>
      <p>You have <strong>5</strong> overdue team tasks (simulation).</p>
      <p><strong>2</strong> tasks due today.</p>
      {/* Future: Link to a team task management page */}
      <Link to="#" onClick={(e) => e.preventDefault()} className="card-link disabled-link">Manage Team Tasks (Coming Soon)</Link>
    </div>
  );
};

export default TeamTasksOverviewWidget;
