import React, { useState } from 'react';

import API, { signup, enrollCourse, checkEmail } from '../services/api';

const RegistrationModal = ({ courseId, onComplete }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentClass: '', 
    password: 'studentPassword123', 
    role: 'STUDENT'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      const checkRes = await checkEmail(formData.email);
      let targetUserId = checkRes.data;

      
      if (targetUserId === 0 || targetUserId === null) {
        
        const regRes = await signup(formData);
        
        
        targetUserId = regRes.data.id; 
        
        localStorage.setItem("userName", regRes.data.name);
        localStorage.setItem("token", regRes.data.token);
      } else {
        
        console.log("Returning student identified with ID:", targetUserId);
      }

      
      localStorage.setItem("userId", targetUserId);

      
      await enrollCourse(targetUserId, courseId);

      alert(`✅ Access Granted! Successfully enrolled.`);
      onComplete(targetUserId); 
      
    } catch (err) {
      
      if (err.response && (err.response.status === 400 || err.response.status === 403)) {
          console.log("Enrollment already exists or permission bypass active.");
          onComplete(localStorage.getItem("userId"));
      } else {
          alert("❌ Setup failed. Please check your connection or try a different email.");
          console.error("Enrollment Error:", err);
      }
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>🎓 Identify Yourself</h2>
        <p style={styles.subtitle}>Use your registered email to unlock this course.</p>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <input 
            type="text" placeholder="Full Name" required 
            style={styles.input} onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <input 
            type="email" placeholder="Email Address" required 
            style={styles.input} onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input 
            type="text" placeholder="Your Class/Year (e.g. 3rd Year B.Tech)" required 
            style={styles.input} onChange={(e) => setFormData({...formData, studentClass: e.target.value})}
          />
          <button type="submit" style={styles.button}>Confirm & Enroll Now</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000 },
  modal: { background: '#fff', padding: '40px', borderRadius: '24px', width: '420px', textAlign: 'center', borderTop: '8px solid #10b981' }, 
  title: { fontSize: '24px', fontWeight: '800', color: '#111827', margin: '0 0 10px' },
  subtitle: { color: '#6b7280', marginBottom: '30px', fontSize: '14px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '14px', borderRadius: '12px', border: '1px solid #e5e7eb', outline: 'none' },
  button: { padding: '14px', borderRadius: '12px', background: '#10b981', color: '#fff', border: 'none', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)' } 
};

export default RegistrationModal;