import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function TeacherDashboard({ onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const teacher = location.state?.teacher;

  const [activeSection, setActiveSection] = useState('dashboard');

  if (!teacher) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning" role="alert">
          No teacher info found. Please login.
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Default logout: redirect to login page
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <nav
        className="d-flex flex-column flex-shrink-0 p-3 bg-light"
        style={{ width: '250px' }}
        aria-label="Teacher dashboard sidebar"
      >
        <a
          href="#"
          className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none"
          onClick={() => setActiveSection('dashboard')}
        >
          <span className="fs-4 fw-bold">Teacher Dashboard</span>
        </a>
        <hr />
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <button
              className={`nav-link btn btn-link text-start ${
                activeSection === 'dashboard' ? 'active' : 'text-dark'
              }`}
              onClick={() => setActiveSection('dashboard')}
              aria-current={activeSection === 'dashboard' ? 'page' : undefined}
            >
              Dashboard
            </button>
          </li>
          <li>
            <button
              className={`nav-link btn btn-link text-start ${
                activeSection === 'profile' ? 'active' : 'text-dark'
              }`}
              onClick={() => setActiveSection('profile')}
            >
              Profile
            </button>
          </li>
          <li>
            <button className="nav-link btn btn-link text-start text-danger" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="flex-grow-1 p-4">
        {activeSection === 'dashboard' && (
          <>
            <h2>Welcome, {teacher.teacher_name}!</h2>
            <p>This is your dashboard overview.</p>
            {/* Add any dashboard widgets or info here */}
          </>
        )}

        {activeSection === 'profile' && (
          <div className="card shadow-sm" style={{ maxWidth: '600px' }}>
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Profile Information</h4>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <strong>Teacher ID:</strong> {teacher.teacher_id}
                </li>
                <li className="list-group-item">
                  <strong>Name:</strong> {teacher.teacher_name}
                </li>
                <li className="list-group-item">
                  <strong>Email:</strong> {teacher.email}
                </li>
                <li className="list-group-item">
                  <strong>Phone:</strong> {teacher.phone_number}
                </li>
                <li className="list-group-item">
                  <strong>Department ID:</strong> {teacher.department_id}
                </li>
                <li className="list-group-item">
                  <strong>Subject ID:</strong> {teacher.subject_id}
                </li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default TeacherDashboard;
