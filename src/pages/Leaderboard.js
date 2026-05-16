import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { getLeaderboard, getAllCourses } from '../services/api';
import { ThemeContext } from '../context/ThemeContext';

const Leaderboard = () => {
    const navigate = useNavigate();
    const { isDarkMode, colors } = useContext(ThemeContext);

    const [allData, setAllData] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('Global');
    const [filteredLeaderboard, setFilteredLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [searchQuery, setSearchQuery] = useState("");
    const [activeDomain, setActiveDomain] = useState("All");

    const domains = ["All", "Programming", "Technical", "Business"];

    useEffect(() => {
        fetchInitialData();
    }, []);

    
    useEffect(() => {
        if (selectedCourse === 'Global') {
            
            const global = [...allData].sort((a, b) => b.totalScore - a.totalScore);
            setFilteredLeaderboard(global);
        } else {
            
            const filtered = allData.map(student => {
                
                if (student.quizResults && Array.isArray(student.quizResults)) {
                    const courseQuiz = student.quizResults.find(q => 
                        q.courseTitle === selectedCourse || q.course?.title === selectedCourse
                    );
                    if (courseQuiz) {
                        return { ...student, currentCourseScore: courseQuiz.score || courseQuiz.points };
                    }
                }
                
                if (student.courseTitle === selectedCourse || student.lastCourseTitle === selectedCourse) {
                    return { ...student, currentCourseScore: student.totalScore };
                }

                return null;
            })
            .filter(Boolean) 
            .sort((a, b) => (b.currentCourseScore || b.totalScore) - (a.currentCourseScore || a.totalScore));

            setFilteredLeaderboard(filtered);
        }
    }, [selectedCourse, allData]);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [leaderRes, courseRes] = await Promise.all([
                getLeaderboard().catch(() => ({ data: [] })),
                getAllCourses().catch(() => ({ data: [] }))
            ]);
            setAllData(Array.isArray(leaderRes.data) ? leaderRes.data : []);
            setCourses(Array.isArray(courseRes.data) ? courseRes.data : []);
        } catch (err) {
            console.error("Leaderboard Sync Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDomain = activeDomain === "All" || course.category === activeDomain || course.domain === activeDomain;
        return matchesSearch && matchesDomain;
    });

    const getRankStyle = (rank) => {
        if (rank === 1) return { bg: '#FFF7ED', text: '#EA580C', border: '#FED7AA', label: '1st' };
        if (rank === 2) return { bg: '#F8FAFC', text: '#475569', border: '#E2E8F0', label: '2nd' };
        if (rank === 3) return { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A', label: '3rd' };
        return { bg: 'transparent', text: colors.subText, border: 'transparent', label: `${rank}th` };
    };

    const dynamicStyles = {
        page: { ...styles.page, backgroundColor: colors.background },
        glassCard: { 
            backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.4)' : '#ffffff',
            border: `1px solid ${colors.border}`,
            boxShadow: isDarkMode ? 'none' : '0 10px 30px rgba(0, 0, 0, 0.04)',
        },
        searchBox: {
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#ffffff',
            border: `1px solid ${colors.border}`,
            color: colors.text
        }
    };

    return (
        <div style={dynamicStyles.page}>
            <Navbar />
            <div style={styles.container}>
                
                {/*  CHAMPIONSHIP HEADER */}
                <div style={styles.header}>
                    <h1 style={{fontSize: '36px', fontWeight: '900', color: colors.text, margin: 0, letterSpacing: '-1.5px'}}>
                        SHIKSHASETU <span style={{color: colors.accent}}>LEADERBOARD</span>
                    </h1>
                    <p style={{color: colors.subText, fontSize: '13px', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '1.5px', marginTop: '6px'}}>
                        {selectedCourse === 'Global' ? 'GLOBAL RANKINGS' : `${selectedCourse} RESULTS`}
                    </p>
                </div>

                {/*  SEARCH & DOMAIN FILTERS */}
                <div style={styles.filterWrapper}>
                    <div style={styles.searchContainer}>
                        <input 
                            type="text" 
                            placeholder="Search for a course..." 
                            style={{...styles.searchInput, ...dynamicStyles.searchBox}}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div style={styles.domainContainer}>
                        {domains.map(domain => (
                            <button 
                                key={domain}
                                onClick={() => setActiveDomain(domain)}
                                style={styles.domainBtn(activeDomain === domain, colors)}
                            >
                                {domain}
                            </button>
                        ))}
                    </div>
                </div>

                {/*  HORIZONTAL COURSE SELECTOR */}
                <div style={styles.tabScroll}>
                    <button 
                        style={styles.pill(selectedCourse === 'Global', colors)}
                        onClick={() => setSelectedCourse('Global')}
                    >
                        🌏 Global
                    </button>
                    {filteredCourses.map(course => (
                        <button 
                            key={course.id}
                            style={styles.pill(selectedCourse === course.title, colors)}
                            onClick={() => setSelectedCourse(course.title)}
                        >
                            {course.title}
                        </button>
                    ))}
                </div>

                {/*  RANKINGS DISPLAY SECTION */}
                {loading ? (
                    <div style={{textAlign: 'center', color: colors.accent, padding: '8px', fontWeight: '700'}}>Syncing ranks...</div>
                ) : filteredLeaderboard.length === 0 ? (
                    <div style={{...styles.emptyBox, ...dynamicStyles.glassCard}}>
                        <div style={{fontSize: '48px', marginBottom: '15px'}}>✨</div>
                        <h3 style={{color: colors.text, fontWeight: '800', margin: '0 0 10px 0'}}>NO ENTRIES FOUND</h3>
                        <p style={{color: colors.subText, margin: '0 0 20px 0', fontSize: '14px'}}>Be the first student to claim a spot on this leaderboard!</p>
                        <button style={{...styles.actionBtn, backgroundColor: colors.accent}} onClick={() => navigate('/quiz')}>Take Quiz 🚀</button>
                    </div>
                ) : (
                    <div style={{...styles.mainContent, ...dynamicStyles.glassCard}}>
                        <div style={styles.tableHead}>
                           <span style={{width: '65px', textAlign: 'center'}}>RANK</span>
                           <span style={{flex: 1}}>STUDENT DETAILS</span>
                           <span style={{textAlign: 'right', paddingRight: '15px'}}>SCORE</span>
                        </div>

                        {filteredLeaderboard.map((student, index) => {
                            const rank = index + 1;
                            const rStyle = getRankStyle(rank);
                            const isTopThree = rank <= 3;
                            
                            
                            const displayScore = student.currentCourseScore !== undefined ? student.currentCourseScore : student.totalScore;

                            return (
                                <div 
                                    key={index} 
                                    style={{
                                        ...styles.tableRow, 
                                        borderBottom: index !== filteredLeaderboard.length - 1 ? `1px solid ${colors.border}44` : 'none',
                                        backgroundColor: isTopThree && !isDarkMode ? rStyle.bg : 'transparent',
                                        borderRadius: isTopThree ? '12px' : '0px',
                                        margin: isTopThree ? '4px 0' : '0px'
                                    }}
                                >
                                    <div style={styles.rankCol}>
                                        <div style={{
                                            ...styles.rankBadge,
                                            backgroundColor: isDarkMode && isTopThree ? 'rgba(255,255,255,0.05)' : rStyle.bg,
                                            borderColor: rStyle.border,
                                            color: rStyle.text,
                                            border: isTopThree ? '1px solid' : 'none',
                                            fontWeight: isTopThree ? '800' : '600'
                                        }}>
                                            {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rStyle.label}
                                        </div>
                                    </div>

                                    <div style={styles.studentInfoCol}>
                                        <div style={styles.avatarMini}>
                                            {student.studentName ? student.studentName.charAt(0).toUpperCase() : 'S'}
                                        </div>
                                        <div>
                                            <div style={{fontWeight: '700', color: colors.text, fontSize: '15px'}}>{student.studentName}</div>
                                            <div style={{fontSize: '12px', color: colors.subText, marginTop: '2px'}}>{student.studentEmail}</div>
                                        </div>
                                    </div>

                                    <div style={styles.scoreCol}>
                                        <div style={{color: isTopThree ? colors.accent : colors.text, fontWeight: '800', fontSize: '18px'}}>
                                            {displayScore}
                                        </div>
                                        <div style={{fontSize: '10px', color: colors.subText, fontWeight: '700', textTransform: 'uppercase', marginTop: '2px'}}>Points</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    page: { minHeight: '100vh', paddingTop: '130px', paddingBottom: '80px', transition: '0.3s' },
    container: { maxWidth: '850px', margin: '0 auto', padding: '0 25px' },
    header: { textAlign: 'center', marginBottom: '35px' },
    filterWrapper: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', marginBottom: '25px' },
    searchContainer: { width: '100%', maxWidth: '500px' },
    searchInput: { width: '100%', padding: '12px 20px', borderRadius: '14px', outline: 'none', fontSize: '14px' },
    domainContainer: { display: 'flex', gap: '8px' },
    domainBtn: (active, colors) => ({
        padding: '6px 15px', borderRadius: '8px', border: `1px solid ${active ? colors.accent : colors.border}`,
        backgroundColor: active ? colors.accent : 'transparent', color: active ? 'white' : colors.subText,
        fontSize: '12px', fontWeight: '700', cursor: 'pointer', transition: '0.2s'
    }),
    tabScroll: { display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '15px', marginBottom: '25px', scrollbarWidth: 'none' },
    pill: (active, colors) => ({
        padding: '10px 18px', borderRadius: '100px', border: '1px solid', borderColor: active ? colors.accent : colors.border,
        backgroundColor: active ? `${colors.accent}11` : colors.card, color: active ? colors.accent : colors.subText,
        cursor: 'pointer', fontWeight: '700', fontSize: '13px', whiteSpace: 'nowrap', transition: '0.2s'
    }),
    mainContent: { borderRadius: '24px', padding: '15px', display: 'flex', flexDirection: 'column', gap: '4px' },
    tableHead: { display: 'flex', padding: '10px 15px', fontSize: '11px', fontWeight: '800', color: '#64748b', letterSpacing: '1px' },
    tableRow: { display: 'flex', alignItems: 'center', padding: '14px 15px', transition: 'background-color 0.2s ease' },
    rankCol: { width: '65px', display: 'flex', justifyContent: 'center' },
    rankBadge: { width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' },
    studentInfoCol: { flex: 1, display: 'flex', alignItems: 'center', gap: '14px' },
    avatarMini: { width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#e2e8f0', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '15px' },
    scoreCol: { textAlign: 'center', minWidth: '70px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    emptyBox: { textAlign: 'center', padding: '60px 20px', borderRadius: '24px' },
    actionBtn: { padding: '10px 24px', border: 'none', borderRadius: '12px', color: 'white', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }
};

export default Leaderboard;