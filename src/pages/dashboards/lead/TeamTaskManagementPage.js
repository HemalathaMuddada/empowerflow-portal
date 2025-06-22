import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeSwitcher from '../../../components/ThemeSwitcher';
import { speakLogoutMessage, speakText } from '../../../utils/speech';
import { DUMMY_TEAM_MEMBERS } from '../../../utils/constants'; // For assignee dropdown
import './TeamTaskManagementPage.css';

// Task statuses - can be moved to constants.js if used elsewhere
const TASK_STATUSES = ['To Do', 'In Progress', 'Done'];

function TeamTaskManagementPage() {
  const navigate = useNavigate();
  const [leadName, setLeadName] = useState('Lead'); // Lead's name

  // Form state for assigning new task
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [assignedToId, setAssignedToId] = useState(DUMMY_TEAM_MEMBERS[0]?.id || '');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Task list state
  const [teamTasks, setTeamTasks] = useState([]);
  const [filterAssignee, setFilterAssignee] = useState('All'); // 'All' or employeeId
  const [filterStatus, setFilterStatus] = useState('All');   // 'All', 'To Do', etc.
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setLeadName(userData.name || 'Lead');
      } catch (e) { console.error(e); }
    }
    speakText("Team Task Management");
    loadTeamTasks();
  }, []);

  const loadTeamTasks = () => {
    setIsLoading(true);
    const storedTasks = localStorage.getItem('teamAssignedTasks');
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
        setTeamTasks(parsedTasks);
      } catch (e) {
        console.error("Failed to parse team tasks from localStorage", e);
        setTeamTasks([]);
      }
    } else {
      setTeamTasks([]);
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    speakLogoutMessage(leadName);
    localStorage.removeItem('loggedInUser');
    navigate('/login');
  };

  const handleAssignTask = (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    if (!taskTitle.trim() || !taskDueDate || !assignedToId) {
      setFormError('Task Title, Due Date, and Assignee are required.');
      return;
    }
    const assignee = DUMMY_TEAM_MEMBERS.find(mem => mem.id === assignedToId);
    if (!assignee) {
        setFormError('Invalid assignee selected.'); // Should not happen if dropdown is sourced correctly
        return;
    }

    const newTask = {
      id: Date.now(),
      title: taskTitle.trim(),
      description: taskDescription.trim(),
      dueDate: taskDueDate,
      status: 'To Do', // Default status
      assignedToId: assignee.id,
      assignedToName: assignee.name,
      assignedBy: leadName,
      createdDate: new Date().toISOString()
    };

    const updatedTasks = [newTask, ...teamTasks];
    updatedTasks.sort((a, b) => {
        const statusOrder = { 'To Do': 1, 'In Progress': 2, 'Done': 3 };
        if (statusOrder[a.status] !== statusOrder[b.status]) {
            return statusOrder[a.status] - statusOrder[b.status];
        }
        return new Date(a.dueDate) - new Date(b.dueDate);
    });
    localStorage.setItem('teamAssignedTasks', JSON.stringify(updatedTasks));
    setTeamTasks(updatedTasks);
    setFormSuccess(`Task "${newTask.title}" assigned to ${assignee.name} successfully.`);
    setTaskTitle('');
    setTaskDescription('');
    setTaskDueDate('');
    setAssignedToId(DUMMY_TEAM_MEMBERS[0]?.id || '');
  };

  const handleTeamTaskStatusChange = (taskId, newStatus) => {
    const updatedTasks = teamTasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    updatedTasks.sort((a, b) => {
        const statusOrder = { 'To Do': 1, 'In Progress': 2, 'Done': 3 };
        if (statusOrder[a.status] !== statusOrder[b.status]) {
            return statusOrder[a.status] - statusOrder[b.status];
        }
        return new Date(a.dueDate) - new Date(b.dueDate);
    });
    localStorage.setItem('teamAssignedTasks', JSON.stringify(updatedTasks));
    setTeamTasks(updatedTasks);
    speakText(`Task status updated to ${newStatus}.`);
  };

  const handleDeleteTeamTask = (taskId) => {
    if (window.confirm("Are you sure you want to delete this team task?")) {
      const updatedTasks = teamTasks.filter(task => task.id !== taskId);
      localStorage.setItem('teamAssignedTasks', JSON.stringify(updatedTasks));
      setTeamTasks(updatedTasks);
      speakText("Team task deleted.");
    }
  };

  const filteredTeamTasks = teamTasks.filter(task =>
    (filterAssignee === 'All' || task.assignedToId === filterAssignee) &&
    (filterStatus === 'All' || task.status === filterStatus)
  );

  return (
    <div className="dashboard-container team-task-management-page fade-in-content">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-and-title">
            <h1>EmpowerFlow</h1>
            <p>Team Task Management</p>
          </div>
          <div className="header-actions">
            <ThemeSwitcher />
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
        </div>
      </header>
      <main className="dashboard-content">
        <div style={{ marginBottom: '20px' }}>
            <Link to="/dashboard/lead" className="action-button" style={{backgroundColor: 'var(--secondary-accent-color)'}}>
                &larr; Back to Lead Dashboard
            </Link>
        </div>

        <div className="assign-task-section dashboard-card">
          <h3>Assign New Task to Team Member</h3>
          <form onSubmit={handleAssignTask} className="task-form">
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
            <div className="form-row">
                <div className="form-group">
                <label htmlFor="taskDueDate">Due Date:</label>
                <input type="date" id="taskDueDate" value={taskDueDate} onChange={(e) => setTaskDueDate(e.target.value)} required />
                </div>
                <div className="form-group">
                <label htmlFor="assignedToId">Assign To:</label>
                <select id="assignedToId" value={assignedToId} onChange={(e) => setAssignedToId(e.target.value)} required>
                    <option value="">-- Select Team Member --</option>
                    {DUMMY_TEAM_MEMBERS.map(member => (
                    <option key={member.id} value={member.id}>{member.name}</option>
                    ))}
                </select>
                </div>
            </div>
            <button type="submit" className="submit-button">Assign Task</button>
          </form>
        </div>

        <div className="team-task-list-section dashboard-card">
          <h3>Assigned Team Tasks</h3>
          <div className="team-task-filters">
            <div className="form-group">
                <label htmlFor="filterAssignee">Filter by Assignee: </label>
                <select id="filterAssignee" value={filterAssignee} onChange={(e) => setFilterAssignee(e.target.value)}>
                <option value="All">All Team Members</option>
                {DUMMY_TEAM_MEMBERS.map(member => (
                    <option key={member.id} value={member.id}>{member.name}</option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="filterStatusTeam">Filter by Status: </label>
                <select id="filterStatusTeam" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="All">All Statuses</option>
                {TASK_STATUSES.map(status => <option key={status} value={status}>{status}</option>)}
                </select>
            </div>
          </div>

          {isLoading ? <p>Loading tasks...</p> :
            filteredTeamTasks.length > 0 ? (
            <ul className="task-list team-tasks"> {/* Added .team-tasks for potential specific styling */}
              {filteredTeamTasks.map(task => (
                <li key={task.id} className={`task-item status-${task.status?.toLowerCase().replace(' ', '-')}`}>
                  <div className="task-details">
                    <h4>{task.title}</h4>
                    <p><strong>Assignee:</strong> {task.assignedToName}</p>
                    <p className="task-due-date">Due: {task.dueDate}</p>
                    {task.description && <p className="task-desc">{task.description}</p>}
                  </div>
                  <div className="task-actions">
                    <select value={task.status} onChange={(e) => handleTeamTaskStatusChange(task.id, e.target.value)} title="Change Status">
                      {TASK_STATUSES.map(status => <option key={status} value={status}>{status}</option>)}
                    </select>
                    <button onClick={() => handleDeleteTeamTask(task.id)} className="delete-task-button" title="Delete Task">
                      &#x1F5D1; {/* Trash Can Icon */}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No tasks found for the selected filters.</p>
          )}
        </div>
      </main>
      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} EmpowerFlow Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default TeamTaskManagementPage;
