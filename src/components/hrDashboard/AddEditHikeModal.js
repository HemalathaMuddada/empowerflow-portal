import React, { useState, useEffect } from 'react';
import { DUMMY_TEAM_MEMBERS, INITIAL_MASTER_EMPLOYEE_LIST } from '../../utils/constants'; // Assuming master list is here for employee dropdown
import './AddEditHikeModal.css';

function AddEditHikeModal({ hike, onSave, onClose, masterEmployeeList }) {
  const [employeeId, setEmployeeId] = useState('');
  const [hikePercentage, setHikePercentage] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [previousGrossSalary, setPreviousGrossSalary] = useState('');
  const [newGrossSalary, setNewGrossSalary] = useState('');
  const [hrNotes, setHrNotes] = useState('');
  const [formError, setFormError] = useState('');

  // Get employee list for dropdown (can be passed as prop or fetched if more complex)
  const employees = masterEmployeeList || INITIAL_MASTER_EMPLOYEE_LIST;


  useEffect(() => {
    if (hike) {
      setEmployeeId(hike.employeeId || '');
      setHikePercentage(hike.hikePercentage ? parseFloat(hike.hikePercentage) : ''); // Store as number for input
      setEffectiveDate(hike.effectiveDate || '');
      setPreviousGrossSalary(hike.previousGrossSalary || '');
      setNewGrossSalary(hike.newGrossSalary || '');
      setHrNotes(hike.hrNotes || '');
    } else {
      // Defaults for new hike
      setEmployeeId(employees[0]?.id || ''); // Default to first employee or empty
      setHikePercentage('');
      setEffectiveDate(new Date().toISOString().split('T')[0]); // Default to today
      setPreviousGrossSalary('');
      setNewGrossSalary('');
      setHrNotes('');
    }
  }, [hike, employees]);

  useEffect(() => {
      // Auto-fill previous salary if employee selected and data exists
      if (employeeId && !hike) { // Only on add mode or if previous salary is not set
          const selectedEmp = employees.find(emp => emp.id === employeeId);
          if (selectedEmp && selectedEmp.compensation?.currentGross) {
              setPreviousGrossSalary(selectedEmp.compensation.currentGross);
          } else {
              setPreviousGrossSalary(''); // Clear if no data
          }
      }
      // If editing, previousGrossSalary is already set from 'hike' prop
  }, [employeeId, employees, hike]);


  useEffect(() => {
    // Auto-calculate New Gross Salary
    if (previousGrossSalary && hikePercentage) {
      const prev = parseFloat(previousGrossSalary);
      const perc = parseFloat(hikePercentage);
      if (!isNaN(prev) && !isNaN(perc) && perc > 0) {
        const newGross = prev * (1 + perc / 100);
        setNewGrossSalary(newGross.toFixed(2));
      } else {
        setNewGrossSalary(''); // Clear if inputs are not valid numbers
      }
    } else if (!hikePercentage) { // If percentage is cleared, clear new salary
        setNewGrossSalary('');
    }
  }, [previousGrossSalary, hikePercentage]);


  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    if (!employeeId || !hikePercentage || !effectiveDate || !previousGrossSalary || !newGrossSalary) {
      setFormError('Employee, Hike Percentage, Effective Date, Previous and New Gross Salary are required.');
      return;
    }
    const perc = parseFloat(hikePercentage);
    const prev = parseFloat(previousGrossSalary);
    const newS = parseFloat(newGrossSalary);

    if (isNaN(perc) || perc <= 0) {
        setFormError('Hike Percentage must be a positive number.'); return;
    }
    if (isNaN(prev) || prev <= 0) {
        setFormError('Previous Gross Salary must be a positive number.'); return;
    }
     if (isNaN(newS) || newS <= prev) { // New salary must be greater than previous
        setFormError('New Gross Salary must be greater than Previous Gross Salary.'); return;
    }


    const employee = employees.find(emp => emp.id === employeeId);

    onSave({
      ...(hike || {}), // Preserve ID and other fields if editing
      employeeId,
      employeeName: employee ? employee.name : 'N/A',
      hikePercentage: `${perc}%`, // Store with %
      effectiveDate,
      previousGrossSalary: prev,
      newGrossSalary: newS,
      hrNotes: hrNotes.trim(),
    });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="modal-backdrop">
      <div className="modal-content add-edit-hike-modal-content">
        <h3>{hike ? 'Edit Hike Record' : 'Add New Hike Record'}</h3>
        {formError && <p className="form-message error-message">{formError}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="employeeId">Employee:</label>
            <select id="employeeId" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} required disabled={!!hike}> {/* Disable if editing */}
              <option value="">-- Select Employee --</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name} ({emp.id})</option>
              ))}
            </select>
            {hike && <p className="form-hint"><small>Employee cannot be changed for an existing record.</small></p>}
          </div>

          <div className="form-row">
            <div className="form-group">
                <label htmlFor="previousGrossSalary">Previous Gross Salary ($):</label>
                <input type="number" id="previousGrossSalary" value={previousGrossSalary}
                       onChange={(e) => setPreviousGrossSalary(e.target.value)}
                       placeholder="Auto-filled or enter" step="0.01" required
                       disabled={!hike && employees.find(emp => emp.id === employeeId)?.compensation?.currentGross} // Disable if auto-filled for new hike
                />
            </div>
            <div className="form-group">
                <label htmlFor="hikePercentage">Hike Percentage (%):</label>
                <input type="number" id="hikePercentage" value={hikePercentage} onChange={(e) => setHikePercentage(e.target.value)} placeholder="e.g., 10" step="0.1" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
                <label htmlFor="newGrossSalary">New Gross Salary ($):</label>
                <input type="number" id="newGrossSalary" value={newGrossSalary} onChange={(e) => setNewGrossSalary(e.target.value)} placeholder="Auto-calculated or enter" step="0.01" required />
            </div>
            <div className="form-group">
                <label htmlFor="effectiveDate">Effective Date:</label>
                <input type="date" id="effectiveDate" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} min={hike?.effectiveDate && hike.effectiveDate < today ? hike.effectiveDate : today} required />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="hrNotes">HR Notes (Optional):</label>
            <textarea id="hrNotes" value={hrNotes} onChange={(e) => setHrNotes(e.target.value)} rows="3" />
          </div>

          <div className="modal-actions">
            <button type="submit" className="submit-button">{hike ? 'Save Changes' : 'Add Hike Record'}</button>
            <button type="button" onClick={onClose} className="cancel-button">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEditHikeModal;
