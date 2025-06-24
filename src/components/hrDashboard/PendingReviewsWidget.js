import React from 'react';
import { Link } from 'react-router-dom';

const PendingReviewsWidget = () => {
  const dummyPendingCount = 3; // Static for now - in a real app, this would come from data
  return (
    <Link to="/dashboard/hr/manage-employees" state={{ filter: "pendingReviews" }} className="dashboard-card hr-widget pending-reviews-widget clickable-widget">
      <h3>Pending Reviews</h3>
      <p className="metric-large">{dummyPendingCount}</p>
      <p className="metric-label">Performance Reviews Due</p>
      <p className="metric-small">Awaiting HR action or completion.</p>
      <span className="card-link">Oversee Reviews</span>
    </Link>
  );
};

export default PendingReviewsWidget;
