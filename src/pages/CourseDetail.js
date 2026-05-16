import React, { useState, useEffect, useContext } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import RegistrationModal from '../components/RegistrationModal';
import { ThemeContext } from '../context/ThemeContext'; 
import { 
  getCourseDetails, getNote, saveNote, addRating, 
  getCourseRatings, checkEnrollment
} from '../services/api';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  
  const { isDarkMode, colors } = useContext(ThemeContext);

  const [course, setCourse] = useState(null);
  const [note, setNote] = useState("");
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]); 
  const [isSaving, setIsSaving] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showRegModal, setShowRegModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId"); 

  useEffect(() => {
    if (id) {
        initializeCourse();
    }
  }, [id, userId]);

  const initializeCourse = async () => {
    try {
      setLoading(true);
      const courseRes = await getCourseDetails(id);
      setCourse(courseRes.data);

      if (userId) {
        const enrollRes = await checkEnrollment(id, userId);
        setIsEnrolled(enrollRes.data); 

        if (enrollRes.data) {
          const noteRes = await getNote(id);
          if (noteRes.data) setNote(noteRes.data.content);
        }
      }
      fetchReviews();
    } catch (err) {
      console.error("Critical error during course initialization:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await getCourseRatings(id);
      setReviews(res.data || []);
    } catch (err) {
      console.error("Error fetching reviews", err);
    }
  };

  const handleEnrollClick = () => {
    setShowRegModal(true);
  };

  const handleEnrollmentSuccess = (newUserId) => {
    setShowRegModal(false);
    setIsEnrolled(true);
    initializeCourse(); 
  };

  const handleSaveNote = async () => {
    if (!isEnrolled) return;
    setIsSaving(true);
    try {
      await saveNote(id, { content: note });
      alert("Notes saved successfully!");
    } catch (err) {
      alert(" Failed to save notes.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!review.trim()) return alert("Please enter a review message.");
    try {
      await addRating(id, { stars: rating, comment: review });
      alert("⭐ Thank you for your review!");
      setReview("");
      fetchReviews(); 
    } catch (err) {
      alert("You have already rated this course.");
    }
  };

  const handleTakeQuiz = () => {
    if (id && id !== "undefined") {
        navigate(`/quiz/${id}`);
    } else {
        alert("Error: Course ID not found.");
    }
  };

  
  const dynamicStyles = {
    page: { ...styles.page, backgroundColor: colors.background },
    headerCard: { ...styles.headerCard, backgroundColor: colors.card, borderColor: colors.border },
    sectionCard: { ...styles.sectionCard, backgroundColor: colors.card, borderColor: colors.border },
    noteCard: { ...styles.noteCard, backgroundColor: colors.card, borderColor: colors.border },
    ratingCard: { ...styles.ratingCard, backgroundColor: colors.card, borderColor: colors.border },
    noteArea: { ...styles.noteArea, backgroundColor: isDarkMode ? colors.background : '#fffbeb', color: colors.text, borderColor: colors.border },
    reviewArea: { ...styles.reviewArea, backgroundColor: isDarkMode ? colors.background : '#fff', color: colors.text, borderColor: colors.border },
    select: { ...styles.select, backgroundColor: isDarkMode ? colors.background : '#fff', color: colors.text, borderColor: colors.border },
    lessonRow: { ...styles.lessonRow, backgroundColor: isDarkMode ? colors.background : '#f8fafc' },
    quizSection: { 
        ...styles.quizSection, 
        backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff',
        border: `2px dashed ${colors.accent}`
    },
    lockedQuizSection: {
        ...styles.lockedQuizSection,
        backgroundColor: isDarkMode ? colors.background : '#f1f5f9',
        borderColor: colors.border
    }
  };

  if (loading) return <div style={{...styles.loader, color: colors.text}}>Loading course materials...</div>;
  if (!course) return <div style={{...styles.loader, color: colors.text}}>Course not found.</div>;

  return (
    <div style={dynamicStyles.page}>
      <Navbar />

      {showRegModal && (
        <RegistrationModal 
          courseId={id} 
          onComplete={handleEnrollmentSuccess} 
        />
      )}

      <div style={styles.container}>
        <div style={dynamicStyles.headerCard}>
          <div style={styles.headerTop}>
             <h1 style={{...styles.title, color: colors.text}}>📖 {course.title}</h1>
             <div style={{...styles.metaBadge, backgroundColor: isDarkMode ? colors.background : '#f1f5f9', color: colors.subText}}>
                {course.category} • {course.level}
             </div>
          </div>
          <p style={{...styles.subtitle, color: colors.subText}}>{course.description}</p>
          
          <div style={styles.headerActions}>
            {!isEnrolled ? (
              <button style={styles.enrollHeaderBtn} onClick={handleEnrollClick}>
                Enroll Now to Unlock Curriculum
              </button>
            ) : (
              course.courseLink && (
                <a href={course.courseLink} target="_blank" rel="noreferrer" style={{...styles.mainStudyBtn, backgroundColor: colors.accent}}>
                  Primary Study Material ↗
                </a>
              )
            )}
          </div>
        </div>

        <div style={styles.contentGrid}>
          <div style={styles.mainCol}>
            <div style={dynamicStyles.sectionCard}>
              <h3 style={{...styles.sectionTitle, color: colors.text}}>Course Curriculum</h3>
              <div style={styles.lessonList}>
                {course.contents && course.contents.map((lesson, index) => (
                  <div key={lesson.id} style={dynamicStyles.lessonRow}>
                    <div style={{...styles.lessonNum, color: isDarkMode ? colors.border : '#e2e8f0'}}>{index + 1}</div>
                    <div style={styles.lessonInfo}>
                      <h4 style={{...styles.lessonTitle, color: colors.text}}>{lesson.title}</h4>
                      {isEnrolled ? (
                        <a href={lesson.contentUrl} target="_blank" rel="noreferrer" style={{...styles.studyBtn, color: colors.accent}}>
                          Start Learning ↗
                        </a>
                      ) : (
                        <span style={{...styles.studyBtn, color: colors.subText, cursor: 'not-allowed'}}>
                          🔒 Locked
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div style={isEnrolled ? dynamicStyles.quizSection : dynamicStyles.lockedQuizSection}>
                <h4 style={{...styles.quizText, color: isDarkMode ? colors.accent : '#1e3a8a'}}>
                  {isEnrolled ? "🏁 Ready for Assessment?" : "🔒 Assessment Locked"}
                </h4>
                <p style={{...styles.quizSubtext, color: colors.subText}}>
                  {isEnrolled ? "Complete the quiz to earn your ShikshaSetu certificate." : "Enroll now to access the final quiz."}
                </p>
                {isEnrolled && (
                  <button onClick={handleTakeQuiz} style={{...styles.quizBtn, backgroundColor: colors.text, color: colors.background}}>
                    Take Final Quiz 🎓
                  </button>
                )}
              </div>
            </div>

            <div style={{...dynamicStyles.sectionCard, marginTop: '25px'}}>
              <h3 style={{...styles.sectionTitle, color: colors.text}}>💬 Student Feedback</h3>
              <div style={styles.reviewList}>
                {reviews.length > 0 ? (
                  reviews.map((r, index) => (
                    <div key={r.id || index} style={{...styles.reviewItem, borderBottomColor: colors.border}}>
                      <div style={styles.reviewUserRow}>
                        <div style={{...styles.userAvatar, backgroundColor: colors.text, color: colors.background}}>
                            {(r.userName || "S").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong style={{fontSize: '14px', color: colors.text}}>{r.userName || "Student"}</strong>
                          <div style={{color: '#f59e0b', fontSize: '12px'}}>{'⭐'.repeat(r.stars || 5)}</div>
                        </div>
                      </div>
                      <p style={{...styles.reviewText, color: colors.subText}}>{r.comment}</p>
                    </div>
                  ))
                ) : (
                  <p style={{color: colors.subText, fontSize: '14px'}}>No reviews yet.</p>
                )}
              </div>
            </div>
          </div>

          <div style={styles.sideCol}>
            <div style={dynamicStyles.noteCard}>
              <h3 style={{...styles.sectionTitle, color: colors.text}}> My Notes</h3>
              <textarea 
                style={dynamicStyles.noteArea} 
                placeholder={isEnrolled ? "Jot down important points..." : "Enroll to unlock notes."}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                readOnly={!isEnrolled}
              />
              <button 
                style={{...styles.saveBtn, opacity: isEnrolled ? 1 : 0.5, backgroundColor: colors.text, color: colors.background}} 
                onClick={handleSaveNote} 
                disabled={isSaving || !isEnrolled}
              >
                {isSaving ? "Saving..." : "Save Notes"}
              </button>
            </div>

            <div style={dynamicStyles.ratingCard}>
              <h3 style={{...styles.sectionTitle, color: colors.text}}>⭐ Rate Course</h3>
              <select style={dynamicStyles.select} value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                <option value="5">⭐⭐⭐⭐⭐ (Excellent)</option>
                <option value="4">⭐⭐⭐⭐ (Very Good)</option>
                <option value="3">⭐⭐⭐ (Average)</option>
                <option value="2">⭐⭐ (Poor)</option>
                <option value="1">⭐ (Very Bad)</option>
              </select>
              <textarea 
                style={dynamicStyles.reviewArea} 
                placeholder="How was the course?"
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />
              <button style={{...styles.submitBtn, backgroundColor: colors.accent}} onClick={handleSubmitReview}>Submit Review</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', paddingBottom: '50px', transition: '0.3s' },
  container: { maxWidth: '1200px', margin: '0 auto', padding: '140px 20px 20px' },
  headerCard: { padding: '35px', borderRadius: '24px', marginBottom: '30px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', borderLeft: '8px solid #1e293b', borderRight: '1px solid', borderTop: '1px solid', borderBottom: '1px solid' },
  headerTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' },
  title: { fontSize: '32px', fontWeight: '800', margin: 0 },
  subtitle: { fontSize: '17px', marginTop: '12px', lineHeight: '1.6' },
  metaBadge: { padding: '6px 14px', borderRadius: '30px', fontSize: '13px', fontWeight: '700' },
  headerActions: { marginTop: '25px' },
  mainStudyBtn: { padding: '14px 28px', color: '#fff', borderRadius: '12px', fontWeight: '800', textDecoration: 'none', display: 'inline-block', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)' },
  enrollHeaderBtn: { padding: '14px 28px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)' },
  contentGrid: { display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' },
  mainCol: { display: 'flex', flexDirection: 'column' },
  sideCol: { display: 'flex', flexDirection: 'column' },
  sectionCard: { padding: '30px', borderRadius: '24px', border: '1px solid' },
  sectionTitle: { fontSize: '20px', fontWeight: '800', marginBottom: '25px' },
  lessonList: { display: 'flex', flexDirection: 'column', gap: '15px' },
  lessonRow: { display: 'flex', gap: '20px', padding: '18px', borderRadius: '15px', alignItems: 'center', transition: '0.2s' },
  lessonNum: { fontSize: '22px', fontWeight: '900' },
  lessonTitle: { fontSize: '16px', fontWeight: '700', margin: '0 0 6px 0' },
  studyBtn: { fontSize: '13px', fontWeight: '800', textDecoration: 'none' },
  quizSection: { marginTop: '40px', textAlign: 'center', padding: '30px', borderRadius: '20px' },
  lockedQuizSection: { marginTop: '40px', textAlign: 'center', padding: '30px', borderRadius: '20px', border: '2px solid' },
  quizText: { fontSize: '20px', fontWeight: '800', margin: '0 0 8px 0' },
  quizSubtext: { fontSize: '14px', marginBottom: '25px' },
  quizBtn: { padding: '15px 35px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: '800', fontSize: '15px' },
  noteCard: { padding: '25px', borderRadius: '24px', border: '1px solid', marginBottom: '30px' },
  noteArea: { width: '100%', height: '200px', padding: '18px', borderRadius: '15px', border: '1px solid', fontSize: '15px', outline: 'none', resize: 'none' },
  saveBtn: { width: '100%', marginTop: '12px', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: '800', cursor: 'pointer' },
  ratingCard: { padding: '25px', borderRadius: '24px', border: '1px solid' },
  select: { width: '100%', padding: '12px', borderRadius: '10px', marginBottom: '12px', border: '1px solid' },
  reviewArea: { width: '100%', height: '90px', padding: '12px', borderRadius: '10px', border: '1px solid', marginBottom: '12px', outline: 'none' },
  submitBtn: { width: '100%', padding: '12px', borderRadius: '10px', color: '#fff', border: 'none', fontWeight: '800', cursor: 'pointer' },
  reviewList: { display: 'flex', flexDirection: 'column', gap: '25px' },
  reviewItem: { paddingBottom: '20px', borderBottom: '1px solid' },
  reviewUserRow: { display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '10px' },
  userAvatar: { width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' },
  reviewText: { fontSize: '15px', margin: 0, fontStyle: 'italic', paddingLeft: '55px' },
  loader: { textAlign: 'center', padding: '150px', fontSize: '20px', fontWeight: '800' }
};

export default CourseDetails;