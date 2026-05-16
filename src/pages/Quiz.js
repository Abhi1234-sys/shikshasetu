import React, { useState, useEffect, useCallback, useContext } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getQuizByCourse, submitQuiz } from '../services/api';
import { ThemeContext } from '../context/ThemeContext'; 

const Quiz = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    
    const { isDarkMode, colors } = useContext(ThemeContext);

    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isFinished, setIsFinished] = useState(false);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [timeLeft, setTimeLeft] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [timeTaken, setTimeTaken] = useState("");

    const fetchQuiz = useCallback(async () => {
        if (!id || id === "undefined") {
            navigate('/quiz-hub');
            return;
        }
        try {
            setLoading(true);
            const res = await getQuizByCourse(id);
            const data = res.data || [];
            if (data.length > 0) {
                setQuestions(data);
                setTimeLeft(data.length * 30);
                setStartTime(Date.now());
            } else {
                alert("No questions found for this course.");
                navigate('/quiz-hub');
            }
        } catch (err) {
            navigate('/quiz-hub');
        } finally {
            setLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => { fetchQuiz(); }, [fetchQuiz]);

    useEffect(() => {
        if (timeLeft > 0 && !isFinished && !loading) {
            const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && questions.length > 0 && !isFinished && !loading) {
            handleSubmit(); 
        }
    }, [timeLeft, isFinished, questions.length, loading]);

    const handleOptionSelect = (questionId, optionText) => {
        setAnswers(prev => ({ ...prev, [questionId]: optionText }));
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const end = Date.now();
            const diff = Math.floor((end - startTime) / 1000);
            setTimeTaken(`${Math.floor(diff / 60)}m ${diff % 60}s`);

            const res = await submitQuiz(id, answers);
            setResult(res.data);
            setIsFinished(true);
        } catch (err) { 
            console.error("Submission failed", err);
            setIsFinished(true); 
        } finally {
            setIsSubmitting(false);
        }
    };

    
    const dynamicStyles = {
        page: { ...styles.page, backgroundColor: colors.background },
        card: { 
            ...styles.quizCard, 
            backgroundColor: colors.card, 
            borderColor: colors.border,
            color: colors.text 
        },
        questionText: { ...styles.questionText, color: colors.text },
        timerBox: { 
            ...styles.timerBox, 
            backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.1)' : '#fff1f1',
            color: isDarkMode ? '#f87171' : '#991b1b'
        },
        secondaryBtn: { 
            ...styles.secondaryBtn, 
            backgroundColor: isDarkMode ? colors.background : '#fff',
            color: colors.subText,
            borderColor: colors.border
        }
    };

    if (loading || isSubmitting) {
        return (
            <div style={dynamicStyles.page}>
                <Navbar />
                <div style={{...styles.loader, color: colors.subText}}>
                    {isSubmitting ? "Generating Feedback..." : "Loading..."}
                </div>
            </div>
        );
    }

    if (isFinished) {
        const score = result?.score ?? 0;
        const total = result?.totalQuestions ?? questions.length;
        const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

        const getTheme = () => {
            if (percentage >= 80) return { color: colors.accent, glow: "rgba(16, 185, 129, 0.4)", text: "Mastery Achieved! 🏆" };
            if (percentage >= 50) return { color: "#f59e0b", glow: "rgba(245, 158, 11, 0.4)", text: "Good Progress! 👍" };
            return { color: "#ef4444", glow: "rgba(239, 68, 68, 0.4)", text: "Keep Learning! 📚" };
        };

        const resultTheme = getTheme();

        return (
            <div style={dynamicStyles.page}>
                <Navbar />
                <div style={styles.container}>
                    <div style={{...styles.resultCard, backgroundColor: colors.card, borderColor: colors.border}}>
                        <div style={styles.celebrationIcon}>{percentage >= 50 ? "✨" : "📖"}</div>
                        <h2 style={styles.finishTitle}>Assessment Finished</h2>
                        
                        <div style={styles.feedbackContainer}>
                            <h3 style={{...styles.feedbackHeading, color: resultTheme.color}}>{resultTheme.text}</h3>
                            <p style={{...styles.feedbackSub, color: colors.subText}}>
                                Assessment completed in <strong>{timeTaken}</strong>.
                            </p>
                        </div>

                        <div style={styles.progressWrapper}>
                            <div style={styles.barHeader}>
                                <span style={{...styles.barLabel, color: colors.text}}>Performance Proficiency</span>
                                <span style={{...styles.percentageText, color: resultTheme.color}}>{percentage}%</span>
                            </div>
                            <div style={{...styles.track, background: isDarkMode ? colors.background : '#f1f5f9'}}>
                                <div style={{
                                    ...styles.thumb, 
                                    width: `${percentage}%`, 
                                    backgroundColor: resultTheme.color,
                                    boxShadow: `0 0 20px ${resultTheme.glow}` 
                                }}></div>
                            </div>
                        </div>

                        <button onClick={() => navigate('/quiz-hub')} style={{...styles.primaryBtn, backgroundColor: colors.accent}}>
                            Return to Quiz Center
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentQ = questions[currentIndex];

    return (
        <div style={dynamicStyles.page}>
            <Navbar />
            <div style={styles.container}>
                <div style={styles.headerInfo}>
                    <div style={dynamicStyles.timerBox}>⏳ {timeLeft}s</div>
                    <div style={{...styles.progressText, color: colors.subText}}>Question {currentIndex + 1} of {questions.length}</div>
                </div>
                <div style={dynamicStyles.card}>
                    <h2 style={dynamicStyles.questionText}>{currentQ.questionText}</h2>
                    <div style={styles.optionsGrid}>
                        {[currentQ.option1, currentQ.option2, currentQ.option3, currentQ.option4].map((opt, i) => (
                            <button 
                                key={i} 
                                onClick={() => handleOptionSelect(currentQ.id, opt)}
                                style={{
                                    ...styles.optionBtn, 
                                    border: answers[currentQ.id] === opt ? `2.5px solid ${colors.accent}` : `1px solid ${colors.border}`, 
                                    background: answers[currentQ.id] === opt 
                                        ? (isDarkMode ? 'rgba(16, 185, 129, 0.1)' : '#f0fdf4') 
                                        : (isDarkMode ? colors.background : '#fff'),
                                    color: colors.text
                                }}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                    <div style={styles.quizFooter}>
                        <button disabled={currentIndex === 0} onClick={() => setCurrentIndex(prev => prev - 1)} style={dynamicStyles.secondaryBtn}>Back</button>
                        <button onClick={handleNext} style={{...styles.primaryBtn, backgroundColor: colors.accent}} disabled={!answers[currentQ.id]}>
                            {currentIndex === questions.length - 1 ? "Finish" : "Next"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    page: { minHeight: '100vh', paddingTop: '140px', transition: 'background-color 0.3s ease' },
    container: { maxWidth: '650px', margin: '0 auto', padding: '0 20px' },
    resultCard: { padding: '60px 50px', borderRadius: '35px', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.08)', border: '1px solid', transition: '0.3s' },
    celebrationIcon: { fontSize: '64px', marginBottom: '20px' },
    finishTitle: { fontSize: '14px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '30px' },
    feedbackContainer: { marginBottom: '40px' },
    feedbackHeading: { fontSize: '36px', fontWeight: '900', margin: '0 0 10px 0' },
    feedbackSub: { fontSize: '16px' },
    progressWrapper: { width: '100%', maxWidth: '500px', margin: '0 auto 50px' },
    barHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '12px' },
    barLabel: { fontSize: '12px', fontWeight: '800', textTransform: 'uppercase' },
    percentageText: { fontSize: '32px', fontWeight: '900', lineHeight: '1' },
    track: { height: '24px', borderRadius: '50px', overflow: 'hidden', padding: '4px' }, 
    thumb: { height: '100%', borderRadius: '50px', transition: 'width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)' },
    primaryBtn: { width: '100%', maxWidth: '350px', padding: '18px', color: '#fff', border: 'none', borderRadius: '18px', fontWeight: '800', cursor: 'pointer', fontSize: '16px', transition: '0.3s' },
    headerInfo: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px' },
    timerBox: { padding: '6px 14px', borderRadius: '8px', fontWeight: 'bold', transition: '0.3s' },
    progressText: { fontSize: '15px', fontWeight: '600' },
    quizCard: { padding: '40px', borderRadius: '24px', border: '1px solid', transition: '0.3s' },
    questionText: { fontSize: '22px', fontWeight: '800', marginBottom: '30px' },
    optionsGrid: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' },
    optionBtn: { padding: '18px', borderRadius: '12px', textAlign: 'left', cursor: 'pointer', fontWeight: '600', transition: '0.2s' },
    quizFooter: { display: 'flex', justifyContent: 'space-between' },
    secondaryBtn: { padding: '14px 30px', border: '1px solid', borderRadius: '10px', cursor: 'pointer', transition: '0.3s' },
    loader: { textAlign: 'center', padding: '200px 20px', fontSize: '24px', fontWeight: '700' }
};

export default Quiz;