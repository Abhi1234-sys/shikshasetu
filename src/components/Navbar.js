import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import { ThemeContext } from "../context/ThemeContext";

const Navbar = () => {
  const navigate = useNavigate();
  
  const { isDarkMode, toggleTheme, colors } = useContext(ThemeContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    navigate("/login");
  };

  // Dynamic styles 
  const dynamicStyles = {
    wrapper: {
      ...styles.wrapper,
      backgroundColor: colors.card,
      borderBottom: `1px solid ${colors.border}`,
    },
    link: {
      ...styles.link,
      color: colors.text,
    },
    logo: {
      ...styles.logo,
      color: isDarkMode ? "#38bdf8" : "#4caf91",
    }
  };

  return (
    <div style={dynamicStyles.wrapper}>
      
      {/* TOP LOGO & THEME TOGGLE */}
      <div style={{...styles.topBar, borderBottom: `1px solid ${colors.border}`}}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={dynamicStyles.logo}>🎓 ShikshaSetu</h2>
          
          {/* NEW: THEME TOGGLE BUTTON */}
          <button onClick={toggleTheme} style={styles.themeToggle}>
            {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      </div>

      {/* MENU BELOW */}
      <div style={styles.menuBar}>
        <Link to="/dashboard" style={dynamicStyles.link}>Dashboard</Link>
        <Link to="/courses" style={dynamicStyles.link}>Courses</Link>
        <Link to="/quiz-hub" style={dynamicStyles.link}>Quiz</Link>
        <Link to="/profile" style={dynamicStyles.link}>Profile</Link>
        <Link to="/leaderboard" style={dynamicStyles.link}>Leaderboard</Link>
        <Link to="/ai-doubt" style={dynamicStyles.link}>AI Doubt</Link>
  
        <button onClick={handleLogout} style={styles.logout}>
          Logout
        </button>
      </div>

    </div>
  );
};

const styles = {
  wrapper: {
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    position: "fixed", 
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 1000,
    transition: "background-color 0.3s ease",
  },

  topBar: {
    padding: "15px 30px",
  },

  logo: {
    fontWeight: "bold",
    margin: 0,
    cursor: "pointer",
  },

  themeToggle: {
    padding: "8px 16px",
    borderRadius: "20px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    backgroundColor: "#38bdf8", 
    color: "white",
    fontSize: "12px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },

  menuBar: {
    display: "flex",
    gap: "25px",
    padding: "10px 30px",
    alignItems: "center",
  },

  link: {
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "14px",
    transition: "color 0.2s ease",
  },

  logout: {
    marginLeft: "auto",
    padding: "8px 16px",
    backgroundColor: "#ef4444", 
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Navbar;