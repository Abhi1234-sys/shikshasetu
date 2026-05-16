import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../services/api';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Log for debugging
      console.log("Attempting signup with:", formData.email);
      
      const response = await signup(formData);
      console.log("Signup success:", response);
      
      alert("✅ Signup successful! Please login.");
      navigate('/login');
    } catch (err) {
      // Extract specific error message 
      const backendMessage = err.response?.data?.message || err.response?.data || 'Signup failed! Connection error.';
      setError(backendMessage);
      console.error("Full Signup Error Details:", err.response);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>🎓 Shikshasetu</div>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Start your learning journey today!</p>

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={styles.input}>
              <option value="STUDENT">Student</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button
            type="submit"
            style={styles.button}
            disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Login</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0faf5' },
  card: { backgroundColor: '#ffffff', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '420px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
  logo: { fontSize: '28px', fontWeight: 'bold', color: '#4caf91', textAlign: 'center', marginBottom: '10px' },
  title: { fontSize: '22px', fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: '5px' },
  subtitle: { fontSize: '14px', color: '#888', textAlign: 'center', marginBottom: '25px' },
  inputGroup: { marginBottom: '16px' },
  label: { fontSize: '14px', color: '#555', marginBottom: '6px', display: 'block' },
  input: { width: '100%', padding: '10px 15px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none' },
  button: { width: '100%', padding: '12px', backgroundColor: '#4caf91', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', marginTop: '10px' },
  error: { color: '#e53935', fontSize: '14px', marginBottom: '10px' },
  footer: { textAlign: 'center', marginTop: '15px', fontSize: '14px', color: '#666' },
  link: { color: '#4caf91', textDecoration: 'none', fontWeight: 'bold' },
};

export default Signup;