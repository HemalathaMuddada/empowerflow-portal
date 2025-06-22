import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeSwitcher from '../../../components/ThemeSwitcher';
import { speakLogoutMessage, speakText } from '../../../utils/speech';
import { HOLIDAY_LIST as INITIAL_HOLIDAYS } from '../../../utils/constants'; // Initial seed
import './ManageHolidaysPage.css';

// Simplified Modal for Add/Edit Holiday
const HolidayFormModal = ({ holiday, onSave, onClose }) => {
    const [name, setName] = useState(holiday ? holiday.name : '');
    const [date, setDate] = useState(holiday ? holiday.date : '');
    const [formError, setFormError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormError('');
        if (!name.trim() || !date) {
            setFormError('Holiday Name and Date are required.');
            return;
        }
        onSave({ ...holiday, name: name.trim(), date });
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="modal-backdrop">
            <div className="modal-content holiday-form-modal-content">
                <h3>{holiday ? 'Edit Holiday' : 'Add New Holiday'}</h3>
                {formError && <p className="form-message error-message">{formError}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="holidayName">Holiday Name:</label>
                        <input type="text" id="holidayName" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="holidayDate">Date:</label>
                        <input type="date" id="holidayDate" value={date} onChange={(e) => setDate(e.target.value)} min={holiday ? undefined : today} required />
                    </div>
                    <div className="modal-actions">
                        <button type="submit" className="submit-button">{holiday ? 'Save Changes' : 'Add Holiday'}</button>
                        <button type="button" onClick={onClose} className="cancel-button">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


function ManageHolidaysPage() {
  const navigate = useNavigate();
  const [hrUserName, setHrUserName] = useState('HR Admin');
  const [holidays, setHolidays] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState(null); // null for Add, holiday object for Edit

  const loadHolidays = () => {
    let storedHolidays = localStorage.getItem('companyHolidayList');
    if (!storedHolidays) {
      // Initialize from constants if not in localStorage
      localStorage.setItem('companyHolidayList', JSON.stringify(INITIAL_HOLIDAYS));
      storedHolidays = JSON.stringify(INITIAL_HOLIDAYS);
      console.log("Initialized companyHolidayList in localStorage from constants.");
    }
    try {
      const parsedHolidays = JSON.parse(storedHolidays);
      // Sort by date
      parsedHolidays.sort((a,b) => new Date(a.date) - new Date(b.date));
      setHolidays(parsedHolidays);
    } catch (e) {
      console.error("Failed to parse holidays from localStorage", e);
      setHolidays([]);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setHrUserName(userData.name || 'HR Admin');
      } catch (e) { console.error(e); }
    }
    loadHolidays();
    speakText("Manage Company Holidays");
  }, []);

  const handleLogout = () => {
    speakLogoutMessage(hrUserName);
    localStorage.removeItem('loggedInUser');
    navigate('/login');
  };

  const handleOpenModal = (holiday = null) => {
    setEditingHoliday(holiday);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingHoliday(null);
  };

  const handleSaveHoliday = (holidayData) => {
    let updatedHolidays;
    if (editingHoliday && editingHoliday.id) { // Edit existing
      updatedHolidays = holidays.map(h => h.id === editingHoliday.id ? {...holidayData, id: editingHoliday.id } : h);
    } else if (editingHoliday && !editingHoliday.id && holidayData.date && holidayData.name) { // Editing an initial holiday that might not have an ID
        // This case handles editing items from INITIAL_HOLIDAYS that didn't have an ID
        // We find it by name and old date if editingHoliday has oldDate, or just add if not found
        const oldDateToMatch = editingHoliday.originalDate || editingHoliday.date;
        const oldNameToMatch = editingHoliday.originalName || editingHoliday.name;
        const existingIndex = holidays.findIndex(h => h.date === oldDateToMatch && h.name === oldNameToMatch);
        if(existingIndex > -1){
            updatedHolidays = holidays.map((h, index) => index === existingIndex ? {...holidayData, id: h.id || Date.now()} : h);
        } else { // If not found (e.g. it was a new item being edited before first save), treat as new
             updatedHolidays = [...holidays, { ...holidayData, id: Date.now() }];
        }
    }
    else { // Add new
      updatedHolidays = [...holidays, { ...holidayData, id: Date.now() }];
    }
    updatedHolidays.sort((a,b) => new Date(a.date) - new Date(b.date));
    localStorage.setItem('companyHolidayList', JSON.stringify(updatedHolidays));
    setHolidays(updatedHolidays);
    handleCloseModal();
    speakText(editingHoliday ? "Holiday updated." : "New holiday added.");
  };

  const handleDeleteHoliday = (holidayToDelete) => {
    // For items from INITIAL_HOLIDAYS that might not have an ID yet, match by date and name
    const holidayId = holidayToDelete.id;
    const holidayDate = holidayToDelete.date;
    const holidayName = holidayToDelete.name;

    if (!window.confirm(`Are you sure you want to delete the holiday: ${holidayName} on ${new Date(holidayDate).toLocaleDateString()}?`)) {
      return;
    }

    let updatedHolidays;
    if(holidayId){
        updatedHolidays = holidays.filter(h => h.id !== holidayId);
    } else { // Fallback for items without ID (e.g. from initial constants before getting an ID)
        updatedHolidays = holidays.filter(h => !(h.date === holidayDate && h.name === holidayName));
    }

    localStorage.setItem('companyHolidayList', JSON.stringify(updatedHolidays));
    setHolidays(updatedHolidays);
    speakText("Holiday deleted.");
  };

  // When opening modal for an item from INITIAL_HOLIDAYS that has no ID.
  const prepareEditingHoliday = (holiday) => {
      if (!holiday.id) {
          // Store original values to help find it if date/name changes
          handleOpenModal({...holiday, originalDate: holiday.date, originalName: holiday.name});
      } else {
          handleOpenModal(holiday);
      }
  }

  return (
    <div className="dashboard-container manage-holidays-page fade-in-content">
      <header className="dashboard-header">
        {/* Standard Header */}
        <div className="header-content">
          <div className="logo-and-title"><h1>EmpowerFlow</h1><p>Company Holiday Calendar Management</p></div>
          <div className="header-actions"><ThemeSwitcher /><button onClick={handleLogout} className="logout-button">Logout</button></div>
        </div>
      </header>
      <main className="dashboard-content">
        <div className="page-actions">
            <Link to="/dashboard/hr" className="action-button secondary-action-button">&larr; Back to HR Dashboard</Link>
            <button onClick={() => handleOpenModal()} className="action-button">&#43; Add New Holiday</button>
        </div>

        <h2>Manage Company Holidays</h2>

        <div className="table-responsive-wrapper">
          <table className="holiday-management-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Day</th>
                <th>Holiday Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {holidays.length > 0 ? holidays.map(h => {
                const dateObj = new Date(h.date);
                // Ensure dateObj is valid before calling toLocaleDateString
                const displayDate = !isNaN(dateObj.getTime()) ? dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Invalid Date';
                const dayOfWeek = !isNaN(dateObj.getTime()) ? dateObj.toLocaleDateString('en-US', { weekday: 'long' }) : '';
                return (
                  <tr key={h.id || `${h.date}-${h.name}`}> {/* Fallback key if no ID */}
                    <td>{displayDate}</td>
                    <td>{dayOfWeek}</td>
                    <td>{h.name}</td>
                    <td className="actions-cell">
                      <button onClick={() => prepareEditingHoliday(h)} className="action-btn edit-btn" title="Edit">&#9998;</button>
                      <button onClick={() => handleDeleteHoliday(h)} className="action-btn delete-btn" title="Delete">&#10006;</button>
                    </td>
                  </tr>
                );
              }) : (
                <tr><td colSpan="4">No holidays found. Add some!</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {isModalOpen && <HolidayFormModal holiday={editingHoliday} onSave={handleSaveHoliday} onClose={handleCloseModal} />}
      </main>
      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} EmpowerFlow Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default ManageHolidaysPage;
