import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';

function Attendance() {
  const location = useLocation();
  const navigate = useNavigate();
  const student = location.state?.student;

  const [activeSection, setActiveSection] = useState('profile');
  const [subjects, setSubjects] = useState([
    { id: 1, name: 'Mathematics', attendance: '' },
    { id: 2, name: 'Physics', attendance: '' },
    { id: 3, name: 'English', attendance: '' },
  ]);
  const [message, setMessage] = useState('');

  const [departments, setDepartments] = useState([]);
  const [deptSubjects, setDeptSubjects] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/departments')
      .then((res) => res.json())
      .then((data) => setDepartments(data))
      .catch((err) => console.error('Failed to fetch departments', err));
  }, []);

  const handleAttendanceChange = (subjectId, value) => {
    setSubjects((prev) =>
      prev.map((subj) =>
        subj.id === subjectId ? { ...subj, attendance: value } : subj
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (subjects.some((s) => s.attendance === '')) {
      setMessage('Please mark attendance for all subjects.');
      return;
    }

    const attendanceData = subjects.map((subj) => ({
      student_number: student.student_number,
      subject_id: subj.id,
      status: subj.attendance,
      date: new Date().toISOString().slice(0, 10),
    }));

    try {
      const response = await fetch('http://127.0.0.1:8000/api/attendance/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attendance: attendanceData }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to submit attendance');
      }

      setMessage('Attendance marked successfully!');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  if (!student) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        No student data found. Please login again.
      </div>
    );
  }

  return (
    <div className="d-flex">
      <Sidebar onChangeSection={setActiveSection} onLogout={handleLogout} />

      <div className="flex-grow-1 ms-5 ps-4 pe-4">
        <div className="container my-5">
          {activeSection === 'profile' && (
            <div className="card shadow-sm rounded-4 border-0 w-100" style={{ maxWidth: '600px' }}>
              <div className="card-header bg-info text-white rounded-top-4 py-3">
                <h4 className="mb-0">Student Profile</h4>
              </div>
              <div className="card-body">
                <ul className="list-unstyled fs-6">
                  <li className="mb-3"><strong>Student Number:</strong> {student.student_number}</li>
                  <li className="mb-3"><strong>Full Name:</strong> {student.full_name}</li>
                  <li className="mb-3"><strong>Email:</strong> {student.email}</li>
                  <li className="mb-3"><strong>Department ID:</strong> {student.dept_id}</li>
                  <li className="mb-3"><strong>Department:</strong> {student.department || 'N/A'}</li>
                </ul>
              </div>
            </div>
          )}

          {activeSection === 'attendance' && (
            <div className="card shadow-sm rounded-4 border-0 w-100">
              <div className="card-header bg-primary text-white rounded-top-4 py-3">
                <h4 className="mb-0">Mark Attendance</h4>
                <small>Welcome, {student.full_name}!</small>
              </div>
              <div className="card-body">
                {message && (
                  <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'}`} role="alert">
                    {message}
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  {subjects.map((subject) => (
                    <div key={subject.id} className="mb-4">
                      <label className="form-label fw-semibold fs-5">{subject.name}</label>
                      <div className="d-flex gap-4">
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            name={`attendance_${subject.id}`}
                            value="present"
                            checked={subject.attendance === 'present'}
                            onChange={() => handleAttendanceChange(subject.id, 'present')}
                          />
                          <label className="form-check-label text-success fw-bold">Present</label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            name={`attendance_${subject.id}`}
                            value="absent"
                            checked={subject.attendance === 'absent'}
                            onChange={() => handleAttendanceChange(subject.id, 'absent')}
                          />
                          <label className="form-check-label text-danger fw-bold">Absent</label>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button type="submit" className="btn btn-lg btn-primary w-100 fw-semibold shadow-sm">
                    Submit Attendance
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeSection === 'classes' && (
            <div className="card shadow-sm rounded-4 border-0 w-100">
              <div className="card-header bg-secondary text-white rounded-top-4 py-3">
                <h4 className="mb-0">View Classes by Department</h4>
              </div>
              <div className="card-body">
                <div className="mb-4">
                  <label className="form-label fw-semibold">Select Department</label>
                  <select
                    className="form-select"
                    onChange={async (e) => {
                      const deptId = e.target.value;
                      setSelectedDept(deptId);
                      if (deptId) {
                        try {
                          const res = await fetch(`http://127.0.0.1:8000/api/departments/${deptId}/subjects`);
                          const data = await res.json();
                          setDeptSubjects(data);
                        } catch (err) {
                          console.error('Error fetching subjects:', err);
                        }
                      } else {
                        setDeptSubjects([]);
                      }
                    }}
                  >
                    <option value="">-- Select Department --</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                {deptSubjects.length > 0 ? (
                  <ul className="list-group">
                    {deptSubjects.map((subj) => (
                      <li key={subj.id} className="list-group-item">
                        {subj.name}
                      </li>
                    ))}
                  </ul>
                ) : selectedDept ? (
                  <p className="text-muted">No subjects found for this department.</p>
                ) : null}
              </div>
            </div>
          )}

          {activeSection === 'myAttendance' && (
            <div>
              <h4>My Attendance</h4>
              <p>Attendance history goes here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Attendance;
