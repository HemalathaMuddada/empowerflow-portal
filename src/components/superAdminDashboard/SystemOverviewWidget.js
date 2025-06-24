import React from 'react';

const SystemOverviewWidget = () => {
  return (
    <div className="dashboard-card superadmin-widget">
      <h4>System Overview</h4>
      <p className="widget-data-placeholder">Key system metrics like total users, active sessions, etc., will be displayed here.</p>
      <p style={{ fontStyle: 'italic', color: '#888', fontSize: '0.9em' }}>(Data coming soon)</p>
    </div>
  );
};

export default SystemOverviewWidget;
