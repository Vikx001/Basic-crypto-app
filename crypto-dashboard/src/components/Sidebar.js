import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`Sidebar ${isOpen ? 'open' : ''}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isOpen ? '<' : '>'}
      </button>
      <ul>
        <li onClick={() => onSelect('analyze')}>Analyze the Coins</li>
        <li onClick={() => onSelect('history')}>History of the Coins</li>
        <li onClick={() => onSelect('resources')}>Best Resources to Read</li>
      </ul>
    </div>
  );
};

export default Sidebar;
