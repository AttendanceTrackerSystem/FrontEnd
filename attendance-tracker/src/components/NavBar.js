import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container d-flex align-items-center">
        
        <div style={{ flex: 1 }}>
          <a className="navbar-brand fw-bold text-primary" href="#home">
            Home
          </a>
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <a className="nav-link d-inline-block mx-3" href="/about-us">
            About Us
          </a>
          <a className="nav-link d-inline-block mx-3" href="/contact-us">
            Contact Us
          </a>
        </div>
        <div style={{ flex: 1, textAlign: 'right' }}>
          <a href="/student-login" className="btn btn-outline-primary me-2">
            Student Login
          </a>
          <a href="/teacher-login" className="btn btn-outline-primary">
            Teacher Login
          </a>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
