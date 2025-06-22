import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const TeamTasksOverviewWidget = () => {
  const [totalTasks, setTotalTasks] = useState(0);
  const [overdueTasks, setOverdueTasks] = useState(0);
  const [dueTodayTasks, setDueTodayTasks] = useState(0);

  useEffect(() => {
    const storedTasks = localStorage.getItem('teamAssignedTasks');
    if (storedTasks) {
      try {
        const allTeamTasks = JSON.parse(storedTasks);
        const pendingTasks = allTeamTasks.filter(task => task.status !== 'Done');
        setTotalTasks(pendingTasks.length); // Show count of pending tasks as "total" active

        const today = new Date().toISOString().split('T')[0];
        let overdueCount = 0;
        let dueTodayCount = 0;

        pendingTasks.forEach(task => {
          if (task.dueDate < today) {
            overdueCount++;
          } else if (task.dueDate === today) {
            dueTodayCount++;
          }
        });
        setOverdueTasks(overdueCount);
        setDueTodayTasks(dueTodayCount);

      } catch (e) {
        console.error("Failed to parse team tasks for overview widget:", e);
      }
    }
  }, []); // Consider adding a dependency or a refresh mechanism for more dynamic updates

  return (
    <div className="dashboard-card lead-widget team-tasks-widget">
      <h3>Team Tasks Overview</h3>
      {totalTasks > 0 ? (
        <>
          <p><strong>{totalTasks}</strong> active task(s) assigned to the team.</p>
          {overdueTasks > 0 && <p style={{color: 'var(--danger-color, #e74c3c)'}}><strong>{overdueTasks}</strong> task(s) overdue.</p>}
          {dueTodayTasks > 0 && <p style={{color: 'var(--warning-color, #f39c12)'}}><strong>{dueTodayTasks}</strong> task(s) due today.</p>}
        </>
      ) : (
        <p>No active tasks currently assigned to the team.</p>
      )}
      <Link to="/dashboard/lead/team-tasks" className="card-link">Manage Team Tasks</Link>
    </div>
  );
};

export default TeamTasksOverviewWidget;
