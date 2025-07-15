import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from './Dashboard';
import StudentLogin from './StudentLogin';
import TeacherLogin from './TeacherLogin';
import AboutUs from './AboutUs'
import ContactUs from './ContactUs';
import Attendance from './Attendance';
import TeacherDashboard from './TeacherDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/teacher-login" element={<TeacherLogin />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
         <Route path="/attendance" element={<Attendance />} />
                 <Route path="/teacherdashboard" element={<TeacherDashboard />} />

      </Routes>
    </Router>
  );
}

export default App;

