import React from 'react';
// import './ManagerWidgetStyles.css'; // Optional: if common styles for manager widgets are needed

const TeamQuickSummaryWidget = () => {
  return (
    <div className="dashboard-card manager-widget"> {/* Use common dashboard-card and a specific manager-widget class */}
      <h4>Team Quick Summary</h4>
      <p className="widget-data-placeholder">Team performance metrics and key highlights will appear here.</p>
      <p style={{ fontStyle: 'italic', color: '#888', fontSize: '0.9em' }}>(Data coming soon)</p>
      {/* Future: Could link to a more detailed team performance page */}
    </div>
  );
};

export default TeamQuickSummaryWidget;
