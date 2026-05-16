import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ThemeContext } from '../context/ThemeContext';
import { 
    getAllCourses, 
    getAnnouncements, 
    searchCourses,
    getEnrolledCourses,
    enrollCourse 
} from '../services/api';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const { isDarkMode, colors } = useContext(ThemeContext);
    
    const [courses, setCourses] = useState([]);
    const [myCourses, setMyCourses] = useState([]); 
    const [announcements, setAnnouncements] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    const userId = localStorage.getItem("userId");

    const userName = localStorage.getItem("name") || "Student";

    useEffect(() => {
        fetchDashboardData();
    }, [userId]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [courseRes, announcementRes, myEnrolledRes] = await Promise.all([
                getAllCourses().catch(() => ({ data: [] })),
                getAnnouncements().catch(() => ({ data: [] })),
                userId ? getEnrolledCourses(userId).catch(() => ({ data: [] })) : { data: [] } 
            ]);
            
            setCourses(Array.isArray(courseRes.data) ? courseRes.data : []);
            setMyCourses(Array.isArray(myEnrolledRes.data) ? myEnrolledRes.data : []);
            
            const sortedAnnouncements = (Array.isArray(announcementRes.data) ? announcementRes.data : [])
                .sort((a, b) => b.id - a.id);
            setAnnouncements(sortedAnnouncements);
        } catch (err) {
            console.error("Dashboard error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        const value = e.target.value;
        setSearch(value);
        try {
            const res = value.trim() === '' ? await getAllCourses() : await searchCourses(value);
            setCourses(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            setCourses([]);
        }
    };

    const handleEnroll = async (courseId) => {
        if (!userId) {
            setMessage("Please login to enroll!");
            return;
        }
        try {
            await enrollCourse(userId, courseId);
            setMessage("Success! Course added to your Dashboard.");
            fetchDashboardData(); 
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage(err.response?.data || "Enrollment failed!");
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const popularCourses = courses.slice(0, 4);

    const dynamicStyles = {
        page: { ...styles.page, backgroundColor: colors.background },
        sectionTitle: { ...styles.sectionTitle, color: colors.text },
        popularCard: { ...styles.popularCard, backgroundColor: colors.card, borderColor: colors.border },
        searchInput: { ...styles.searchInput, backgroundColor: colors.card, color: colors.text, borderColor: colors.border },
        courseCard: { ...styles.courseCard, backgroundColor: colors.card, borderColor: colors.border },
        noticeBoard: { ...styles.noticeBoard, backgroundColor: colors.card, borderColor: colors.border },
        noticeCard: { ...styles.noticeCard, backgroundColor: isDarkMode ? colors.background : '#ffffff', borderColor: colors.border }
    };

    if (loading) return (
        <div style={{...dynamicStyles.page, textAlign: 'center', paddingTop: '200px', color: colors.accent}}>
            Loading your ShikshaSetu dashboard...
        </div>
    );

    return (
        <div style={dynamicStyles.page}>
            <Navbar />
            <div style={styles.container}>
                
                {/*  */}
                <header style={styles.welcomeHeader}>
                    <div style={styles.welcomeText}>
                        <h1 style={{ ...styles.greeting, color: colors.text }}>
                            Welcome back, <span style={{ color: colors.accent }}>{userName}</span> ! 👋
                        </h1>
                        <p style={{ ...styles.subtitle, color: colors.subText }}>
                            Master your tech stacks and track your progress today.
                        </p>
                    </div>
                    <div style={{ ...styles.dateBadge, backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#f1f5f9' }}>
                        <span style={{ color: colors.accent, fontWeight: '800' }}>
                            {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                        </span>
                    </div>
                </header>

                <section style={styles.topSection}>
                    <h2 style={dynamicStyles.sectionTitle}>🎯 My Active Learning Paths</h2>
                    <div style={styles.featuredGrid}>
                        {myCourses.length === 0 ? (
                            <p style={{...styles.noEnrollText, color: colors.subText}}>You haven't enrolled in any courses yet.</p>
                        ) : (
                            myCourses.map((course) => (
                                <div key={course.id} style={{...styles.myCourseCard, borderColor: colors.accent, backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.1)' : '#f0fdf4'}} onClick={() => navigate(`/courses/${course.id}`)}>
                                    <div style={styles.featIcon}>✅</div>
                                    <div style={styles.featInfo}>
                                        <h4 style={{...styles.featTitle, color: isDarkMode ? colors.accent : '#065f46'}}>{course.title}</h4>
                                        <p style={{...styles.featCat, color: colors.accent}}>Continue Learning →</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                <section style={styles.popularSection}>
                    <h2 style={dynamicStyles.sectionTitle}>🔥 Popular This Week</h2>
                    <div style={styles.popularScroll}>
                        {popularCourses.map((course) => (
                            <div key={course.id} style={dynamicStyles.popularCard} onClick={() => navigate(`/courses/${course.id}`)}>
                                <div style={styles.popBadge}>POPULAR</div>
                                <div style={styles.popIcon}>⭐</div>
                                <h4 style={{ ...styles.popTitle, color: colors.text }}>{course.title}</h4>
                                <p style={{ ...styles.popSub, color: colors.subText }}>{course.category}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <div style={styles.searchBox}>
                    <input
                        type="text"
                        placeholder="🔍 Search for courses, coding topics, or tech stacks..."
                        value={search}
                        onChange={handleSearch}
                        style={dynamicStyles.searchInput}
                    />
                </div>

                {message && <div style={{...styles.alert, backgroundColor: isDarkMode ? '#064e3b' : '#dcfce7', color: isDarkMode ? '#34d399' : '#166534'}}>{message}</div>}

                <div style={styles.mainLayout}>
                    <div style={styles.courseColumn}>
                        <h2 style={dynamicStyles.sectionTitle}>📚 Explore All Courses</h2>
                        <div style={styles.courseStack}>
                            {courses.map((course) => {
                                const isEnrolled = myCourses.some(mc => mc.id === course.id);
                                return (
                                    <div key={course.id} style={dynamicStyles.courseCard}>
                                        <div style={styles.cardInfo}>
                                            <div style={styles.courseSymbol}>📖</div>
                                            <div>
                                                <h3 style={{...styles.courseName, color: colors.text}}>{course.title}</h3>
                                                <p style={{...styles.courseText, color: colors.subText}}>{course.description}</p>
                                            </div>
                                        </div>
                                        <div style={styles.cardActions}>
                                            <button style={{...styles.detailsBtn, color: colors.accent, borderColor: colors.accent}} onClick={() => navigate(`/courses/${course.id}`)}>Details</button>
                                            
                                            {isEnrolled ? (
                                                <button 
                                                    style={{...styles.certBtn, backgroundColor: colors.accent}} 
                                                    onClick={() => navigate(`/certificate/${encodeURIComponent(course.title)}`)}
                                                >
                                                    🏅 Claim Certificate
                                                </button>
                                            ) : (
                                                <button 
                                                    style={{...styles.joinBtn, backgroundColor: colors.accent}} 
                                                    onClick={() => handleEnroll(course.id)}
                                                >
                                                    Enroll
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div style={styles.noticeColumn}>
                        <h2 style={dynamicStyles.sectionTitle}> Broadcasts</h2>
                        <div style={dynamicStyles.noticeBoard}>
                            {announcements.length === 0 ? (
                                <p style={{...styles.noNotice, color: colors.subText}}>No active announcements.</p>
                            ) : (
                                announcements.map((notice) => (
                                    <div key={notice.id} style={dynamicStyles.noticeCard}>
                                        <div style={styles.noticeHeader}>
                                            <span style={styles.adminDot}></span>
                                            <small style={{...styles.adminLabel, color: colors.subText}}>ADMIN UPDATE</small>
                                        </div>
                                        <p style={{...styles.noticeMsg, color: colors.text}}>{notice.message || notice.content}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    page: { minHeight: '100vh', paddingTop: '140px', transition: 'background-color 0.3s ease' },
    container: { maxWidth: '1400px', margin: '0 auto', padding: '20px' },
    
    
    welcomeHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px',
        padding: '0 5px'
    },
    welcomeText: { display: 'flex', flexDirection: 'column', gap: '4px' },
    greeting: { fontSize: '32px', fontWeight: '900', margin: 0, letterSpacing: '-1.5px' },
    subtitle: { fontSize: '16px', margin: 0, fontWeight: '500' },
    dateBadge: { padding: '8px 16px', borderRadius: '12px', fontSize: '13px' },

    topSection: { marginBottom: '45px' },
    sectionTitle: { fontSize: '22px', fontWeight: '800', marginBottom: '20px' },
    featuredGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' },
    myCourseCard: { cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '20px', borderRadius: '16px', border: '2px solid', gap: '15px', transition: '0.3s' },
    noEnrollText: { fontSize: '15px', fontStyle: 'italic' },
    featIcon: { fontSize: '24px' },
    featTitle: { margin: 0, fontSize: '17px', fontWeight: '700' },
    featCat: { margin: 0, fontSize: '13px', fontWeight: '600' },
    popularSection: { marginBottom: '40px' },
    popularScroll: { display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '15px' },
    popularCard: { minWidth: '240px', padding: '25px', borderRadius: '20px', border: '1px solid', cursor: 'pointer', position: 'relative', transition: '0.3s' },
    popBadge: { backgroundColor: '#f59e0b', color: '#fff', fontSize: '10px', fontWeight: 'bold', padding: '3px 10px', borderRadius: '6px' },
    popIcon: { fontSize: '32px', marginBottom: '12px' },
    popTitle: { fontSize: '18px', fontWeight: '700', margin: '0 0 5px 0' },
    popSub: { fontSize: '13px', margin: 0 },
    searchBox: { marginBottom: '40px' },
    searchInput: { width: '100%', padding: '18px 30px', borderRadius: '100px', border: '1px solid', fontSize: '16px', outline: 'none' },
    alert: { padding: '12px', borderRadius: '10px', marginBottom: '25px', textAlign: 'center' },
    mainLayout: { display: 'flex', gap: '40px', alignItems: 'flex-start' },
    courseColumn: { flex: 2 },
    courseStack: { display: 'flex', flexDirection: 'column', gap: '18px' },
    courseCard: { padding: '25px', borderRadius: '20px', border: '1px solid', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    cardInfo: { display: 'flex', gap: '25px', alignItems: 'center' },
    courseSymbol: { fontSize: '40px' },
    courseName: { margin: 0, fontSize: '20px', fontWeight: '800' },
    courseText: { margin: '6px 0 0 0', fontSize: '15px', lineHeight: '1.6' },
    cardActions: { display: 'flex', gap: '12px' },
    detailsBtn: { padding: '10px 20px', borderRadius: '10px', border: '1.5px solid', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: '700' },
    joinBtn: { padding: '10px 20px', borderRadius: '10px', border: 'none', color: 'white', cursor: 'pointer', fontWeight: '700' },
    certBtn: { padding: '10px 20px', borderRadius: '10px', border: 'none', color: 'white', cursor: 'pointer', fontWeight: '700', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)' },
    noticeColumn: { flex: 1, position: 'sticky', top: '160px' },
    noticeBoard: { padding: '25px', borderRadius: '24px', border: '1px solid', minHeight: '500px' },
    noticeCard: { padding: '20px', borderRadius: '16px', marginBottom: '18px', borderLeft: '5px solid #ef4444' },
    noticeHeader: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' },
    adminDot: { width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%' },
    adminLabel: { fontWeight: '900', fontSize: '10px' },
    noticeMsg: { margin: 0, fontSize: '15px', lineHeight: '1.6' },
    noNotice: { textAlign: 'center', marginTop: '60px' }
};

export default StudentDashboard;