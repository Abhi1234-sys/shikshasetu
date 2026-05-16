import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
    getAllCourses, 
    updateCourse, 
    getQuizByCourse, 
    addQuizQuestion, 
    updateQuizQuestion, 
    deleteQuizQuestion 
} from '../services/api';
import AdminNavbar from '../components/AdminNavbar';

const ManageCourse = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [message, setMessage] = useState('');
    const [editData, setEditData] = useState({ title: '', courseLink: '' });
    const [currentQuiz, setCurrentQuiz] = useState([]);
    const [editingId, setEditingId] = useState(null);

    
    const [quizForm, setQuizForm] = useState({
        questionText: '',
        option1: '', option2: '', option3: '', option4: '',
        correctAnswer: ''
    });

    const questionInputRef = useRef(null);

    const loadCourses = useCallback(async () => {
        try {
            const res = await getAllCourses();
            setCourses(res.data || []);
        } catch (err) { 
            console.error("Error loading courses", err); 
        }
    }, []);

    const fetchQuiz = useCallback(async (courseId) => {
        if (!courseId) return;
        try {
            const res = await getQuizByCourse(courseId);
            setCurrentQuiz(res.data || []);
        } catch (err) { 
            setCurrentQuiz([]); 
        }
    }, []);

    useEffect(() => { 
        loadCourses(); 
    }, [loadCourses]);

    const handleSelectCourse = (course) => {
        setSelectedCourse(course);
        setEditData({ title: course.title, courseLink: course.courseLink || '' });
        setEditingId(null);
        resetQuizForm();
        fetchQuiz(course.id);
    };

    const resetQuizForm = () => {
        setQuizForm({ 
            questionText: '', 
            option1: '', 
            option2: '', 
            option3: '', 
            option4: '', 
            correctAnswer: '' 
        });
        setEditingId(null);
        
        if (questionInputRef.current) questionInputRef.current.focus();
    };

    const handleUpdateCourseInfo = async () => {
        if (!selectedCourse) return;
        try {
            
            await updateCourse(selectedCourse.id, { 
                ...selectedCourse, 
                title: editData.title, 
                courseLink: editData.courseLink 
            });
            setMessage(' Course info synced to database!');
            loadCourses();
            setTimeout(() => setMessage(''), 3000);
        } catch (err) { 
            setMessage(' Update failed'); 
        }
    };

    const handleSaveQuestion = async (e) => {
        e.preventDefault();
        if (!selectedCourse) return;

        
        const payload = { 
            ...quizForm, 
            course: { id: selectedCourse.id } 
        };

        try {
            if (editingId) {
                await updateQuizQuestion(editingId, payload);
                setMessage(' Question updated!');
            } else {
                await addQuizQuestion(payload);
                setMessage(' Question added! Ready for next.');
            }
            
            // Refresh list and clear form
            fetchQuiz(selectedCourse.id);
            resetQuizForm(); 
            setTimeout(() => setMessage(''), 3000);
        } catch (err) { 
            console.error("Save failed:", err);
            setMessage(' Operation failed.'); 
        }
    };

    const startEdit = (q) => {
        setEditingId(q.id);
        setQuizForm({ 
            questionText: q.questionText, 
            option1: q.option1, 
            option2: q.option2, 
            option3: q.option3, 
            option4: q.option4, 
            correctAnswer: q.correctAnswer 
        });
        window.scrollTo({ top: 350, behavior: 'smooth' });
    };

    const handleDelete = async (qId) => {
        if (!window.confirm("Delete this question permanently?")) return;
        try {
            await deleteQuizQuestion(qId);
            fetchQuiz(selectedCourse.id);
            setMessage('🗑️ Question removed.');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) { 
            setMessage(' Delete failed'); 
        }
    };

    return (
        <div style={styles.page}>
            <AdminNavbar />
            <div style={styles.container}>
                <h1 style={styles.mainTitle}>Advanced Course Manager </h1>
                {message && <div style={styles.statusMessage}>{message}</div>}
                
                <div style={styles.layout}>
                    <aside style={styles.sidebar}>
                        <h3 style={styles.sbHeader}>COURSES</h3>
                        {courses.length > 0 ? courses.map(c => (
                            <button key={c.id} onClick={() => handleSelectCourse(c)} 
                                style={{
                                    ...styles.sidebarItem, 
                                    borderLeft: selectedCourse?.id === c.id ? '5px solid #10b981' : '5px solid transparent',
                                    backgroundColor: selectedCourse?.id === c.id ? '#f0fdf4' : '#fff'
                                }}>
                                {c.title}
                            </button>
                        )) : <p style={{fontSize: '12px', color: '#94a3b8'}}>No courses found.</p>}
                    </aside>

                    <main style={styles.editorPanel}>
                        {selectedCourse ? (
                            <>
                                <section style={styles.section}>
                                    <h2 style={{fontSize: '20px', marginBottom: '15px'}}>Editing: {selectedCourse.title}</h2>
                                    <label style={styles.label}>Course Study Link</label>
                                    <input 
                                        style={styles.input} 
                                        placeholder="Enter permanent link (e.g. https://...)"
                                        value={editData.courseLink} 
                                        onChange={e => setEditData({...editData, courseLink: e.target.value})} 
                                    />
                                    <button onClick={handleUpdateCourseInfo} style={styles.syncBtn}>Update & Sync Link</button>
                                </section>

                                <hr style={styles.divider} />

                                <section style={styles.quizBuilder}>
                                    <h3 style={styles.subHeader}> Quiz Builder</h3>
                                    <form onSubmit={handleSaveQuestion}>
                                        <input 
                                            ref={questionInputRef} 
                                            style={styles.inputFull} 
                                            placeholder="Enter Question Text" 
                                            value={quizForm.questionText} 
                                            onChange={e => setQuizForm({...quizForm, questionText: e.target.value})} 
                                            required 
                                        />
                                        <div style={styles.row}>
                                            <input style={styles.inputHalf} placeholder="Option 1" value={quizForm.option1} onChange={e => setQuizForm({...quizForm, option1: e.target.value})} required />
                                            <input style={styles.inputHalf} placeholder="Option 2" value={quizForm.option2} onChange={e => setQuizForm({...quizForm, option2: e.target.value})} required />
                                        </div>
                                        <div style={styles.row}>
                                            <input style={styles.inputHalf} placeholder="Option 3" value={quizForm.option3} onChange={e => setQuizForm({...quizForm, option3: e.target.value})} required />
                                            <input style={styles.inputHalf} placeholder="Option 4" value={quizForm.option4} onChange={e => setQuizForm({...quizForm, option4: e.target.value})} required />
                                        </div>
                                        <input 
                                            style={styles.inputFull} 
                                            placeholder="Correct Answer (Exact Match)" 
                                            value={quizForm.correctAnswer} 
                                            onChange={e => setQuizForm({...quizForm, correctAnswer: e.target.value})} 
                                            required
                                        />
                                        <button type="submit" style={styles.addBtn}>
                                            {editingId ? "Update Question" : "Add Question & Move to Next"}
                                        </button>
                                        {editingId && (
                                            <button type="button" onClick={resetQuizForm} style={{...styles.addBtn, background: '#64748b', marginTop: '10px'}}>
                                                Cancel Edit
                                            </button>
                                        )}
                                    </form>
                                </section>

                                <div style={styles.qList}>
                                    <h4 style={{marginBottom: '15px', color: '#64748b'}}>Questions In This Course ({currentQuiz.length})</h4>
                                    {currentQuiz.map((q, i) => (
                                        <div key={q.id} style={styles.qItem}>
                                            <span style={{fontSize: '14px'}}><strong>Q{i+1}:</strong> {q.questionText}</span>
                                            <div style={{display: 'flex', gap: '15px'}}>
                                                <button onClick={() => startEdit(q)} style={styles.editBtn}>Edit</button>
                                                <button onClick={() => handleDelete(q.id)} style={styles.delBtn}>Delete</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : <div style={styles.placeholder}><h3>Select a course from the sidebar to start.</h3></div>}
                    </main>
                </div>
            </div>
        </div>
    );
};

const styles = {
    page: { background: '#f8fafc', minHeight: '100vh' },
    container: { maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' },
    mainTitle: { fontSize: '28px', fontWeight: '800', marginBottom: '30px', color: '#1e293b' },
    layout: { display: 'flex', gap: '25px', alignItems: 'flex-start' },
    sidebar: { flex: '0 0 300px', background: '#fff', padding: '20px', borderRadius: '15px', border: '1px solid #e2e8f0', position: 'sticky', top: '20px' },
    sbHeader: { fontSize: '12px', color: '#94a3b8', marginBottom: '15px', letterSpacing: '1px' },
    sidebarItem: { width: '100%', padding: '15px', textAlign: 'left', background: '#fff', border: 'none', cursor: 'pointer', marginBottom: '8px', borderRadius: '10px', fontWeight: '600', transition: '0.2s' },
    editorPanel: { flex: 1, background: '#fff', padding: '40px', borderRadius: '15px', border: '1px solid #e2e8f0', minHeight: '600px' },
    section: { display: 'flex', flexDirection: 'column', gap: '10px' },
    label: { fontSize: '13px', fontWeight: '700', color: '#64748b' },
    input: { padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' },
    syncBtn: { padding: '14px', background: '#1e293b', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', marginTop: '5px' },
    divider: { margin: '40px 0', border: 'none', borderTop: '1px solid #f1f5f9' },
    quizBuilder: { background: '#f8fafc', padding: '25px', borderRadius: '12px', border: '1px solid #e2e8f0' },
    subHeader: { fontSize: '18px', fontWeight: '700', marginBottom: '20px' },
    inputFull: { width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box' },
    row: { display: 'flex', gap: '10px', marginBottom: '10px' },
    inputHalf: { flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' },
    addBtn: { width: '100%', padding: '14px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' },
    qList: { marginTop: '40px' },
    qItem: { display: 'flex', justifyContent: 'space-between', padding: '18px', borderBottom: '1px solid #f1f5f9', alignItems: 'center' },
    statusMessage: { background: '#dcfce7', color: '#166534', padding: '15px', borderRadius: '10px', marginBottom: '20px', textAlign: 'center', fontWeight: '700', border: '1px solid #bbf7d0' },
    editBtn: { color: '#10b981', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700' },
    delBtn: { color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700' },
    placeholder: { textAlign: 'center', padding: '150px 0', color: '#94a3b8' }
};

export default ManageCourse;