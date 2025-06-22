import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MyTasks = ({ maxSummaryTasks = 2 }) => {
  const [pendingTasksCount, setPendingTasksCount] = useState(0);
  const [summaryTasks, setSummaryTasks] = useState([]);

  useEffect(() => {
    const storedTasks = localStorage.getItem('employeeTasks');
    if (storedTasks) {
      try {
        const allTasks = JSON.parse(storedTasks);
        const pending = allTasks.filter(task => task.status !== 'Done');
        setPendingTasksCount(pending.length);

        // Sort pending tasks by due date (earliest first) for summary
        const sortedPending = pending.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        setSummaryTasks(sortedPending.slice(0, maxSummaryTasks));

      } catch (e) {
        console.error("Failed to parse tasks for summary card:", e);
        setPendingTasksCount(0);
        setSummaryTasks([]);
      }
    } else {
        setPendingTasksCount(0);
        setSummaryTasks([]);
    }
  }, []); // Re-run if localStorage changes? For now, just on mount.
            // A global state or event would be better for live updates.

  return (
    <div className="dashboard-card my-tasks-card">
      <h3>My Tasks</h3>
      {pendingTasksCount > 0 ? (
        <>
          <p>You have <strong>{pendingTasksCount}</strong> pending task(s).</p>
          {summaryTasks.length > 0 && (
            <ul>
              {summaryTasks.map(task => (
                <li key={task.id}>
                  {task.title} - <em>Due: {new Date(task.dueDate).toLocaleDateString()} ({task.status})</em>
                </li>
              ))}
            </ul>
          )}
          {pendingTasksCount > summaryTasks.length && (
            <p><small>...and {pendingTasksCount - summaryTasks.length} more.</small></p>
          )}
        </>
      ) : (
        <p>You have no pending tasks. Great job!</p>
      )}
      <Link to="/dashboard/employee/tasks" className="card-link">View All Tasks</Link>
    </div>
  );
};

export default MyTasks;
