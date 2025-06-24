import React from 'react';
// import './ManagerWidgetStyles.css'; // Optional: if common styles for manager widgets are needed

const ManagerTasksWidget = () => {
  return (
    <div className="dashboard-card manager-widget"> {/* Use common dashboard-card and a specific manager-widget class */}
      <h4>Managerial Action Items</h4>
      <p className="widget-data-placeholder">Pending approvals, critical deadlines, or other tasks requiring manager attention.</p>
      <p style={{ fontStyle: 'italic', color: '#888', fontSize: '0.9em' }}>(Data coming soon)</p>
      {/* Future: List actual tasks with links */}
    </div>
  );
};

export default ManagerTasksWidget;
