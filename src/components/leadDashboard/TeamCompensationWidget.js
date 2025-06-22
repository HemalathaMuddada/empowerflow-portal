import React from 'react';
import { Link } from 'react-router-dom';

const TeamCompensationWidget = () => {
  return (
    <div className="dashboard-card lead-widget team-compensation-widget">
      <h3>Team Compensation</h3>
      <p>View current compensation details and review cycle information for your team members.</p>
      {/* Could add a count of team members or upcoming reviews if data was available here */}
      <ul>
        <li>Review team salary structures.</li>
        <li>Track upcoming performance reviews.</li>
      </ul>
      <Link to="/dashboard/lead/team-compensation" className="card-link">View Team Compensation Details</Link>
    </div>
  );
};

export default TeamCompensationWidget;
