import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation,useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';


function TeacherDashboard() {
  const location = useLocation();
  const teacher = location.state?.teacher;

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [absentStudents, setAbsentStudents] = useState([]);
  const [presentStudents, setPresentStudents] = useState([]);
  const [showPresentList, setShowPresentList] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    if (teacher?.teacher_id) {
      axios
        .get(`http://localhost:8000/api/teacher/classes?teacher_id=${teacher.teacher_id}`)
        .then(res => setClasses(res.data))
        .catch(err => console.error(err));
    }
  }, [teacher]);

  useEffect(() => {
    if (selectedClass && selectedDate) {
      axios
        .get(`http://localhost:8000/api/teacher/class/${selectedClass}/attendance-count?date=${selectedDate}`)
        .then(res => setAttendanceCount(res.data.present_count))
        .catch(() => setAttendanceCount(0));

      axios
        .get(`http://localhost:8000/api/teacher/class/${selectedClass}/absent-students?date=${selectedDate}`)
        .then(res => {
          const uniqueStudents = Array.from(new Map(res.data.map(s => [s.student_number, s])).values());
          setAbsentStudents(uniqueStudents);
        })
        .catch(() => setAbsentStudents([]));

      setShowPresentList(false);
      setPresentStudents([]);
    }
  }, [selectedClass, selectedDate]);

  const fetchPresentStudents = () => {
    if (!selectedClass || !selectedDate) return;

    axios
      .get(`http://localhost:8000/api/present-students?class_id=${selectedClass}&date=${selectedDate}`)
      .then(res => {
        const presentList = res.data.map(student => ({
          student_number: student.student_id
        }));
        setPresentStudents(presentList);
        setShowPresentList(true);
      })
      .catch(err => {
        console.error('Error fetching present students:', err);
        setPresentStudents([]);
        setShowPresentList(false);
      });
  };

  const handleLogout = () => {
  navigate('/'); 
};


  const totalStudents = attendanceCount + absentStudents.length;
  const attendancePercentage = totalStudents > 0
    ? ((attendanceCount / totalStudents) * 100).toFixed(2)
    : 'N/A';

  const chartData = [
    { name: 'Present', count: attendanceCount },
    { name: 'Absent', count: absentStudents.length },
  ];

  const pieColors = ['#198754', '#dc3545']; // Green, Red

  if (!teacher) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">No teacher info found. Please login.</div>
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
              className={`nav-link btn btn-link text-start ${activeSection === 'dashboard' ? 'active' : 'text-dark'}`}
              onClick={() => setActiveSection('dashboard')}
            >
              Dashboard
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link btn btn-link text-start ${activeSection === 'profile' ? 'active' : 'text-dark'}`}
              onClick={() => setActiveSection('profile')}
            >
              Profile
            </button>
          </li>
          <li className="nav-item mt-auto">
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

            <div className="card mt-4" style={{ maxWidth: '900px' }}>
              <div className="card-header bg-primary text-white">Mark Attendance</div>
              <div className="card-body">
                {/* Selectors */}
                <div className="mb-3">
                  <label htmlFor="classSelect" className="form-label">Select Class</label>
                  <select
                    id="classSelect"
                    className="form-select"
                    value={selectedClass}
                    onChange={e => setSelectedClass(e.target.value)}
                  >
                    <option value="">Select Class</option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>
                        {cls.class_name} - {cls.subject}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="dateSelect" className="form-label">Select Date</label>
                  <input
                    id="dateSelect"
                    type="date"
                    className="form-control"
                    value={selectedDate}
                    max={new Date().toISOString().slice(0, 10)}
                    onChange={e => setSelectedDate(e.target.value)}
                  />
                </div>

                <div className="mb-2"><strong>Students Present:</strong> {attendanceCount}</div>

                <div className="mt-3">
                  <h5>Absent Students:</h5>
                  {absentStudents.length > 0 ? (
                    <ul className="list-group">
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

                <div className="mt-3">
                  <strong>Attendance Percentage:</strong> {attendancePercentage}%
                </div>

                {/* Charts */}
                {totalStudents > 0 && (
                  <div className="mt-4 d-flex flex-wrap justify-content-between gap-4">
                    {/* Bar Chart */}
                    <div style={{ flex: 1, minWidth: '300px', height: 300 }}>
                      <h6 className="text-center">Bar Chart</h6>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#0d6efd" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Pie Chart */}
                    <div style={{ flex: 1, minWidth: '300px', height: 300 }}>
                      <h6 className="text-center">Pie Chart</h6>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            dataKey="count"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={pieColors[index]} />
                            ))}
                          </Pie>
                          <Legend />
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* Present Students Button */}
                <button
                  className="btn btn-success mt-4"
                  onClick={fetchPresentStudents}
                  disabled={!selectedClass || !selectedDate}
                >
                  Show Present Students
                </button>

                {/* Present Students List */}
                {showPresentList && (
                  <div className="mt-4">
                    <h5>Present Students:</h5>
                    {presentStudents.length > 0 ? (
                      <ul className="list-group">
                        {presentStudents.map(student => (
                          <li key={student.student_number} className="list-group-item">
                            {student.student_number}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No present students found.</p>
                    )}
                    <div className="mt-2">
                      <strong>Total Present Students:</strong> {presentStudents.length}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Profile Section */}
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
