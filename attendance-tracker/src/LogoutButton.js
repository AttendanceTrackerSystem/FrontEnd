import React from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any localStorage/session (if used)
    localStorage.clear();
    navigate('/login');
  };

  return (
    <button className="btn btn-outline-danger w-100 mt-3" onClick={handleLogout}>
      Logout
    </button>
  );
}

export default LogoutButton;
