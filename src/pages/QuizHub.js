import React, { useState, useEffect, useContext } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { getAllCourses } from '../services/api';
import Navbar from '../components/Navbar';
import { ThemeContext } from '../context/ThemeContext'; 

const QuizHub = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    
    const { isDarkMode, colors } = useContext(ThemeContext);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await getAllCourses();
                setCourses(res.data || []);
            } catch (err) {
                console.error("Error loading Quiz Hub:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const domains = [
        { id: "Programming", title: "Programming Quizzes", icon: "💻" },
        { id: "Tech", title: "Technology Quizzes", icon: "⚙️" },
        { id: "Business", title: "Business Quizzes", icon: "💼" }
    ];

    
    const dynamicStyles = {
        page: { ...styles.page, backgroundColor: colors.background },
        mainTitle: { ...styles.mainTitle, color: colors.text },
        subtitle: { ...styles.subtitle, color: colors.subText },
        categoryTitle: { ...styles.categoryTitle, color: colors.text, borderBottomColor: colors.border },
        quizCard: { 
            ...styles.quizCard, 
            backgroundColor: colors.card, 
            borderColor: colors.border 
        },
        courseTitle: { ...styles.courseTitle, color: colors.text },
        badge: { 
            ...styles.badge, 
            backgroundColor: isDarkMode ? colors.background : '#f1f5f9', 
            color: colors.subText 
        },
        playBtn: {
            ...styles.playBtn,
            backgroundColor: colors.accent 
        }
    };

    if (loading) return <div style={{...styles.loader, color: colors.text}}>Loading Assessment Domains...</div>;

    return (
        <div style={dynamicStyles.page}>
            <Navbar />
            <div style={styles.container}>
                <header style={styles.header}>
                    <h1 style={dynamicStyles.mainTitle}>Quiz Center 🎯</h1>
                    <p style={dynamicStyles.subtitle}>Select a subject to start your assessment</p>
                </header>

                {domains.map(domain => {
                    const domainCourses = courses.filter(c => {
                        const cat = c.category ? c.category.toLowerCase() : "";
                        const target = domain.id.toLowerCase();
                        
                        if (target === "tech") {
                            return cat === "tech" || cat === "technical" || cat === "technology";
                        }
                        return cat === target;
                    });
                    
                    if (domainCourses.length === 0) return null;

                    return (
                        <section key={domain.id} style={styles.categorySection}>
                            <h2 style={dynamicStyles.categoryTitle}>
                                <span style={{marginRight: '15px'}}>{domain.icon}</span>
                                {domain.title}
                            </h2>
                            <div style={styles.quizGrid}>
                                {domainCourses.map(course => (
                                    <div key={course.id} style={dynamicStyles.quizCard}>
                                        <div style={styles.cardHeader}>
                                            <h3 style={dynamicStyles.courseTitle}>{course.title}</h3>
                                            <div style={dynamicStyles.badge}>{course.level || 'Standard'}</div>
                                        </div>
                                        <button 
                                            onClick={() => navigate(`/quiz/${course.id}`)}
                                            style={dynamicStyles.playBtn}
                                        >
                                            Start Quiz 🚀
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>
                    );
                })}

                {courses.length === 0 && (
                    <div style={{...styles.emptyState, color: colors.subText}}>
                        <h3>No courses found in the database.</h3>
                        <p>Please add courses via the Admin Panel.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    page: { minHeight: '100vh', paddingBottom: '80px', transition: 'background-color 0.3s ease' },
    container: { maxWidth: '1200px', margin: '0 auto', padding: '140px 20px 20px' },
    header: { marginBottom: '50px', textAlign: 'center' },
    mainTitle: { fontSize: '38px', fontWeight: '800', marginBottom: '10px' },
    subtitle: { fontSize: '18px' },
    categorySection: { marginBottom: '60px' },
    categoryTitle: { 
        fontSize: '28px', 
        fontWeight: '800', 
        marginBottom: '30px', 
        borderBottom: '3px solid', 
        paddingBottom: '15px',
        display: 'flex',
        alignItems: 'center'
    },
    quizGrid: { 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
        gap: '30px' 
    },
    quizCard: { 
        borderRadius: '24px', 
        padding: '35px', 
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', 
        border: '1px solid', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between',
        minHeight: '220px',
        textAlign: 'center',
        transition: 'transform 0.2s ease-in-out, background-color 0.3s ease'
    },
    cardHeader: { marginBottom: '20px' },
    courseTitle: { fontSize: '20px', fontWeight: '800', margin: '0 0 12px 0', lineHeight: '1.4' },
    badge: { display: 'inline-block', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' },
    playBtn: { 
        width: '100%', 
        padding: '16px', 
        color: '#fff', 
        border: 'none', 
        borderRadius: '14px', 
        fontWeight: '700', 
        cursor: 'pointer',
        fontSize: '16px',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        transition: '0.3s'
    },
    emptyState: { textAlign: 'center', marginTop: '100px' },
    loader: { textAlign: 'center', padding: '180px', fontSize: '24px', fontWeight: '800' }
};

export default QuizHub;