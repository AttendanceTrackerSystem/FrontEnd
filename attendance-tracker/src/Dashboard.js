import React from 'react';
import Navbar from './components/NavBar'; 
import ContactUs from'./ContactUs';
import AboutUs from './AboutUs';
import 'bootstrap/dist/css/bootstrap.min.css';

function Dashboard() {
  return (
    <>
      <Navbar />

      <section className="text-center py-5 bg-light">
        <div className="container">
          <h1 className="display-4 fw-bold mb-4">
            Welcome to University Attendance Platform
          </h1>
          <p className="lead text-muted mb-5">
            Manage attendance efficiently and effectively.
          </p>
          <div>
            <a href="/student-login" className="btn btn-primary btn-lg me-3">
              Student Login
            </a>
            <a href="/teacher-login" className="btn btn-secondary btn-lg">
              Teacher Login
            </a>
          </div>
        </div>
      </section>
<AboutUs/>
      <ContactUs/>
    </>
  );
}

export default Dashboard;
