import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
// Import placeholder dashboard components - we'll create these soon
// For now, let's assume they will exist in src/pages/dashboards/
import EmployeeDashboard from './pages/dashboards/EmployeeDashboard';
import ManagerDashboard from './pages/dashboards/ManagerDashboard';
import LeadDashboard from './pages/dashboards/LeadDashboard';
import HRDashboard from './pages/dashboards/HRDashboard';
import SuperAdminDashboard from './pages/dashboards/SuperAdminDashboard';
// Employee specific sub-pages
import LeaveManagementPage from './pages/dashboards/employee/LeaveManagementPage';
import HolidayListPage from './pages/dashboards/employee/HolidayListPage';
import PayslipListPage from './pages/dashboards/employee/PayslipListPage';
import AttendanceLogPage from './pages/dashboards/employee/AttendanceLogPage';
import WorkStatusReportPage from './pages/dashboards/employee/WorkStatusReportPage';
import RaiseConcernPage from './pages/dashboards/employee/RaiseConcernPage';
import DocumentCenterPage from './pages/dashboards/employee/DocumentCenterPage';
import HikeInfoPage from './pages/dashboards/employee/HikeInfoPage';
import TaskManagementPage from './pages/dashboards/employee/TaskManagementPage';
import DeclarationsPage from './pages/dashboards/employee/DeclarationsPage';
import PerformanceReviewPage from './pages/dashboards/employee/PerformanceReviewPage';
import AttendanceRegularizationPage from './pages/dashboards/employee/AttendanceRegularizationPage';
import { initializeDummyPendingRequests } from './utils/constants'; // For Lead testing
// Lead Portal Pages
import TeamApprovalsPage from './pages/dashboards/lead/TeamApprovalsPage';
import TeamTaskManagementPage from './pages/dashboards/lead/TeamTaskManagementPage';
import TeamCompensationPage from './pages/dashboards/lead/TeamCompensationPage'; // New


import './App.css';

// Simple placeholder components for dashboards until they are created
// const EmployeeDashboard = () => <div>Employee Dashboard Placeholder</div>;
// const ManagerDashboard = () => <div>Manager Dashboard Placeholder</div>;
// const LeadDashboard = () => <div>Lead Dashboard Placeholder</div>;
// const HRDashboard = () => <div>HR Dashboard Placeholder</div>;
// const SuperAdminDashboard = () => <div>SuperAdmin Dashboard Placeholder</div>;


// Initialize dummy data for lead portal testing if not already present
initializeDummyPendingRequests();

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Dashboard Routes - these will be protected later */}
          {/* Main Employee Dashboard */}
          <Route path="/dashboard/employee" element={<EmployeeDashboard />} />
            {/* Employee Sub-Routes */}
            <Route path="/dashboard/employee/leave" element={<LeaveManagementPage />} />
            <Route path="/dashboard/employee/holidays" element={<HolidayListPage />} />
            <Route path="/dashboard/employee/payslips" element={<PayslipListPage />} />
            <Route path="/dashboard/employee/attendance" element={<AttendanceLogPage />} />
            <Route path="/dashboard/employee/work-status-report" element={<WorkStatusReportPage />} />
            <Route path="/dashboard/employee/raise-concern" element={<RaiseConcernPage />} />
            <Route path="/dashboard/employee/documents" element={<DocumentCenterPage />} />
            <Route path="/dashboard/employee/hike-info" element={<HikeInfoPage />} />
            <Route path="/dashboard/employee/tasks" element={<TaskManagementPage />} />
            <Route path="/dashboard/employee/declarations" element={<DeclarationsPage />} />
            <Route path="/dashboard/employee/performance-review" element={<PerformanceReviewPage />} />
            <Route path="/dashboard/employee/attendance-regularization" element={<AttendanceRegularizationPage />} />
            {/* Future employee sub-routes can be added here:
            */}

          {/* Lead Dashboard and Sub-Routes */}
          <Route path="/dashboard/lead" element={<LeadDashboard />} />
            <Route path="/dashboard/lead/approvals" element={<TeamApprovalsPage />} />
            <Route path="/dashboard/lead/team-tasks" element={<TeamTaskManagementPage />} />
            <Route path="/dashboard/lead/team-compensation" element={<TeamCompensationPage />} />
            {/* Future lead sub-routes can be added here */}

          <Route path="/dashboard/manager" element={<ManagerDashboard />} />
          <Route path="/dashboard/hr" element={<HRDashboard />} />
          <Route path="/dashboard/superadmin" element={<SuperAdminDashboard />} />

          {/* Default redirect to login page */}
          <Route path="/" element={<Navigate replace to="/login" />} />

          {/* Catch-all for undefined routes - optional */}
          <Route path="*" element={<Navigate replace to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
