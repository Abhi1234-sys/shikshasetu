import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ThemeContext } from '../context/ThemeContext';
import { 
  getAllCourses, 
  searchCourses, 
  enrollCourse 
} from '../services/api';

function CourseList() {
  const navigate = useNavigate();
  
  
  const { isDarkMode, colors } = useContext(ThemeContext);

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');

  
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const courseRes = await getAllCourses();
      const courseData = Array.isArray(courseRes.data) ? courseRes.data : [];
      setCourses(courseData);
    } catch (err) {
      console.error("Critical error loading catalog:", err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);

    try {
      if (value.trim() === '') {
        const res = await getAllCourses();
        setCourses(Array.isArray(res.data) ? res.data : []);
      } else {
        const res = await searchCourses(value);
        setCourses(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err) {
      console.error("Search failed:", err);
      setCourses([]);
    }
  };

  const handleEnroll = async (courseId) => {
    if (!userId) {
      setMessage("Please login to enroll!");
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    try {
    
      const res = await enrollCourse(userId, courseId);
      setMessage(res.data || "Success! Course added to your Dashboard.");
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Enrollment failed! Try again later.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  
  const dynamicStyles = {
    page: { 
      ...styles.page, 
      backgroundColor: colors.background,
      color: colors.text 
    },
    title: { ...styles.title, color: colors.text },
    subtitle: { ...styles.subtitle, color: colors.subText },
    searchInput: { 
      ...styles.searchInput, 
      backgroundColor: colors.card, 
      color: colors.text, 
      borderColor: colors.border 
    },
    card: { 
      ...styles.card, 
      backgroundColor: colors.card, 
      borderColor: colors.border 
    },
    courseTitle: { ...styles.courseTitle, color: colors.text },
    courseDesc: { ...styles.courseDesc, color: colors.subText },
    cardFooter: { ...styles.cardFooter, borderTopColor: colors.border },
    viewBtn: { 
      ...styles.viewBtn, 
      backgroundColor: isDarkMode ? 'transparent' : '#f0fdf4',
      color: colors.accent, 
      borderColor: colors.accent 
    },
    enrollBtn: {
        ...styles.enrollBtn,
        backgroundColor: colors.accent 
    },
    message: {
        ...styles.message,
        backgroundColor: isDarkMode ? '#064e3b' : '#f0fdf4',
        color: isDarkMode ? '#34d399' : '#166534',
        borderColor: isDarkMode ? '#065f46' : '#bbf7d0'
    }
  };

  return (
    <div style={dynamicStyles.page}>
      <Navbar />

      <div style={styles.container}>
        {/* HEADER SECTION */}
        <header style={styles.header}>
          <h1 style={dynamicStyles.title}> All Courses</h1>
          <p style={dynamicStyles.subtitle}>
            Explore our curriculum and start your learning journey today.
          </p>
        </header>

        {/* SEARCH SECTION */}
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="🔍 Search courses by title or category..."
            value={search}
            onChange={handleSearch}
            style={dynamicStyles.searchInput}
          />
        </div>

        {/* STATUS MESSAGE */}
        {message && <div style={dynamicStyles.message}>{message}</div>}

        {/*  */}
        {loading ? (
          <div style={styles.loadingBox}>
            <p style={{...styles.loadingText, color: colors.subText}}>Syncing with database...</p>
          </div>
        ) : courses.length === 0 ? (
          <div style={styles.emptyState}>
             <p style={{ color: colors.subText, fontSize: '18px' }}>No courses found in the catalog.</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {courses.map((course) => (
              <div key={course.id} style={dynamicStyles.card}>
                <div style={styles.cardTop}>
                  <div style={styles.courseIcon}>📖</div>
                </div>

                <h3 style={dynamicStyles.courseTitle}>{course.title}</h3>
                <p style={dynamicStyles.courseDesc}>
                  {course.description?.length > 95 
                    ? `${course.description.substring(0, 95)}...` 
                    : course.description}
                </p>

                <div style={dynamicStyles.cardFooter}>
                  <button
                    style={dynamicStyles.viewBtn}
                    onClick={() => navigate(`/courses/${course.id}`)}
                  >
                    View Details
                  </button>

                  <button
                    style={dynamicStyles.enrollBtn}
                    onClick={() => handleEnroll(course.id)}
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', paddingTop: '100px', transition: 'background-color 0.3s ease' }, 
  container: { maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' },
  header: { marginBottom: '35px', textAlign: 'center' },
  title: { fontSize: '32px', fontWeight: '800', margin: '0' },
  subtitle: { fontSize: '16px', marginTop: '8px' },
  searchContainer: { marginBottom: '40px', display: 'flex', justifyContent: 'center' },
  searchInput: { 
    width: '100%', 
    maxWidth: '700px', 
    padding: '14px 24px', 
    borderRadius: '12px', 
    border: '1px solid', 
    fontSize: '16px', 
    outline: 'none', 
    boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
    transition: '0.3s'
  },
  message: { padding: '12px 20px', borderRadius: '10px', marginBottom: '25px', fontWeight: '600', textAlign: 'center', border: '1px solid' },
  loadingBox: { textAlign: 'center', padding: '100px 0' },
  loadingText: { fontSize: '16px' },
  emptyState: { textAlign: 'center', padding: '80px 0' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' },
  card: { 
    borderRadius: '16px', 
    padding: '28px', 
    boxShadow: '0 4px 20px rgba(0,0,0,0.04)', 
    border: '1px solid',
    position: 'relative',
    transition: '0.3s'
  },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' },
  courseIcon: { fontSize: '40px' },
  courseTitle: { fontSize: '20px', fontWeight: '700', marginBottom: '10px' },
  courseDesc: { fontSize: '14px', marginBottom: '25px', lineHeight: '1.6', height: '45px', overflow: 'hidden' },
  cardFooter: { display: 'flex', gap: '12px', borderTop: '1px solid', paddingTop: '20px' },
  viewBtn: { flex: 1, padding: '10px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', transition: '0.3s' },
  enrollBtn: { flex: 1, padding: '10px', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', transition: '0.3s' },
};

export default CourseList;