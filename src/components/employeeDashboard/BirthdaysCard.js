import React, { useState, useEffect } from 'react';
import { DUMMY_TEAM_BIRTHDAYS } from '../../utils/constants';
import { speakText } from '../../utils/speech'; // Optional: for "Send Wishes"
// import './BirthdaysCard.css'; // If specific styles beyond .dashboard-card are needed

const BirthdaysCard = ({ upcomingDays = 7, maxDisplay = 3 }) => {
  const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to start of day

    const nextWeekLimit = new Date(today);
    nextWeekLimit.setDate(today.getDate() + upcomingDays);

    const filteredBirthdays = DUMMY_TEAM_BIRTHDAYS
      .map(person => {
        const birthDateParts = person.birthDate.split('-'); // YYYY-MM-DD
        // Create a date object for this year's birthday
        const currentYearBirthday = new Date(today.getFullYear(), parseInt(birthDateParts[1]) - 1, parseInt(birthDateParts[2]));
        currentYearBirthday.setHours(0,0,0,0);

        // If this year's birthday has passed, check next year's birthday
        if (currentYearBirthday < today) {
          currentYearBirthday.setFullYear(today.getFullYear() + 1);
        }
        return { ...person, currentYearBirthday };
      })
      .filter(person => person.currentYearBirthday >= today && person.currentYearBirthday <= nextWeekLimit)
      .sort((a, b) => a.currentYearBirthday - b.currentYearBirthday) // Sort by upcoming date
      .slice(0, maxDisplay); // Limit to maxDisplay

    setUpcomingBirthdays(filteredBirthdays);
  }, [upcomingDays, maxDisplay]);

  const handleSendWishes = (name) => {
    const message = `Happy Birthday, ${name}! Best wishes from the team. (Simulated)`;
    console.log(message); // Simulate sending wishes
    speakText(`Wishes sent to ${name}.`); // Optional voice feedback
    alert(message); // Simple UI feedback
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  };

  return (
    <div className="dashboard-card birthdays-card">
      <h3>Upcoming Birthdays</h3>
      {upcomingBirthdays.length > 0 ? (
        <ul>
          {upcomingBirthdays.map(person => (
            <li key={person.name}>
              <div className="birthday-info">
                <strong>{person.name}</strong> ({person.role})
                <br />
                <span className="birthday-date">Turns a year older on: {formatDate(person.currentYearBirthday)}</span>
              </div>
              <button
                onClick={() => handleSendWishes(person.name)}
                className="send-wishes-button"
                title={`Send birthday wishes to ${person.name}`}
              >
                🎉 Send Wishes
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No birthdays in the team for the next {upcomingDays} days.</p>
      )}
    </div>
  );
};

export default BirthdaysCard;
