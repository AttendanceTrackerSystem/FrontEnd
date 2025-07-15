import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/LoginPage.css';

function StudentLogin() {
  const [form, setForm] = useState({
    studentNumber: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_number: form.studentNumber,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Login failed');

      alert(data.message);
      navigate('/attendance', { state: { student: data.student } });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container" role="main" aria-label="Student login form">
      <h2>Student Login</h2>
      {error && <div className="error-message" role="alert">{error}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="studentNumber">Student Number</label>
        <input
          id="studentNumber"
          className="student-number"
          type="text"
          name="studentNumber"
          placeholder="e.g. GAHDSE24.1F-045"
          value={form.studentNumber}
          onChange={handleChange}
          required
          autoComplete="username"
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
          required
          autoComplete="current-password"
        />

        <button type="submit" className="login-button" aria-label="Sign in">
          Sign In
        </button>
      </form>
    </div>
  );
}

export default StudentLogin;

