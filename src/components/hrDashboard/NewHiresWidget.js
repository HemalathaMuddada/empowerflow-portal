import React from 'react';
import { Link } from 'react-router-dom';

const NewHiresWidget = () => {
  const dummyNewHiresCount = 2; // Static for now
  return (
    <div className="dashboard-card hr-widget new-hires-widget">
      <h3>New Joiners</h3>
      <p className="metric-large">{dummyNewHiresCount}</p>
      <p className="metric-label">Onboarded This Month</p>
      <p className="metric-small">Welcome to the team!</p>
       {/* Link to a future Onboarding Management page for HR */}
      <Link to="#" onClick={(e) => e.preventDefault()} className="card-link disabled-link">Manage Onboarding (Coming Soon)</Link>
    </div>
  );
};

export default NewHiresWidget;
