import React, { useState, useEffect } from 'react';
import './OffboardingModal.css'; // We'll create this CSS file

const OFFBOARDING_REASONS = [
    { value: 'resignation_personal', label: 'Resignation - Personal Reasons' },
    { value: 'resignation_better_opportunity', label: 'Resignation - Better Opportunity' },
    { value: 'termination_performance', label: 'Termination - Performance' },
    { value: 'termination_policy_violation', label: 'Termination - Policy Violation' },
    { value: 'contract_end', label: 'Contract End' },
    { value: 'layoff_restructuring', label: 'Layoff / Restructuring' },
    { value: 'other', label: 'Other (Specify)' }
];

function OffboardingModal({ employee, onConfirm, onClose }) {
  const [lastWorkingDate, setLastWorkingDate] = useState('');
  const [reasonForLeaving, setReasonForLeaving] = useState(OFFBOARDING_REASONS[0].value);
  const [reassignReporteesTo, setReassignReporteesTo] = useState('');
  const [notesOnIncompleteTasks, setNotesOnIncompleteTasks] = useState('');
  const [additionalComments, setAdditionalComments] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    // Pre-fill if needed, or set defaults
    const today = new Date().toISOString().split('T')[0];
    setLastWorkingDate(today); // Default to today, HR can change
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    if (!lastWorkingDate || !reasonForLeaving) {
      setFormError('Last Working Date and Reason for Leaving are required.');
      return;
    }
    if (new Date(lastWorkingDate) < new Date(new Date().toISOString().split('T')[0]) ) {
        // Allow LWD to be today, but not past, for initiation.
        // Real system might have more complex rules.
        // setFormError('Last Working Date cannot be in the past for initiation.');
        // return;
        // For now, allowing past date as HR might be back-dating an initiation.
    }

    onConfirm({
      employeeId: employee.id,
      employeeName: employee.name,
      lastWorkingDate,
      reasonForLeaving,
      reasonForLeavingLabel: OFFBOARDING_REASONS.find(r => r.value === reasonForLeaving)?.label,
      reassignReporteesTo: reassignReporteesTo.trim(),
      notesOnIncompleteTasks: notesOnIncompleteTasks.trim(),
      additionalComments: additionalComments.trim(),
    });
  };

  const todayForMinDate = new Date().toISOString().split('T')[0];


  return (
    <div className="modal-backdrop">
      <div className="modal-content offboarding-modal-content">
        <h3>Initiate Offboarding for {employee?.name} ({employee?.id})</h3>
        {formError && <p className="form-message error-message">{formError}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="lastWorkingDate">Last Working Date:</label>
            <input type="date" id="lastWorkingDate" value={lastWorkingDate} onChange={(e) => setLastWorkingDate(e.target.value)} required />
          </div>

          <div className="form-group">
            <label htmlFor="reasonForLeaving">Reason for Leaving:</label>
            <select id="reasonForLeaving" value={reasonForLeaving} onChange={(e) => setReasonForLeaving(e.target.value)} required>
              {OFFBOARDING_REASONS.map(reason => (
                <option key={reason.value} value={reason.value}>{reason.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="reassignReporteesTo">Reassign Direct Reportees To (Manager Name, if applicable):</label>
            <input type="text" id="reassignReporteesTo" value={reassignReporteesTo} onChange={(e) => setReassignReporteesTo(e.target.value)} placeholder="Enter manager's name" />
          </div>

          <div className="form-group">
            <label htmlFor="notesOnIncompleteTasks">Notes on Incomplete Tasks (Optional):</label>
            <textarea id="notesOnIncompleteTasks" value={notesOnIncompleteTasks} onChange={(e) => setNotesOnIncompleteTasks(e.target.value)} rows="3" />
          </div>

          <div className="form-group">
            <label htmlFor="additionalComments">Additional HR Comments (Optional):</label>
            <textarea id="additionalComments" value={additionalComments} onChange={(e) => setAdditionalComments(e.target.value)} rows="3" />
          </div>

          <div className="modal-actions">
            <button type="submit" className="submit-button confirm-offboarding-btn">Confirm Offboarding Initiation</button>
            <button type="button" onClick={onClose} className="cancel-button">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OffboardingModal;
