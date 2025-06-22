import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeSwitcher from '../../../components/ThemeSwitcher';
import { speakLogoutMessage, speakText } from '../../../utils/speech';
import './TaskManagementPage.css';

// Task statuses - can be moved to constants.js if used elsewhere
const TASK_STATUSES = ['To Do', 'In Progress', 'Done'];

function TaskManagementPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Employee');

  // Form state for adding new task
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Task list state
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All'); // 'All', 'To Do', 'In Progress', 'Done'
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUserName(userData.name || 'Employee');
      } catch (e) { console.error(e); }
    }
    speakText("Task Management");
    loadTasks();
    setIsLoading(false);
  }, []);

  const loadTasks = () => {
    setIsLoading(true);
    const storedTasks = localStorage.getItem('employeeTasks');
    if (storedTasks) {
      try {
        const parsedTasks = JSON.parse(storedTasks);
        // Sort tasks: by status (To Do, In Progress, Done), then by due date ascending
        parsedTasks.sort((a, b) => {
          const statusOrder = { 'To Do': 1, 'In Progress': 2, 'Done': 3 };
          if (statusOrder[a.status] !== statusOrder[b.status]) {
            return statusOrder[a.status] - statusOrder[b.status];
          }
          return new Date(a.dueDate) - new Date(b.dueDate);
        });
        setTasks(parsedTasks);
      } catch (e) {
        console.error("Failed to parse tasks from localStorage", e);
        setTasks([]);
      }
    } else {
      setTasks([]);
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    speakLogoutMessage(userName);
    localStorage.removeItem('loggedInUser');
    navigate('/login');
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    if (!taskTitle.trim() || !taskDueDate) {
      setFormError('Task Title and Due Date are required.');
      return;
    }
    const newTask = {
      id: Date.now(),
      title: taskTitle.trim(),
      description: taskDescription.trim(),
      dueDate: taskDueDate,
      status: 'To Do', // Default status
      createdDate: new Date().toISOString()
    };
    const updatedTasks = [newTask, ...tasks];
    // Re-sort after adding
    updatedTasks.sort((a, b) => {
        const statusOrder = { 'To Do': 1, 'In Progress': 2, 'Done': 3 };
        if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
        }
        return new Date(a.dueDate) - new Date(b.dueDate);
    });
    localStorage.setItem('employeeTasks', JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
    setFormSuccess(`Task "${newTask.title}" added successfully.`);
    setTaskTitle('');
    setTaskDescription('');
    setTaskDueDate('');
  };

  const handleStatusChange = (taskId, newStatus) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    // Re-sort after status change
    updatedTasks.sort((a, b) => {
        const statusOrder = { 'To Do': 1, 'In Progress': 2, 'Done': 3 };
        if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
        }
        return new Date(a.dueDate) - new Date(b.dueDate);
    });
    localStorage.setItem('employeeTasks', JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
    speakText(`Task status updated to ${newStatus}.`);
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      localStorage.setItem('employeeTasks', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
      speakText("Task deleted.");
    }
  };

  const filteredTasks = tasks.filter(task =>
    filterStatus === 'All' || task.status === filterStatus
  );

  return (
    <div className="dashboard-container task-management-page">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-and-title">
            <h1>EmpowerFlow</h1>
            <p>{userName}'s Task Manager</p>
          </div>
          <div className="header-actions">
            <ThemeSwitcher />
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
        </div>
      </header>
      <main className="dashboard-content">
        <div style={{ marginBottom: '20px' }}>
            <Link to="/dashboard/employee" className="action-button" style={{backgroundColor: 'var(--secondary-accent-color)'}}>
                &larr; Back to Dashboard
            </Link>
        </div>

        <div className="add-task-section dashboard-card">
          <h3>Add New Task</h3>
          <form onSubmit={handleAddTask} className="task-form">
            {formError && <p className="form-message error-message">{formError}</p>}
            {formSuccess && <p className="form-message success-message">{formSuccess}</p>}

            <div className="form-group">
              <label htmlFor="taskTitle">Task Title:</label>
              <input type="text" id="taskTitle" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} required />
            </div>

            <div className="form-group">
              <label htmlFor="taskDescription">Description (Optional):</label>
              <textarea id="taskDescription" value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} rows="3" />
            </div>

            <div className="form-group">
              <label htmlFor="taskDueDate">Due Date:</label>
              <input type="date" id="taskDueDate" value={taskDueDate} onChange={(e) => setTaskDueDate(e.target.value)} required />
            </div>
            <button type="submit" className="submit-button">Add Task</button>
          </form>
        </div>

        <div className="task-list-section dashboard-card">
          <h3>My Tasks</h3>
          <div className="task-filter">
            <label htmlFor="statusFilter">Filter by Status: </label>
            <select id="statusFilter" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="All">All</option>
              {TASK_STATUSES.map(status => <option key={status} value={status}>{status}</option>)}
            </select>
          </div>

          {isLoading ? <p>Loading tasks...</p> :
            filteredTasks.length > 0 ? (
            <ul className="task-list">
              {filteredTasks.map(task => (
                <li key={task.id} className={`task-item status-${task.status?.toLowerCase().replace(' ', '-')}`}>
                  <div className="task-details">
                    <h4>{task.title}</h4>
                    <p className="task-due-date">Due: {task.dueDate}</p>
                    {task.description && <p className="task-desc">{task.description}</p>}
                  </div>
                  <div className="task-actions">
                    <select value={task.status} onChange={(e) => handleStatusChange(task.id, e.target.value)} title="Change Status">
                      {TASK_STATUSES.map(status => <option key={status} value={status}>{status}</option>)}
                    </select>
                    <button onClick={() => handleDeleteTask(task.id)} className="delete-task-button" title="Delete Task">
                      &#x1F5D1; {/* Trash Can Icon */}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No tasks found for the selected filter. Add a new task above!</p>
          )}
        </div>
      </main>
      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} EmpowerFlow Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default TaskManagementPage;
