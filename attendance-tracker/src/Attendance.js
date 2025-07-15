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

  const [attendanceComments, setAttendanceComments] = useState({});
  const [attendanceRatings, setAttendanceRatings] = useState({});

  const today = new Date().toISOString().split('T')[0];
  const classesToday = classes.filter(cls => cls.date === today);

  useEffect(() => {
    if (student?.department_id) {
      fetch(`http://127.0.0.1:8000/api/departments/${student.department_id}`)
        .then(res => res.json())
        .then(data => setDepartmentName(data.name))
        .catch(err => console.error('Error fetching department:', err));
    }
  }, [student]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/departments')
      .then(res => res.json())
      .then(data => setDepartments(data))
      .catch(err => console.error('Error loading departments:', err));
  }, []);

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

  useEffect(() => {
    if (selectedDepartment && selectedSubject) {
      fetch(`http://127.0.0.1:8000/api/teachers?department_id=${selectedDepartment}&subject_id=${selectedSubject}`)
        .then(res => res.json())
        .then(data => setTeacherList(Array.isArray(data) ? data : []))
        .catch(() => setTeacherList([]));

      fetch(`http://127.0.0.1:8000/api/classes?department_id=${selectedDepartment}&subject_id=${selectedSubject}`)
        .then(res => res.json())
        .then(data => setClasses(Array.isArray(data) ? data : []))
        .catch(() => setClasses([]));
    } else {
      setTeacherList([]);
      setClasses([]);
    }
  }, [selectedDepartment, selectedSubject]);

  const handleCommentChange = (classId, comment) => {
    setAttendanceComments(prev => ({ ...prev, [classId]: comment }));
  };

  const handleRatingChange = (classId, rating) => {
    if (rating === '' || (Number(rating) >= 1 && Number(rating) <= 5)) {
      setAttendanceRatings(prev => ({ ...prev, [classId]: rating }));
    }
  };

  const handleSubmitComment = (cls) => {
    const comment = attendanceComments[cls.id];
    const rating = attendanceRatings[cls.id];
    const studentId = student?.student_number;

    if (!studentId) {
      alert('Student ID is missing! Please login again.');
      console.error('Student ID is undefined:', student);
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      alert('Please enter a valid rating (1-5).');
      return;
    }

    if (!comment || comment.trim() === '') {
      alert('Please enter a comment before submitting.');
      return;
    }

    const payload = {
  student_id: student.student_number,  
  class_id: cls.id,
  comment: comment.trim(),
  rating: parseInt(rating),
  date: today,
};



    console.log('Submitting attendance with payload:', payload);

    fetch('http://127.0.0.1:8000/api/submit_attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(res => {
        if (!res.ok) {
          console.error('Server responded with status:', res.status);
          throw new Error('Failed to submit attendance');
        }
        return res.json();
      })
      .then(() => {
        alert('Attendance submitted successfully!');
        setAttendanceComments(prev => {
          const updated = { ...prev };
          delete updated[cls.id];
          return updated;
        });
        setAttendanceRatings(prev => {
          const updated = { ...prev };
          delete updated[cls.id];
          return updated;
        });
      })
      .catch(err => {
        console.error('Error submitting attendance:', err);
        alert('Error submitting attendance. Check console for details.');
      });
  };

  const handleLogout = () => navigate('/');

  if (!student) {
    return <div className="alert alert-danger m-3">No student data found. Please login again.</div>;
  }

  return (
    <div className="d-flex">
      <Sidebar onChangeSection={setActiveSection} onLogout={handleLogout} />

      <div className="flex-grow-1 ms-5 ps-4 pe-4">
        <div className="container my-5">

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

          {activeSection === 'attendance' && (
            <div className="card shadow-sm rounded-4 border-0 w-100">
              <div className="card-header bg-primary text-white rounded-top-4 py-3">
                <h4 className="mb-0">View Subject, Teacher & Classes Details</h4>
              </div>
              <div className="card-body">
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

                {teacherList.length > 0 && (
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
                )}

                {classes.length > 0 && (
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
                )}
              </div>
            </div>
          )}

          {activeSection === 'SubmitAttendance' && (
            <div className="card shadow-sm rounded-4 border-0 w-100">
              <div className="card-header bg-secondary text-white rounded-top-4 py-3">
                <h4 className="mb-0">Today Classes Details & Attendance Submission</h4>
              </div>
              <div className="card-body">
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

                {classesToday.length > 0 ? (
                  <div className="mt-4">
                    <h4>Submit Attendance & Comment for Today's Classes</h4>
                    {classesToday.map(cls => (
                      <div key={cls.id} className="card mb-3 shadow-sm border-primary">
                        <div className="card-body">
                          <p><strong>Class:</strong> {cls.class_name} ({cls.week})</p>
                          <p><strong>Time:</strong> {cls.start_time} - {cls.end_time}</p>
                          <p><strong>Teacher:</strong> {cls.teacher.teacher_name}</p>

                          <div className="mb-3">
                            <label className="form-label fw-bold">Attendance Rating (1 - 5)</label>
                            <input
                              type="number"
                              className="form-control"
                              min="1"
                              max="5"
                              placeholder="Enter rating"
                              value={attendanceRatings[cls.id] || ''}
                              onChange={(e) => handleRatingChange(cls.id, e.target.value)}
                            />
                          </div>

                          <div className="mb-3">
                            <label className="form-label fw-bold">Your Comment</label>
                            <textarea
                              className="form-control"
                              rows="3"
                              placeholder="Write your feedback or thoughts..."
                              value={attendanceComments[cls.id] || ''}
                              onChange={(e) => handleCommentChange(cls.id, e.target.value)}
                            />
                          </div>

                          <button
                            className="btn btn-success"
                            onClick={() => handleSubmitComment(cls)}
                          >
                            Submit Attendance
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  selectedSubject && <p className="text-info">No classes scheduled today to submit attendance.</p>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Attendance;
