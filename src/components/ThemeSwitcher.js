import React, { useEffect, useState } from 'react';
import './ThemeSwitcher.css';

const THEMES = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'corporate-blue', label: 'Corporate' },
];

function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState(localStorage.getItem('appTheme') || 'light');

  useEffect(() => {
    document.body.setAttribute('data-theme', currentTheme);
    localStorage.setItem('appTheme', currentTheme);
  }, [currentTheme]);

  const handleThemeChange = (event) => {
    setCurrentTheme(event.target.value);
  };

  return (
    <div className="theme-switcher">
      <label htmlFor="theme-select" className="theme-switcher-label">Theme:</label>
      <select id="theme-select" value={currentTheme} onChange={handleThemeChange} className="theme-switcher-select">
        {THEMES.map(theme => (
          <option key={theme.value} value={theme.value}>
            {theme.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ThemeSwitcher;
