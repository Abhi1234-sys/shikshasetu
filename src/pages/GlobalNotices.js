import React, { useState, useEffect } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import { 
    broadcastNotice, 
    getAnnouncements, 
    deleteAnnouncement, 
    updateAnnouncement 
} from '../services/api';

const GlobalNotices = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [notice, setNotice] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const res = await getAnnouncements();
           
            const sorted = (res.data || []).sort((a, b) => b.id - a.id);
            setAnnouncements(sorted);
        } catch (err) {
            console.error("Error fetching notices:", err);
        }
    };

    const handleSave = async () => {
        if (!notice.trim()) return alert("Notice content cannot be empty.");
        
        setLoading(true);
        try {
            if (isEditing) {
                await updateAnnouncement(currentId, notice);
            } else {
                await broadcastNotice(notice);
            }
            
            
            setNotice("");
            setIsEditing(false);
            setCurrentId(null);
            fetchAnnouncements(); 
            
        } catch (err) {
            alert(" Operation failed. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure? This will remove the notice for all students.")) {
            try {
                await deleteAnnouncement(id);
                fetchAnnouncements();
            } catch (err) {
                alert(" Delete failed");
            }
        }
    };

    const startEdit = (item) => {
        setNotice(item.message);
        setCurrentId(item.id);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
    };

    return (
        <div style={styles.page}>
            <AdminNavbar />
            <div style={styles.container}>
                <header style={styles.headerSection}>
                    <h2 style={styles.title}>Global Notice Manager 📢</h2>
                    <p style={styles.subtitle}>Broadcast important updates to all students</p>
                </header>
                
                {/*  NOTICE EDITOR */}
                <div style={styles.editorCard}>
                    <h3 style={styles.cardLabel}>
                        {isEditing ? "✏️ Modify Announcement" : "🚀 New Broadcast"}
                    </h3>
                    <textarea 
                        style={styles.textarea} 
                        value={notice} 
                        onChange={(e) => setNotice(e.target.value)}
                        placeholder="Type your announcement here..."
                    />
                    <div style={styles.buttonGroup}>
                        <button 
                            style={{...styles.mainBtn, opacity: loading ? 0.7 : 1}} 
                            onClick={handleSave} 
                            disabled={loading}
                        >
                            {loading ? "Processing..." : isEditing ? "Update Notice" : "Broadcast Now"}
                        </button>
                        
                        {isEditing && (
                            <button 
                                style={styles.cancelBtn} 
                                onClick={() => { setIsEditing(false); setNotice(""); }}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>

                {/* BROADCAST HISTORY */}
                <div style={styles.historyWrapper}>
                    <h3 style={styles.historyTitle}>Broadcast History</h3>
                    {announcements.length > 0 ? (
                        announcements.map(item => (
                            <div key={item.id} style={styles.historyCard}>
                                <div style={styles.cardBody}>
                                    <p style={styles.messageText}>{item.message}</p>
                                </div>
                                <div style={styles.cardActions}>
                                    <button onClick={() => startEdit(item)} style={styles.actionBtnEdit}>Edit</button>
                                    <button onClick={() => handleDelete(item.id)} style={styles.actionBtnDel}>Delete</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={styles.emptyState}>No previous notices found.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    page: { background: '#f8fafc', minHeight: '100vh' },
    container: { maxWidth: '850px', margin: '0 auto', paddingTop: '120px', paddingBottom: '60px', paddingLeft: '20px', paddingRight: '20px' },
    headerSection: { marginBottom: '35px' },
    title: { fontWeight: '900', color: '#0f172a', fontSize: '32px', margin: '0 0 8px 0' },
    subtitle: { color: '#64748b', fontSize: '16px' },
    
    editorCard: { 
        background: '#fff', 
        padding: '35px', 
        borderRadius: '24px', 
        border: '1px solid #e2e8f0', 
        marginBottom: '50px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)'
    },
    cardLabel: { fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '20px' },
    textarea: { 
        width: '100%', 
        minHeight: '130px', 
        padding: '20px', 
        borderRadius: '15px', 
        border: '1.5px solid #f1f5f9', 
        background: '#f8fafc',
        marginBottom: '20px', 
        outline: 'none',
        fontSize: '16px',
        fontFamily: 'inherit',
        resize: 'vertical',
        transition: 'border-color 0.2s'
    },
    buttonGroup: { display: 'flex', gap: '12px' },
    mainBtn: { background: '#0f172a', color: '#fff', padding: '14px 35px', borderRadius: '12px', border: 'none', fontWeight: '700', cursor: 'pointer', fontSize: '15px' },
    cancelBtn: { background: '#fff', color: '#64748b', padding: '14px 25px', borderRadius: '12px', border: '1px solid #e2e8f0', fontWeight: '600', cursor: 'pointer' },
    
    historyWrapper: { borderTop: '2px solid #f1f5f9', paddingTop: '40px' },
    historyTitle: { fontSize: '20px', fontWeight: '800', color: '#334155', marginBottom: '25px' },
    historyCard: { 
        background: '#fff', 
        padding: '25px', 
        borderRadius: '20px', 
        border: '1px solid #e2e8f0', 
        marginBottom: '18px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)'
    },
    messageText: { fontSize: '16px', color: '#334155', lineHeight: '1.7', margin: 0 },
    cardActions: { display: 'flex', gap: '25px', marginTop: '20px', borderTop: '1px solid #f1f5f9', paddingTop: '15px' },
    actionBtnEdit: { color: '#2563eb', background: 'none', border: 'none', fontWeight: '800', cursor: 'pointer', fontSize: '14px' },
    actionBtnDel: { color: '#dc2626', background: 'none', border: 'none', fontWeight: '800', cursor: 'pointer', fontSize: '14px' },
    emptyState: { textAlign: 'center', padding: '40px', color: '#94a3b8', fontSize: '16px', fontStyle: 'italic' }
};

export default GlobalNotices;