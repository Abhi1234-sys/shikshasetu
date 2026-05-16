import React, { useState, useEffect } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import { getAllStudents } from '../services/api';

const StudentDirectory = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await getAllStudents();
           
            console.log("Fetched Students Data:", res.data);
            setStudents(res.data || []);
        } catch (err) {
            console.error("Error fetching students:", err);
        } finally {
            setLoading(false);
        }
    };

    
    const filteredStudents = students.filter(s => 
        (s.name && s.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
        (s.email && s.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div style={styles.page}>
            <AdminNavbar />
            
            <div style={styles.container}>
                <header style={styles.header}>
                    <h2 style={styles.title}>Student Directory 👥</h2>
                    <div style={styles.searchWrapper}>
                        <input 
                            type="text" 
                            placeholder="🔍 Search student name or email..." 
                            style={styles.searchBar}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div style={styles.countBadge}>Total: {students.length}</div>
                    </div>
                </header>
                
                <div style={styles.mainCard}>
                    {loading ? (
                        <div style={styles.loaderWrapper}>
                            <p style={styles.loaderText}>Fetching student records...</p>
                        </div>
                    ) : (
                        <div style={styles.tableResponsive}>
                            <table style={styles.table}>
                                <thead>
                                    <tr style={styles.tableHeader}>
                                        <th style={styles.th}>Student Identity</th>
                                        <th style={styles.th}>Contact Email</th>
                                        <th style={styles.th}>Enrollment Date</th>
                                        <th style={styles.th}>Active Learning Paths</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStudents.length > 0 ? filteredStudents.map((student, index) => (
                                        <tr key={student.id || index} style={styles.tableRow}>
                                            <td style={styles.nameCell}>
                                                <div style={styles.avatar}>
                                                    {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                                                </div>
                                                <span style={styles.studentName}>{student.name || "Unknown"}</span>
                                            </td>
                                            <td style={styles.emailCell}>{student.email}</td>
                                            <td style={styles.dateCell}>
                                                {student.enrollmentDate || "N/A"}
                                            </td>
                                            <td style={styles.courseCell}>
                                                <div style={styles.tagContainer}>
                                                    {/*  */}
                                                    {Array.isArray(student.enrolledCourses) && student.enrolledCourses.length > 0 ? (
                                                        student.enrolledCourses.map((courseName, idx) => (
                                                            <span key={idx} style={styles.courseTag}>
                                                                {courseName}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span style={styles.noEnrollment}>No active courses</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" style={styles.emptyState}>
                                                No students found matching your search.
                                            </td>
                                        </tr>
                                    )}
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
    page: { background: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' },
    container: { maxWidth: '1300px', margin: '0 auto', paddingTop: '120px', paddingBottom: '60px', paddingLeft: '20px', paddingRight: '20px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' },
    title: { fontWeight: '900', color: '#0f172a', fontSize: '32px', margin: 0 },
    searchWrapper: { display: 'flex', alignItems: 'center', gap: '15px' },
    searchBar: { padding: '12px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', width: '320px', outline: 'none', fontSize: '14px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' },
    countBadge: { background: '#111827', color: '#fff', padding: '10px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: '700' },
    mainCard: { background: '#fff', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)', overflow: 'hidden' },
    tableResponsive: { overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse' },
    tableHeader: { textAlign: 'left', background: '#f8fafc', borderBottom: '2px solid #f1f5f9' },
    th: { padding: '18px 25px', fontSize: '12px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' },
    tableRow: { borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' },
    nameCell: { padding: '20px 25px', display: 'flex', alignItems: 'center', gap: '12px' },
    avatar: { width: '36px', height: '36px', background: '#10b981', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '14px' },
    studentName: { fontWeight: '700', color: '#1e293b', fontSize: '16px' },
    emailCell: { padding: '20px 25px', color: '#64748b', fontSize: '14px' },
    dateCell: { padding: '20px 25px', color: '#64748b', fontSize: '14px' },
    courseCell: { padding: '20px 25px' },
    tagContainer: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
    courseTag: { background: '#f0fdf4', color: '#10b981', padding: '5px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '800', border: '1px solid #dcfce7' },
    noEnrollment: { color: '#cbd5e1', fontSize: '13px', fontStyle: 'italic' },
    emptyState: { textAlign: 'center', padding: '60px', color: '#94a3b8', fontSize: '16px' },
    loaderWrapper: { padding: '100px', textAlign: 'center' },
    loaderText: { color: '#64748b', fontWeight: '600' }
};

export default StudentDirectory;