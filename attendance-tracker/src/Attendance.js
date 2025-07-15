import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';

function Attendance() {
  const location = useLocation();
  const navigate = useNavigate();
  const student = location.state?.student;

  const [activeSection, setActiveSection] = useState('profile');
  const [departmentName, setDepartmentName] = useState('');

  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [teacherList, setTeacherList] = useState([]);
  const [classes, setClasses] = useState([]);

  // Fetch student's department name
  useEffect(() => {
    if (student?.department_id) {
      fetch(`http://127.0.0.1:8000/api/departments/${student.department_id}`)
        .then(res => res.json())
        .then(data => setDepartmentName(data.name))
        .catch(err => console.error('Error fetching department:', err));
    }
  }, [student]);

  // Load all departments
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/departments')
      .then(res => res.json())
      .then(data => setDepartments(data))
      .catch(err => console.error('Error loading departments:', err));
  }, []);

  // Load subjects when department selected
  useEffect(() => {
    if (selectedDepartment) {
      fetch(`http://127.0.0.1:8000/api/departments/${selectedDepartment}/subjects`)
        .then(res => res.json())
        .then(data => setSubjects(data))
        .catch(err => console.error('Error loading subjects:', err));
    } else {
      setSubjects([]);
      setSelectedSubject('');
      setTeacherList([]);
      setClasses([]);
    }
  }, [selectedDepartment]);

  // Fetch teachers and classes when department and subject selected
  useEffect(() => {
    if (selectedDepartment && selectedSubject) {
      // Fetch teacher list
      fetch(`http://127.0.0.1:8000/api/teachers?department_id=${selectedDepartment}&subject_id=${selectedSubject}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setTeacherList(data);
          else setTeacherList([]);
        })
        .catch(err => {
          console.error('Error fetching teacher details:', err);
          setTeacherList([]);
        });

      // Fetch classes list
      fetch(`http://127.0.0.1:8000/api/classes?department_id=${selectedDepartment}&subject_id=${selectedSubject}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setClasses(data);
          else setClasses([]);
        })
        .catch(err => {
          console.error('Error fetching classes:', err);
          setClasses([]);
        });
    } else {
      setTeacherList([]);
      setClasses([]);
    }
  }, [selectedDepartment, selectedSubject]);

  const handleLogout = () => navigate('/');

  if (!student) {
    return (
      <div className="alert alert-danger m-3">
        No student data found. Please login again.
      </div>
    );
  }

  return (
    <div className="d-flex">
      <Sidebar onChangeSection={setActiveSection} onLogout={handleLogout} />

      <div className="flex-grow-1 ms-5 ps-4 pe-4">
        <div className="container my-5">

          {/* Student Profile */}
          {activeSection === 'profile' && (
            <div className="card shadow rounded-4 border-0 w-100" style={{ maxWidth: 600 }}>
              <div className="card-header bg-info text-white rounded-top-4 py-3 d-flex align-items-center">
                <h4 className="mb-0 me-3">
                  <i className="bi bi-person-circle"></i> Student Profile
                </h4>
                {departmentName && (
                  <span className="badge bg-primary ms-auto fs-6">
                    Department: {departmentName}
                  </span>
                )}
              </div>
              <div className="card-body fs-6">
                <ul className="list-unstyled">
                  <li className="mb-3"><strong>Student Number:</strong> <span className="text-secondary">{student.student_number}</span></li>
                  <li className="mb-3"><strong>Full Name:</strong> <span className="text-secondary">{student.full_name}</span></li>
                  <li className="mb-3"><strong>Email:</strong> <span className="text-secondary">{student.email}</span></li>
                </ul>
              </div>
            </div>
          )}

          {/* Attendance Section */}
          {activeSection === 'attendance' && (
            <div className="card shadow-sm rounded-4 border-0 w-100">
              <div className="card-header bg-primary text-white rounded-top-4 py-3">
                <h4 className="mb-0">View Subject, Teacher & Classes Details</h4>
              </div>
              <div className="card-body">
                {/* Department */}
                <div className="mb-4">
                  <label className="form-label fw-bold">Select Department</label>
                  <select
                    className="form-select"
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                  >
                    <option value="">-- Select Department --</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>

                {/* Subject */}
                {subjects.length > 0 && (
                  <div className="mb-4">
                    <label className="form-label fw-bold">Select Subject</label>
                    <select
                      className="form-select"
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                    >
                      <option value="">-- Select Subject --</option>
                      {subjects.map(subj => (
                        <option key={subj.id} value={subj.id}>{subj.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Teacher List (display once) */}
                {teacherList.length > 0 ? (
                  <div className="mt-4">
                    <h5 className="fw-bold mb-3">Teacher Details</h5>
                    {teacherList.map((teacher) => (
                      <div key={teacher.teacher_id} className="card mb-3 shadow-sm">
                        <div className="card-body">
                          <p><strong>Name:</strong> {teacher.teacher_name}</p>
                          <p><strong>Email:</strong> {teacher.email}</p>
                          <p><strong>Phone:</strong> {teacher.phone_number}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : selectedSubject ? (
                  <p className="text-warning mt-3">No teacher assigned to this subject.</p>
                ) : null}

                {/* Classes List (no repeated teacher info except name) */}
                {classes.length > 0 ? (
                  <div className="mt-4">
                    <h5 className="fw-bold mb-3">Classes Details</h5>
                    {classes.map(cls => (
                      <div key={cls.id} className="card mb-3 shadow-sm">
                        <div className="card-body">
                          <p><strong>Class Name:</strong> {cls.class_name} ({cls.week})</p>
                          <p><strong>Date:</strong> {cls.date} ({cls.day})</p>
                          <p><strong>Time:</strong> {cls.start_time} - {cls.end_time}</p>
                          <p><strong>Hall:</strong> {cls.hall_number}</p>
                          <p><strong>Description:</strong> {cls.description}</p>
                          <p><strong>Teacher:</strong> {cls.teacher.teacher_name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : selectedSubject ? (
                  <p className="text-warning mt-3">No classes found for this subject.</p>
                ) : null}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Attendance;
