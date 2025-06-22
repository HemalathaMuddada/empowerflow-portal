import React from 'react';
import { Link } from 'react-router-dom';

const PendingReviewsWidget = () => {
  const dummyPendingCount = 3; // Static for now
  return (
    <div className="dashboard-card hr-widget pending-reviews-widget">
      <h3>Pending Reviews</h3>
      <p className="metric-large">{dummyPendingCount}</p>
      <p className="metric-label">Performance Reviews Due</p>
      <p className="metric-small">Awaiting HR action or completion.</p>
      {/* Link to a future Performance Review Management page for HR */}
      <Link to="#" onClick={(e) => e.preventDefault()} className="card-link disabled-link">Oversee Reviews (Coming Soon)</Link>
    </div>
  );
};

export default PendingReviewsWidget;
