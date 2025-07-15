import React from 'react';
import '../css/Sidebar.css'; // We'll create this next


function Sidebar({ activeSection, onChangeSection, onLogout }) {
  const menuItems = [
    { key: 'profile', label: 'Profile', icon: 'bi-person-fill' },
    { key: 'attendance', label: 'Mark Attendance', icon: 'bi-check2-square' },
    { key: 'classes', label: 'View Classes', icon: 'bi-easel' },
    { key: 'myAttendance', label: 'My Attendance', icon: 'bi-clipboard-data' },
  ];

  return (
    <div className="sidebar bg-white border-end">
      <h5 className="text-primary fw-bold mb-4">Student Menu</h5>
      <ul className="list-unstyled flex-grow-1">
        {menuItems.map((item) => (
          <li
            key={item.key}
            className={`menu-item ${activeSection === item.key ? 'active' : ''}`}
            onClick={() => onChangeSection(item.key)}
          >
            <i className={`bi ${item.icon} me-2`}></i>
            {item.label}
          </li>
        ))}
      </ul>

      <button onClick={onLogout} className="btn btn-outline-danger mt-auto w-100">
        <i className="bi bi-box-arrow-right me-2"></i> Logout
      </button>
    </div>
  );
}

export default Sidebar;
