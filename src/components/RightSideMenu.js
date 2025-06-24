import React from 'react';
import { Link } from 'react-router-dom';
import './RightSideMenu.css';

const RightSideMenu = ({ title, menuItems }) => {
  if (!menuItems || menuItems.length === 0) {
    return null;
  }

  return (
    <nav className="right-side-menu dashboard-card">
      {title && <h3 className="right-side-menu-title">{title}</h3>}
      <ul className="right-side-menu-list">
        {menuItems.map((item, index) => (
          <li key={index} className="right-side-menu-item">
            {item.path ? (
              <Link to={item.path} className="nav-link">
                {item.label}
              </Link>
            ) : (
              <span className="nav-link-placeholder">{item.label}</span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default RightSideMenu;
