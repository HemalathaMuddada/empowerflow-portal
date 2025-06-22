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
