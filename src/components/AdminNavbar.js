import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Helper function to check if the current path matches the link for active styling
  const getLinkStyle = (path) => {
    return location.pathname === path ? navStyles.activeLink : navStyles.link;
  };

  return (
    <nav style={navStyles.navbar}>
      {/* LOGO SECTION */}
      <div style={navStyles.logoSection}>
          <span style={navStyles.logoText}>ShikshaSetu</span>
          <span style={navStyles.adminBadge}>ADMIN</span>
      </div>
      
      {/*  NAVIGATION LINKS */}
      <div style={navStyles.links}>
        <Link to="/dashboard" style={getLinkStyle('/dashboard')}>
          Control Center
        </Link>
        
        <Link to="/admin/manage-courses" style={getLinkStyle('/admin/manage-courses')}>
          Manage Courses
        </Link>

        <Link to="/admin/students" style={getLinkStyle('/admin/students')}>
          Student Directory
        </Link>
        
        <Link to="/admin/global-notices" style={getLinkStyle('/admin/global-notices')}>
          Global Notices
        </Link>
      </div>

      {/*  TERMINATE BUTTON SECTION  */}
      <div style={navStyles.rightSection}>
        <button onClick={handleLogout} style={navStyles.logoutBtn}>
            Terminate Session
        </button>
      </div>
    </nav>
  );
};

const navStyles = {
  navbar: { 
    position: 'fixed', 
    top: 0, 
    left: 0, 
    width: '100%', 
    height: '70px',
    zIndex: 2000, 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: '0 60px 0 40px', 
    background: '#fff', 
    borderBottom: '1px solid #e2e8f0',
    boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
    boxSizing: 'border-box' 
  },
  logoSection: { display: 'flex', alignItems: 'center', gap: '10px' },
  logoText: { fontSize: '22px', fontWeight: '900', color: '#111827', letterSpacing: '-1px' },
  adminBadge: { fontSize: '10px', background: '#111827', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' },
  links: { display: 'flex', gap: '30px' },
  link: { 
    textDecoration: 'none', 
    color: '#64748b', 
    fontWeight: '600', 
    fontSize: '14px',
    transition: 'color 0.2s ease',
    paddingBottom: '5px'
  },
  activeLink: {
    textDecoration: 'none',
    color: '#10b981', 
    fontWeight: '700',
    fontSize: '14px',
    borderBottom: '2px solid #10b981',
    paddingBottom: '5px'
  },
  
  rightSection: {
    display: 'flex',
    justifyContent: 'flex-end',
    minWidth: '160px',
    marginRight: '20px' 
  },
  logoutBtn: { 
    background: '#111827', 
    color: '#fff', 
    border: 'none', 
    padding: '10px 20px', 
    borderRadius: '8px', 
    cursor: 'pointer', 
    fontWeight: '700',
    fontSize: '13px',
    whiteSpace: 'nowrap', 
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  }
};

export default AdminNavbar;