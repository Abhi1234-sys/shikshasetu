import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      {/*  */}
      <div style={styles.glowTop}></div>
      <div style={styles.glowBottom}></div>

      <div style={styles.container}>
        
        {/*  */}
        <div style={styles.badge}>
          <span style={styles.dot}></span>
          Empowering the next generation of engineers
        </div>

        <h1 style={styles.brandName}>ShikshaSetu</h1>
        
        <p style={styles.subtitle}>
          The most premium learning experience in India. Join thousands of 
          professionals mastering technology, design, and core engineering.
        </p>

        <div style={styles.buttonGroup}>
          <button 
            style={styles.getStartedBtn} 
            className="btn-primary"
            onClick={() => navigate("/login")}
          >
            Get Started Free
          </button>
          <button 
            style={styles.createAccountBtn} 
            className="btn-outline"
            onClick={() => navigate("/signup")}
          >
            Explore Courses
          </button>
        </div>

        {/*  */}
        <div style={styles.grid}>
          {[
            { num: "100+", label: "Expert Courses", icon: "📖" },
            { num: "50+", label: "Categories", icon: "⚡" },
            { num: "10K+", label: "Active Learners", icon: "👥" },
            { num: "100%", label: "Free Forever", icon: "💎" }
          ].map((stat, index) => (
            <div key={index} style={styles.card} className="stat-card">
              <div style={styles.cardIcon}>{stat.icon}</div>
              <h2 style={styles.statNumber}>{stat.num}</h2>
              <p style={styles.statLabel}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/*  */}
      <style>{`
        .btn-primary:hover {
          background-color: #059669 !important;
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(16, 185, 129, 0.25);
        }
        .btn-outline:hover {
          background-color: rgba(16, 185, 129, 0.05) !important;
          border-color: #10b981 !important;
          transform: translateY(-3px);
        }
        .stat-card:hover {
          transform: translateY(-10px);
          border-color: #10b981 !important;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.04);
        }
        .btn-primary, .btn-outline, .stat-card {
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1) !important;
        }
      `}</style>
    </div>
  );
};

const styles = {
  page: {
   
    backgroundColor: "#ffffff",
    backgroundImage: `
      radial-gradient(at 0% 0%, rgba(16, 185, 129, 0.15) 0px, transparent 50%),
      radial-gradient(at 100% 0%, rgba(56, 189, 248, 0.05) 0px, transparent 50%)
    `,
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Inter', sans-serif",
    padding: "40px 20px",
    position: "relative",
    overflow: "hidden",
  },
  container: {
    maxWidth: "1200px",
    width: "100%",
    textAlign: "center",
    zIndex: 2,
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    padding: "8px 16px",
    borderRadius: "100px",
    backgroundColor: "rgba(16, 185, 129, 0.08)",
    color: "#065f46",
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "30px",
    border: "1px solid rgba(16, 185, 129, 0.2)",
  },
  dot: {
    width: "6px",
    height: "6px",
    backgroundColor: "#10b981",
    borderRadius: "50%",
  },
  brandName: {
    fontSize: "clamp(50px, 12vw, 110px)", 
    fontWeight: "900",
    color: "#1e293b",
    margin: "0",
    letterSpacing: "-6px",
    lineHeight: "0.9",
  },
  subtitle: {
    fontSize: "20px",
    color: "#475569",
    maxWidth: "650px",
    margin: "30px auto 50px",
    lineHeight: "1.6",
    fontWeight: "400",
  },
  buttonGroup: {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
    marginBottom: "120px",
  },
  getStartedBtn: {
    backgroundColor: "#10b981",
    color: "#ffffff",
    padding: "18px 48px",
    border: "none",
    borderRadius: "14px",
    fontSize: "18px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 10px 20px rgba(16, 185, 129, 0.15)",
  },
  createAccountBtn: {
    backgroundColor: "#ffffff",
    color: "#1e293b",
    padding: "18px 48px",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    fontSize: "18px",
    fontWeight: "700",
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "30px",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(10px)",
    borderRadius: "24px",
    padding: "50px 30px",
    border: "1px solid rgba(226, 232, 240, 0.8)",
    textAlign: "center",
  },
  cardIcon: {
    fontSize: "32px",
    marginBottom: "20px",
  },
  statNumber: {
    fontSize: "42px",
    fontWeight: "900",
    color: "#1e293b",
    margin: "0",
    letterSpacing: "-1.5px",
  },
  statLabel: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#64748b",
    marginTop: "10px",
    textTransform: "uppercase",
    letterSpacing: "1.5px",
  },
};

export default Home;