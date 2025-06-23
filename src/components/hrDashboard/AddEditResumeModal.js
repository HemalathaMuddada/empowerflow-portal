import React, { useState, useEffect } from 'react';
import { CANDIDATE_STATUSES } from '../../utils/constants';
// Assuming global modal CSS or adapt from other modals like AddEditDocumentModal.css
import './AddEditResumeModal.css';

function AddEditResumeModal({ resume, onSave, onClose }) {
  const [candidateName, setCandidateName] = useState('');
  const [roleAppliedFor, setRoleAppliedFor] = useState('');
  const [resumeLink, setResumeLink] = useState('');
  const [source, setSource] = useState('');
  const [status, setStatus] = useState(CANDIDATE_STATUSES[0].value);
  const [hrNotes, setHrNotes] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (resume) {
      setCandidateName(resume.candidateName || '');
      setRoleAppliedFor(resume.roleAppliedFor || '');
      setResumeLink(resume.resumeLink || '');
      setSource(resume.source || '');
      setStatus(resume.status || CANDIDATE_STATUSES[0].value);
      setHrNotes(resume.hrNotes || '');
    } else {
      // Defaults for new resume
      setCandidateName('');
      setRoleAppliedFor('');
      setResumeLink('');
      setSource('');
      setStatus(CANDIDATE_STATUSES[0].value);
      setHrNotes('');
    }
  }, [resume]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    if (!candidateName.trim() || !roleAppliedFor.trim() || !resumeLink.trim()) {
      setFormError('Candidate Name, Role Applied For, and Resume Link are required.');
      return;
    }
    try {
      new URL(resumeLink); // Validate URL format
    } catch (_) {
      setFormError('Please enter a valid URL for the Resume Link (e.g., http://example.com/resume.pdf).');
      return;
    }

    onSave({
      ...(resume || {}), // Preserve ID and other fields if editing
      candidateName: candidateName.trim(),
      roleAppliedFor: roleAppliedFor.trim(),
      resumeLink: resumeLink.trim(),
      source: source.trim(),
      status,
      hrNotes: hrNotes.trim(),
      // submissionDate will be set/updated in ManageResumesPage onSave
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content add-edit-resume-modal-content">
        <h3>{resume ? 'Edit Candidate Resume' : 'Add New Candidate Resume'}</h3>
        {formError && <p className="form-message error-message">{formError}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="candidateName">Candidate Name:</label>
            <input type="text" id="candidateName" value={candidateName} onChange={(e) => setCandidateName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="roleAppliedFor">Role Applied For:</label>
            <input type="text" id="roleAppliedFor" value={roleAppliedFor} onChange={(e) => setRoleAppliedFor(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="resumeLink">Resume Link (URL):</label>
            <input type="url" id="resumeLink" value={resumeLink} onChange={(e) => setResumeLink(e.target.value)} placeholder="e.g., https://linkedin.com/in/user or https://example.com/resume.pdf" required />
          </div>
          <div className="form-row">
            <div className="form-group">
                <label htmlFor="source">Source (Optional):</label>
                <input type="text" id="source" value={source} onChange={(e) => setSource(e.target.value)} placeholder="e.g., LinkedIn, Referral, Careers Page" />
            </div>
            <div className="form-group">
                <label htmlFor="status">Status:</label>
                <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} required>
                {CANDIDATE_STATUSES.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                ))}
                </select>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="hrNotes">HR Notes (Optional):</label>
            <textarea id="hrNotes" value={hrNotes} onChange={(e) => setHrNotes(e.target.value)} rows="3" />
          </div>

          <div className="modal-actions">
            <button type="submit" className="submit-button">{resume ? 'Save Changes' : 'Add Resume'}</button>
            <button type="button" onClick={onClose} className="cancel-button">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEditResumeModal;
