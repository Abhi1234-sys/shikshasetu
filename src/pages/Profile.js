import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import { ThemeContext } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { 
    getEnrolledCourses, 
    getUserQuizHistory 
} from '../services/api';

const Profile = () => {
    const navigate = useNavigate();
    const { colors, isDarkMode } = useContext(ThemeContext);
    
    
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('name') || "Student";
    
   
    const autoDetectEmail = () => {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            if (value && value.includes('@') && value.includes('.')) {
                return value; 
            }
        }
        return "Not Available";
    };
    
    const userEmail = autoDetectEmail();
    const studentClass = "B.Tech - Engineering Track"; 

    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [quizHistory, setQuizHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId) fetchAllUserData();
    }, [userId]);

    const fetchAllUserData = async () => {
        try {
            setLoading(true);
            const [courseRes, quizRes] = await Promise.all([
                getEnrolledCourses(userId).catch(() => ({ data: [] })),
                getUserQuizHistory(userId).catch(() => ({ data: [] }))
            ]);
            
           
            console.log("--- SHIKSHASETU PROFILE DEBUG ---");
            console.log("Enrolled Courses Data:", courseRes.data);
            console.log("Raw Quiz History Data from Backend:", quizRes.data);
            console.log("All LocalStorage Keys:", { ...localStorage });

            setEnrolledCourses(Array.isArray(courseRes.data) ? courseRes.data : []);
            setQuizHistory(Array.isArray(quizRes.data) ? quizRes.data : []);
        } catch (err) {
            console.error("Profile sync error:", err);
        } finally {
            setLoading(false);
        }
    };


    const totalQuizzesPlayed = quizHistory.length;
    
    const totalScoreAccumulated = quizHistory.reduce((sum, q) => {
        const standardScore = q.score !== undefined ? q.score : 0;
        const marksScore = q.marks !== undefined ? q.marks : 0;
        const pointsScore = q.points !== undefined ? q.points : 0;
        
        return sum + standardScore + marksScore + pointsScore;
    }, 0);

    const dynamicStyles = {
        page: { ...styles.page, backgroundColor: colors.background },
        heroCard: { 
            ...styles.heroCard, 
            background: isDarkMode 
                ? `linear-gradient(135deg, ${colors.card} 0%, #1a2e26 100%)` 
                : `linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)`,
            borderColor: colors.border 
        },
        card: { ...styles.card, backgroundColor: colors.card, borderColor: colors.border },
        statBox: {
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : '#f8fafc',
            border: `1px solid ${colors.border}`
        }
    };

    if (loading) return (
        <div style={{...dynamicStyles.page, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div style={{color: colors.accent, fontWeight: 'bold', fontSize: '20px'}}>Crafting your Profile...</div>
        </div>
    );

    return (
        <div style={dynamicStyles.page}>
            <Navbar />
            <div style={styles.container}>
                
                {/*  1. STUDENT IDENTITY CARD */}
                <header style={dynamicStyles.heroCard}>
                    <div style={styles.heroMain}>
                        <div style={{...styles.avatar, backgroundColor: colors.accent}}>
                            {userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 style={{...styles.bigName, color: colors.text}}>{userName}</h1>
                            <span style={styles.badge}>PRO STUDENT</span>
                            
                            <div style={styles.metaDetailsGrid}>
                                <div style={styles.metaLine}>
                                    <span style={{ color: colors.subText }}>📧 Email:</span>
                                    <strong style={{ color: colors.text, marginLeft: '6px' }}>{userEmail}</strong>
                                </div>
                                <div style={styles.metaLine}>
                                    <span style={{ color: colors.subText }}>🏫 Class:</span>
                                    <strong style={{ color: colors.text, marginLeft: '6px' }}>{studentClass}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/*  2. ACADEMIC STATS BAR */}
                <div style={styles.statsRowGrid}>
                    <div style={{ ...styles.statBox, ...dynamicStyles.statBox }}>
                        <span style={{ fontSize: '26px' }}>🎮</span>
                        <div>
                            <div style={{ ...styles.statNumericVal, color: colors.text }}>{totalQuizzesPlayed}</div>
                            <div style={{ ...styles.statNumericLabel, color: colors.subText }}>Total Quizzes Played</div>
                        </div>
                    </div>
                    <div style={{ ...styles.statBox, ...dynamicStyles.statBox }}>
                        <span style={{ fontSize: '26px' }}>🔥</span>
                        <div>
                            <div style={{ ...styles.statNumericVal, color: colors.accent }}>{totalScoreAccumulated}</div>
                            <div style={{ ...styles.statNumericLabel, color: colors.subText }}>Total Score Accumulation</div>
                        </div>
                    </div>
                </div>

                {/*  3. TRACK MATRIX */}
                <div style={{ ...styles.tableContainerCard, backgroundColor: colors.card, borderColor: colors.border }}>
                    <h3 style={{ ...styles.sectionTitleText, color: colors.text }}>📖 Active Track Registrations</h3>
                    
                    {enrolledCourses.length === 0 ? (
                        <p style={{ color: colors.subText, fontStyle: 'italic', padding: '15px 0', margin: 0 }}>
                            No track structures added yet. Go check the courses portal!
                        </p>
                    ) : (
                        <div style={styles.tableResponsiveWrapper}>
                            <table style={styles.customTable}>
                                <thead style={{ borderBottom: `2px solid ${colors.border}` }}>
                                    <tr>
                                        <th style={{ ...styles.tableHeaderTh, color: colors.subText }}>COURSE TRACK NAME</th>
                                        <th style={{ ...styles.tableHeaderTh, color: colors.subText }}>DOMAIN SEGMENT</th>
                                        <th style={{ ...styles.tableHeaderTh, color: colors.subText, textAlign: 'right' }}>DATE ENROLLED</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {enrolledCourses.map((course, index) => (
                                        <tr key={index} style={{ borderBottom: index !== enrolledCourses.length - 1 ? `1px solid ${colors.border}33` : 'none' }}>
                                            <td style={{ ...styles.tableDataTd, color: colors.text, fontWeight: '700' }}>{course.title}</td>
                                            <td style={{ ...styles.tableDataTd }}><span style={styles.categoryBadge}>{course.category || "Technology"}</span></td>
                                            <td style={{ ...styles.tableDataTd, color: colors.text, textAlign: 'right', fontWeight: '600' }}>
                                                {course.enrollmentDate 
                                                    ? new Date(course.enrollmentDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) 
                                                    : new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

const styles = {
    page: { minHeight: '100vh', paddingTop: '130px', paddingBottom: '80px', transition: 'background-color 0.3s ease' },
    container: { maxWidth: '950px', margin: '0 auto', padding: '0 25px', display: 'flex', flexDirection: 'column', gap: '30px' },
    heroCard: { padding: '40px', borderRadius: '24px', border: '1px solid', display: 'flex', alignItems: 'center', width: '100%', boxSizing: 'border-box' },
    heroMain: { display: 'flex', alignItems: 'center', gap: '25px', flexWrap: 'wrap' },
    avatar: { width: '85px', height: '85px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '38px', fontWeight: '900', color: 'white', boxShadow: '0 8px 20px rgba(16, 185, 129, 0.15)' },
    bigName: { fontSize: '30px', fontWeight: '900', margin: 0, letterSpacing: '-1px' },
    badge: { alignSelf: 'flex-start', margin: '6px 0 10px 0', display: 'inline-block', fontSize: '10px', fontWeight: '900', padding: '4px 12px', borderRadius: '100px', backgroundColor: '#e0f2fe', color: '#0369a1', letterSpacing: '0.5px' },
    metaDetailsGrid: { display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' },
    metaLine: { fontSize: '14px', display: 'flex', alignItems: 'center' },
    statsRowGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', width: '100%' },
    statBox: { padding: '20px 25px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '20px' },
    statNumericVal: { fontSize: '26px', fontWeight: '900', lineHeight: '1' },
    statNumericLabel: { fontSize: '13px', fontWeight: '600', marginTop: '4px' },
    tableContainerCard: { padding: '30px', borderRadius: '24px', border: '1px solid' },
    sectionTitleText: { fontSize: '18px', fontWeight: '900', margin: '0 0 20px 0' },
    tableResponsiveWrapper: { overflowX: 'auto' },
    customTable: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
    tableHeaderTh: { textAlign: 'left', padding: '12px 10px', fontSize: '11px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' },
    tableDataTd: { padding: '16px 10px', verticalAlign: 'middle' },
    categoryBadge: { padding: '4px 10px', borderRadius: '6px', backgroundColor: '#f1f5f9', color: '#475569', fontSize: '12px', fontWeight: '700' }
};

export default Profile;