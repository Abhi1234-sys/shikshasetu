import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CertificateView = () => {
    const { courseTitle } = useParams(); 
    const navigate = useNavigate();
    
    const userName = localStorage.getItem('name') || "Student Name";
    const date = new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const handlePrint = () => {
        window.print();
    };

    return (
        <div style={styles.page}>
            <div className="no-print" style={styles.actionBar}>
                <button onClick={() => navigate(-1)} style={styles.backBtn}>← Back to Dashboard</button>
                <button onClick={handlePrint} style={styles.downloadBtn}>Download Certificate (PDF)</button>
            </div>

            <div id="certificate" style={styles.certificateFrame}>
                <div style={styles.innerBorder}>
                    <div style={styles.content}>
                        
                        <div style={styles.logo}>🎓 ShikshaSetu</div>
                        
                        <h1 style={styles.mainTitle}>CERTIFICATE OF COMPLETION</h1>
                        <p style={styles.subtext}>This is to certify that</p>
                        
                        <h2 style={styles.studentName}>{userName}</h2>
                        
                        <p style={styles.subtext}>has successfully completed the course</p>
                        
                        <h3 style={styles.courseName}>{decodeURIComponent(courseTitle)}</h3>
                        
                        {/*  */}
                        <div style={styles.footer}>
                            <div style={styles.signBlock}>
                                <div style={styles.signature}>Admin</div>
                                <div style={styles.signLine}></div>
                                <span style={styles.label}>Platform Director</span>
                            </div>
                            
                            <div style={styles.signBlock}>
                                <div style={{height: '35px'}}></div> 
                                <div style={styles.signLine}></div>
                                <span style={styles.label}>Verified Official</span>
                            </div>
                        </div>

                        <div style={styles.badge}>
                            <span style={{fontSize: '10px', marginBottom: '2px'}}>ISSUED ON</span>
                            {date}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');

                @media print {
                    .no-print { display: none !important; }
                    body { margin: 0; padding: 0; background: #fff; }
                    @page { size: landscape; margin: 0; }
                    #certificate { box-shadow: none !important; border: 20px solid #1e293b !important; }
                }
            `}</style>
        </div>
    );
};

const styles = {
    page: { 
        minHeight: '100vh', 
        backgroundColor: '#f1f5f9', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        padding: '40px 20px',
        fontFamily: "'Inter', sans-serif"
    },
    actionBar: { 
        width: '1000px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginBottom: '20px' 
    },
    backBtn: { 
        background: 'none', 
        border: 'none', 
        color: '#64748b', 
        cursor: 'pointer', 
        fontWeight: '700',
        fontSize: '15px'
    },
    downloadBtn: { 
        backgroundColor: '#10b981', 
        color: 'white', 
        border: 'none', 
        padding: '12px 24px', 
        borderRadius: '10px', 
        fontWeight: 'bold', 
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
    },
    certificateFrame: { 
        width: '1000px', 
        height: '700px', 
        backgroundColor: '#fff', 
        padding: '25px', 
        border: '20px solid #1e293b', 
        boxShadow: '0 40px 80px rgba(0,0,0,0.15)', 
        position: 'relative', 
        boxSizing: 'border-box' 
    },
    innerBorder: { 
        height: '100%', 
        border: '2px solid #10b981', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '20px' 
    },
    content: { textAlign: 'center', width: '100%' },
    logo: { 
        fontSize: '24px', 
        fontWeight: '900', 
        color: '#10b981', 
        marginBottom: '30px' 
    },
    mainTitle: { 
        fontSize: '48px', 
        fontWeight: '900', 
        color: '#1e293b', 
        letterSpacing: '3px', 
        marginBottom: '5px' 
    },
    subtext: { fontSize: '16px', color: '#64748b', margin: '10px 0', fontWeight: '500' },
    studentName: { 
        fontSize: '56px', 
        fontFamily: "'Playfair Display', serif", 
        color: '#10b981', 
        margin: '15px 0', 
        display: 'inline-block' 
    },
    courseName: { 
        fontSize: '32px', 
        fontWeight: '800', 
        color: '#1e293b', 
        margin: '5px 0'
    },
    footer: { 
        display: 'flex', 
        justifyContent: 'space-around', 
        marginTop: '40px' 
    },
    signBlock: { textAlign: 'center' },
    signature: { 
        fontFamily: "'Dancing Script', cursive", 
        fontSize: '26px', 
        color: '#1e293b'
    },
    signLine: { 
        width: '180px', 
        height: '1px', 
        backgroundColor: '#1e293b', 
        margin: '8px auto' 
    },
    label: { fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' },
    badge: { 
        position: 'absolute', 
        bottom: '40px', 
        right: '50px', 
        border: '4px double #10b981', 
        borderRadius: '50%', 
        width: '100px', 
        height: '100px', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        fontSize: '10px', 
        fontWeight: '800', 
        color: '#10b981', 
        transform: 'rotate(-10deg)',
        backgroundColor: '#fff',
        textAlign: 'center',
        lineHeight: '1.2'
    }
};

export default CertificateView;