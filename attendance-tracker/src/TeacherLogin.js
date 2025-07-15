import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // for navigation
import './css/LoginPage.css';

function TeacherLogin() {
  const [form, setForm] = useState({
    teacherId: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.teacherId || !form.password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/logintech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacher_id: form.teacherId,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed');
      } else {
        // On successful login, redirect to TeacherDashboard
        navigate('/teacherdashboard', { state: { teacher: data.teacher } });
      }
    } catch (err) {
      setError('Server error: ' + err.message);
    }
  };

  return (
    <div className="login-container" role="main" aria-label="Teacher login form">
      <h2>Teacher Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="teacherId">Teacher ID</label>
        <input
          id="teacherId"
          type="text"
          name="teacherId"
          placeholder="TCH12345"
          value={form.teacherId}
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
        <div
          tabIndex={0}
          role="button"
          className="forgot"
          onClick={() => alert('Password reset flow not implemented')}
          onKeyDown={e => { if (e.key === 'Enter') alert('Password reset flow not implemented'); }}
          aria-label="Forgot password"
        >
          Forgot Password?
        </div>
        <button type="submit" className="login-button" aria-label="Sign in">
          Sign In
        </button>
      </form>
    </div>
  );
}

export default TeacherLogin;
