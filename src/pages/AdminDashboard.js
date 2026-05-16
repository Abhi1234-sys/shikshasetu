import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import { 
  getAllCourses, 
  deleteCourse, 
  togglePopularCourse 
} from '../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await getAllCourses();
      
      const sortedCourses = Array.isArray(res.data) 
        ? res.data.sort((a, b) => a.id - b.id) 
        : [];
      setCourses(sortedCourses);
    } catch (err) { 
      console.error(err); 
    }
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm("Delete this course?")) {
      try {
        await deleteCourse(id);
        fetchCourses();
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  const handleTogglePopular = async (id) => {
    try {
      await togglePopularCourse(id);
      fetchCourses(); 
    } catch (err) {
      alert("Failed to update popular status");
    }
  };

 
  const popularCourses = courses.filter(course => course.popular);

  return (
    <div style={styles.page}>
      <AdminNavbar />

      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.heading}>Admin Control Center 🔐</h1>
        </header>

        {/*  UPPER PORTION: FIXED FEATURED AREA */}
        {popularCourses.length > 0 && (
          <div style={styles.featuredSection}>
            <h2 style={styles.cardTitle}>⭐ Featured Popular Courses</h2>
            <div style={styles.featuredGrid}>
              {popularCourses.map(course => (
                <div key={`featured-${course.id}`} style={styles.featuredCard}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <span style={{fontSize: '20px'}}>⭐</span>
                    <div>
                      <strong style={{fontSize: '16px'}}>{course.title}</strong>
                      <p style={{fontSize: '11px', color: '#64748b', margin: 0}}>{course.category}</p>
                    </div>
                  </div>
                  <button 
                    style={styles.unstarBtnSmall} 
                    onClick={() => handleTogglePopular(course.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/*  MAIN PORTION: FIXED LIST DIRECTORY */}
        <div style={styles.mainCard}>
           <h2 style={styles.cardTitle}>Course Management Directory</h2>
           <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Course Name</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Popularity</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(course => (
                  <tr key={course.id} style={styles.tableRow}>
                    <td style={styles.td}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                            {/*  Star appears beside the name but position stays fixed */}
                            {course.popular ? (
                              <span style={{fontSize: '18px'}}>⭐</span>
                            ) : (
                              <span style={{width: '18px'}}></span> // Invisible spacer to keep text aligned
                            )}
                            <strong style={{color: '#1e293b'}}>{course.title}</strong>
                        </div>
                    </td>
                    <td style={styles.td}>
                        <span style={styles.badge}>{course.category}</span>
                    </td>
                    <td style={styles.td}>
                      <button 
                        style={course.popular ? styles.unstarBtn : styles.starBtn} 
                        onClick={() => handleTogglePopular(course.id)}
                      >
                        {course.popular ? "Unfeature" : "Make Popular"}
                      </button>
                    </td>
                    <td style={styles.td}>
                      <button style={styles.delBtn} onClick={() => handleDeleteCourse(course.id)}>Del</button>
                    </td>
                  </tr>
                ))}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { 
    background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)', 
    minHeight: '100vh',
    width: '100%' 
  },
  container: { maxWidth: '1100px', margin: '0 auto', paddingTop: '110px', paddingBottom: '40px' },
  header: { marginBottom: '30px' },
  heading: { fontWeight: '800', color: '#111827', fontSize: '28px' },
  
  featuredSection: { marginBottom: '40px' },
  featuredGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' },
  featuredCard: {
    background: '#fff',
    padding: '15px 20px',
    borderRadius: '15px',
    border: '1.5px solid #10b981',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.1)'
  },

  mainCard: { 
    background: '#fff', 
    padding: '30px', 
    borderRadius: '20px', 
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
  },
  cardTitle: { fontSize: '18px', marginBottom: '20px', color: '#1e293b', fontWeight: '800' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { textAlign: 'left', color: '#64748b', borderBottom: '1px solid #f1f5f9' },
  tableRow: { borderBottom: '1px solid #f1f5f9' },
  th: { padding: '12px 15px', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase' },
  td: { padding: '15px', fontSize: '14px' },
  badge: { background: '#f1f5f9', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', color: '#475569' },
  
  starBtn: {
    background: '#ecfdf5',
    color: '#059669',
    border: '1px solid #10b981',
    padding: '7px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '700'
  },
  unstarBtn: {
    background: '#fff7ed',
    color: '#ea580c',
    border: '1px solid #f97316',
    padding: '7px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '700'
  },
  unstarBtnSmall: {
    background: '#fef2f2',
    color: '#ef4444',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: '700'
  },
  delBtn: { color: '#ef4444', background: 'none', border: 'none', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }
};

export default AdminDashboard;