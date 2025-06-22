// src/utils/constants.js

export const HOLIDAY_LIST = [
  { date: '2024-01-01', name: 'New Year\'s Day' },
  { date: '2024-01-26', name: 'Republic Day' },
  { date: '2024-03-25', name: 'Holi' },
  { date: '2024-04-09', name: 'Ugadi' },
  { date: '2024-04-11', name: 'Eid-ul-Fitr' },
  { date: '2024-05-01', name: 'May Day / Labour Day' },
  { date: '2024-08-15', name: 'Independence Day' },
  { date: '2024-09-07', name: 'Ganesh Chaturthi' },
  { date: '2024-10-02', name: 'Gandhi Jayanti' },
  { date: '2024-10-31', name: 'Diwali (Deepavali)' },
  { date: '2024-12-25', name: 'Christmas' },
];

export const INITIAL_LEAVE_BALANCES = {
  annual: 12,
  sick: 7,
  casual: 5,
  bereavement: 3,
  workFromHome: 10, // Example of another type
};

export const LEAVE_TYPES = [
  { value: 'annual', label: 'Annual Leave' },
  { value: 'sick', label: 'Sick Leave' },
  { value: 'casual', label: 'Casual Leave' },
  { value: 'bereavement', label: 'Bereavement Leave' },
  { value: 'workFromHome', label: 'Work From Home' },
];

// Could add more constants here as needed, e.g., for task statuses, etc.
// For now, these cover holidays and leave management basics.

export const DUMMY_PAYSLIPS = [
  {
    id: 'payslip_2024_06',
    month: 'June',
    year: 2024,
    grossSalary: 6000,
    totalDeductions: 1200,
    netSalary: 4800,
    fileName: 'Payslip_June_2024.txt', // For simulated download
    details: { // More detailed breakdown for simulated content
      basic: 3000,
      hra: 1500,
      specialAllowance: 1500,
      providentFund: 720,
      professionalTax: 200,
      incomeTax: 280,
    }
  },
  {
    id: 'payslip_2024_05',
    month: 'May',
    year: 2024,
    grossSalary: 5900, // Slight variation
    totalDeductions: 1180,
    netSalary: 4720,
    fileName: 'Payslip_May_2024.txt',
    details: {
      basic: 2950,
      hra: 1475,
      specialAllowance: 1475,
      providentFund: 708,
      professionalTax: 200,
      incomeTax: 272,
    }
  },
  {
    id: 'payslip_2024_04',
    month: 'April',
    year: 2024,
    grossSalary: 5950,
    totalDeductions: 1190,
    netSalary: 4760,
    fileName: 'Payslip_April_2024.txt',
    details: {
      basic: 2975,
      hra: 1487.50,
      specialAllowance: 1487.50,
      providentFund: 714,
      professionalTax: 200,
      incomeTax: 276,
    }
  },
    {
    id: 'payslip_2024_03',
    month: 'March',
    year: 2024,
    grossSalary: 5800,
    totalDeductions: 1160,
    netSalary: 4640,
    fileName: 'Payslip_March_2024.txt',
    details: {
      basic: 2900,
      hra: 1450,
      specialAllowance: 1450,
      providentFund: 696,
      professionalTax: 200,
      incomeTax: 264,
    }
  }
];

export const DUMMY_DOCUMENTS = [
  {
    id: 'doc001',
    title: 'Employee Handbook 2024',
    category: 'HR Policies',
    description: 'Comprehensive guide to company policies, procedures, and employee benefits.',
    uploadDate: '2024-01-15',
    fileName: 'Employee_Handbook_2024.txt',
    simulatedContent: "EmpowerFlow Employee Handbook 2024\n\nSection 1: Introduction\nWelcome to EmpowerFlow!...\n\nSection 2: Code of Conduct...\n\nSection 3: Leave Policy...\n(Full document content would be here)"
  },
  {
    id: 'doc002',
    title: 'IT Security Guidelines',
    category: 'IT Guides',
    description: 'Best practices for maintaining IT security and protecting company data.',
    uploadDate: '2024-02-01',
    fileName: 'IT_Security_Guidelines.txt',
    simulatedContent: "EmpowerFlow IT Security Guidelines\n\n1. Password Policy: Create strong, unique passwords...\n2. Email Security: Beware of phishing attempts...\n3. Data Handling: Classify and protect sensitive information...\n(Full document content would be here)"
  },
  {
    id: 'doc003',
    title: 'Work From Home Policy',
    category: 'HR Policies',
    description: 'Guidelines and requirements for employees working remotely.',
    uploadDate: '2024-03-10',
    fileName: 'WFH_Policy_2024.txt',
    simulatedContent: "EmpowerFlow Work From Home (WFH) Policy\n\nEligibility...\nEquipment...\nCommunication Expectations...\n(Full document content would be here)"
  },
  {
    id: 'doc004',
    title: 'Leave Application Form',
    category: 'Forms',
    description: 'Standard form for applying for all types of leave.',
    uploadDate: '2023-12-20',
    fileName: 'Leave_Application_Form.txt',
    // externalUrl: 'https://www.example.com/sample-leave-form.pdf' // Example of external link
    simulatedContent: "EmpowerFlow Leave Application Form\n\nEmployee Name: __________\nEmployee ID: __________\nLeave Type: __________\nStart Date: __________ End Date: __________\nReason: __________\n(This would typically be a fillable PDF or an online form)"
  },
  {
    id: 'doc005',
    title: 'Performance Review Process',
    category: 'HR Policies',
    description: 'Outline of the annual performance review cycle and expectations.',
    uploadDate: '2024-04-05',
    fileName: 'Performance_Review_Process.txt',
    simulatedContent: "EmpowerFlow Performance Review Process\n\nTimeline...\nGoal Setting...\nSelf-Assessment...\nManager Review...\n(Full document content would be here)"
  },
  {
    id: 'doc006',
    title: 'VPN Setup Guide for Windows',
    category: 'IT Guides',
    description: 'Step-by-step instructions for configuring VPN access on Windows.',
    uploadDate: '2024-05-15',
    fileName: 'VPN_Setup_Windows.txt',
    simulatedContent: "VPN Setup Guide (Windows)\n\n1. Download VPN client from [link]...\n2. Install the client...\n3. Configure server address: vpn.empowerflow.com...\n(Full document content would be here)"
  },
  {
    id: 'doc007',
    title: 'Q3 Company All-Hands Presentation',
    category: 'Company Announcements',
    description: 'Slides from the recent quarterly all-hands meeting.',
    uploadDate: '2024-07-05',
    fileName: 'Q3_All_Hands.txt',
    simulatedContent: "Q3 All-Hands Meeting Slides\n\nSlide 1: Welcome & Agenda\nSlide 2: Q2 Review - Key Achievements\nSlide 3: Q3 Goals & Focus Areas\n(Full presentation content would be here)"
  }
];

export const DOCUMENT_CATEGORIES = [
    { value: 'all', label: 'All Categories' },
    { value: 'HR Policies', label: 'HR Policies' },
    { value: 'IT Guides', label: 'IT Guides' },
    { value: 'Forms', label: 'Forms' },
    { value: 'Company Announcements', label: 'Company Announcements' }
];

export const DUMMY_TEAM_BIRTHDAYS = [
  // Ensure dates are in a format that can be easily parsed and compared for "upcoming"
  // Using YYYY-MM-DD for consistency, but will only use MM-DD for matching upcoming.
  { name: 'Alice Wonderland', birthDate: '1990-07-28', role: 'Designer' },
  { name: 'Bob The Builder', birthDate: '1985-08-05', role: 'Engineer' },
  { name: 'Charlie Brown', birthDate: '1992-07-30', role: 'QA Analyst' },
  { name: 'Diana Prince', birthDate: '1988-08-15', role: 'HR Manager' },
  { name: 'Edward Scissorhands', birthDate: '1995-09-02', role: 'Frontend Dev' },
  { name: 'Fiona Gallagher', birthDate: '1993-01-10', role: 'Backend Dev (Past)' },
  { name: 'Gus Fring', birthDate: (new Date().getFullYear()) + '-' + (new Date().getMonth() + 1).toString().padStart(2,'0') + '-' + (new Date().getDate() + 1).toString().padStart(2,'0'), role: 'Team Lead (Tomorrow!)' }, // Tomorrow's birthday for testing
  { name: 'Harry Potter', birthDate: (new Date().getFullYear()) + '-' + (new Date().getMonth() + 1).toString().padStart(2,'0') + '-' + (new Date().getDate()).toString().padStart(2,'0'), role: 'Wizard (Today!)' }, // Today's birthday
];
