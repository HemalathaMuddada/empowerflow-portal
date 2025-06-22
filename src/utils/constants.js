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
