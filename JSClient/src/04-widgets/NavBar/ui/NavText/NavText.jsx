import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './NavText.css';

export const NavText = ({ Navigate, Text, SubItems }) => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  const toggleSubMenu = () => {
    setIsSubMenuOpen(!isSubMenuOpen);
  };

  return (
    <div 
      className="nav-text"
      onMouseEnter={toggleSubMenu} // Открывать подпункты при наведении
      onMouseLeave={toggleSubMenu} // Закрывать при выходе мыши
    >
      <Link to={Navigate} className="main-item">
        {Text.toLocaleUpperCase()}
      </Link>
      {SubItems && SubItems.length > 0 && (
        <div className={`sub-menu ${isSubMenuOpen ? 'open' : ''}`}>
          {SubItems.map((subItem, index) => (
            <Link key={index} to={subItem.Navigate} className="sub-item">
              {subItem.Text.toLocaleUpperCase()}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
