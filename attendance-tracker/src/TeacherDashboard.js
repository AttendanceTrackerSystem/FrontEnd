import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function TeacherDashboard() {
  const location = useLocation();
  const teacher = location.state?.teacher;

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [absentStudents, setAbsentStudents] = useState([]);
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    if (teacher?.teacher_id) {
      axios
        .get(`http://localhost:8000/api/teacher/classes?teacher_id=${teacher.teacher_id}`)
        .then(res => setClasses(res.data))
        .catch(err => console.error(err));
    }
  }, [teacher]);

  const fetchAttendanceData = (classId) => {
    setSelectedClass(classId);
    axios
      .get(`http://localhost:8000/api/teacher/class/${classId}/attendance-count`)
      .then(res => setAttendanceCount(res.data.present_count))
      .catch(err => setAttendanceCount(0));

    axios
      .get(`http://localhost:8000/api/teacher/class/${classId}/absent-students`)
      .then(res => setAbsentStudents(res.data))
      .catch(err => {
        console.error(err);
        setAbsentStudents([]);
      });
  };

  const handleLogout = () => {
    alert('Logout clicked'); 
  };

  if (!teacher) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning" role="alert">
          No teacher info found. Please login.
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <nav className="d-flex flex-column flex-shrink-0 p-3 bg-light" style={{ width: '220px' }}>
        <span className="fs-4 fw-bold mb-4">Teacher Panel</span>
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <button
              className={`nav-link btn btn-link text-start ${
                activeSection === 'dashboard' ? 'active' : 'text-dark'
              }`}
              onClick={() => setActiveSection('dashboard')}
            >
              Dashboard
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link btn btn-link text-start ${
                activeSection === 'profile' ? 'active' : 'text-dark'
              }`}
              onClick={() => setActiveSection('profile')}
            >
              Profile
            </button>
          </li>
          <li className="nav-item mt-auto">
            <button
              className="nav-link btn btn-link text-start text-danger"
              onClick={handleLogout}
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
      <main className="flex-grow-1 p-4">
        {activeSection === 'dashboard' && (
          <>
            <h2>Welcome, {teacher.teacher_name}!</h2>

            <div className="card mt-4" style={{ maxWidth: '600px' }}>
              <div className="card-header bg-primary text-white">Mark Attendance</div>
              <div className="card-body">
                <select
                  className="form-select mb-3"
                  value={selectedClass}
                  onChange={e => fetchAttendanceData(e.target.value)}
                >
                  <option value="">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.class_name} - {cls.subject}
                    </option>
                  ))}
                </select>

                {selectedClass && (
                  <>
                    <div>
                      <strong>Students Present:</strong> {attendanceCount}
                    </div>

                    <div className="mt-3">
                       <strong>Absent Students: {absentStudents.length}</strong>
                        {absentStudents.length > 0 ? (
                       <ul className="list-group mt-2">
                       {absentStudents.map(student => (
                       <li key={student.student_number} className="list-group-item">
                       {student.full_name} ({student.student_number})
                       </li>
                       ))}
                          </ul>
                       ) : (
                       <p>No absent students found.</p>
                    )}
                 </div>
                 <div>
  <strong>Attendance Percentage:</strong>{' '}
  {(attendanceCount + absentStudents.length) > 0
    ? ((attendanceCount / (attendanceCount + absentStudents.length)) * 100).toFixed(2) + '%'
    : 'N/A'}
</div>


                  </>
                )}
              </div>
            </div>
          </>
        )}

        {activeSection === 'profile' && (
          <div className="card" style={{ maxWidth: '600px' }}>
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Profile</h4>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                <li className="list-group-item"><strong>ID:</strong> {teacher.teacher_id}</li>
                <li className="list-group-item"><strong>Name:</strong> {teacher.teacher_name}</li>
                <li className="list-group-item"><strong>Email:</strong> {teacher.email}</li>
                <li className="list-group-item"><strong>Phone:</strong> {teacher.phone_number}</li>
                <li className="list-group-item"><strong>Department ID:</strong> {teacher.department_id}</li>
                <li className="list-group-item"><strong>Subject ID:</strong> {teacher.subject_id}</li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default TeacherDashboard;
