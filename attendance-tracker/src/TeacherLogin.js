import React, { useState } from 'react';
import './css/LoginPage.css';

function TeacherLogin() {
  const [form, setForm] = useState({
    teacherId: '',
    password: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Logging in as: ${form.teacherId}`);
  };

  return (
    <div className="login-container" role="main" aria-label="Teacher login form">
      <h2>Teacher Login</h2>
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
          autoComplete="teacherId"
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
