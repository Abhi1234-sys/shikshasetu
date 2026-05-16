import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';
import { ThemeContext } from '../context/ThemeContext'; 

function Login() {
  const navigate = useNavigate();
  const { colors, isDarkMode } = useContext(ThemeContext);
  
  const [formData, setFormData] = useState({ email: '', password: '' });
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
      const response = await login(formData);
      
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('name', response.data.name); 
      localStorage.setItem('userId', response.data.id);

      
      navigate('/dashboard');

    } catch (err) {
      setError('Invalid email or password!');
      console.error("Login Error:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  
  const dynamicStyles = {
    container: { 
      ...styles.container, 
      backgroundColor: colors.background,
      backgroundImage: `radial-gradient(at 0% 0%, rgba(16, 185, 129, 0.1) 0px, transparent 50%)`
    },
    card: { 
      ...styles.card, 
      backgroundColor: colors.card, 
      borderColor: colors.border 
    },
    title: { ...styles.title, color: colors.text },
    input: { 
      ...styles.input, 
      backgroundColor: isDarkMode ? colors.background : '#fff', 
      color: colors.text, 
      borderColor: colors.border 
    },
    label: { ...styles.label, color: colors.subText },
    footer: { ...styles.footer, color: colors.subText }
  };

  return (
    <div style={dynamicStyles.container}>
      <div style={dynamicStyles.card}>
        <div style={styles.logo}>🎓 ShikshaSetu</div>
        <h2 style={dynamicStyles.title}>Welcome Back!</h2>
        <p style={styles.subtitle}>Login to continue your journey</p>

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={dynamicStyles.label}>Email</label>
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              style={dynamicStyles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={dynamicStyles.label}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              style={dynamicStyles.input}
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button
            type="submit"
            style={{...styles.button, backgroundColor: colors.accent}}
            disabled={loading}
            className="login-btn"
          >
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>

        <div style={styles.footerContainer}>
          <p style={dynamicStyles.footer}>
            New to the platform?{' '}
            <Link to="/signup" style={{...styles.link, color: colors.accent}}>Sign Up</Link>
          </p>

          <p style={dynamicStyles.footer}>
            <Link to="/forgot-password" style={{...styles.link, color: colors.accent, fontWeight: '400'}}>Forgot Password?</Link>
          </p>
        </div>
      </div>

      <style>{`
        .login-btn:hover {
            opacity: 0.9;
            transform: translateY(-1px);
            box-shadow: 0 10px 20px rgba(16, 185, 129, 0.2);
        }
        .login-btn {
            transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: { 
    minHeight: '100vh', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    padding: '20px'
  },
  card: { 
    borderRadius: '24px', 
    padding: '45px', 
    width: '100%', 
    maxWidth: '440px', 
    boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
    border: '1px solid'
  },
  logo: { 
    fontSize: '32px', 
    fontWeight: '900', 
    color: '#10b981', 
    textAlign: 'center', 
    marginBottom: '10px',
    letterSpacing: '-1px'
  },
  title: { 
    fontSize: '24px', 
    fontWeight: '800', 
    textAlign: 'center', 
    marginBottom: '8px' 
  },
  subtitle: { 
    fontSize: '15px', 
    color: '#64748b', 
    textAlign: 'center', 
    marginBottom: '35px' 
  },
  inputGroup: { marginBottom: '20px' },
  label: { fontSize: '13px', fontWeight: '600', marginBottom: '8px', display: 'block' },
  input: { 
    width: '100%', 
    padding: '12px 16px', 
    borderRadius: '12px', 
    border: '1px solid', 
    fontSize: '15px', 
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  button: { 
    width: '100%', 
    padding: '14px', 
    color: 'white', 
    border: 'none', 
    borderRadius: '12px', 
    fontSize: '16px', 
    fontWeight: '700',
    cursor: 'pointer', 
    marginTop: '15px' 
  },
  error: { 
    color: '#ef4444', 
    fontSize: '14px', 
    marginBottom: '15px', 
    textAlign: 'center',
    fontWeight: '500'
  },
  footerContainer: { marginTop: '25px', textAlign: 'center' },
  footer: { fontSize: '14px', marginBottom: '8px' },
  link: { textDecoration: 'none', fontWeight: '700' },
};

export default Login;