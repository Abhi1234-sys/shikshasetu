import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Pages
import Home from './pages/Home'; 
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard'; 
import StudentDashboard from './pages/StudentDashboard'; 
import ManageCourse from './pages/ManageCourse'; 
import GlobalNotices from './pages/GlobalNotices'; 
import CourseList from './pages/CourseList';
import CourseDetail from './pages/CourseDetail'; 
import QuizHub from './pages/QuizHub'; 
import Quiz from './pages/Quiz';                 
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import AiDoubtSolver from './pages/AiDoubtSolver'; 
import StudentDirectory from './pages/StudentDirectory';
import CertificateView from './pages/CertificateView';


import { ThemeProvider } from './context/ThemeContext';

/**
 *  Dashboard Wrapper
 * Decides which dashboard to show based on the authenticated user's role.
 */
const DashboardWrapper = () => {
  const role = localStorage.getItem('role'); 
  
  if (role === 'ADMIN') return <AdminDashboard />;
  if (role === 'STUDENT') return <StudentDashboard />;
  
 
  return <Navigate to="/login" replace />;
};

/**
 * Protected Route Component
 * Higher-Order Component to shield internal pages from unauthenticated users.
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/*  */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/*  */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardWrapper />
              </ProtectedRoute>
            } 
          />

          {/*  */}
          <Route 
            path="/admin/manage-courses" 
            element={<ProtectedRoute><ManageCourse /></ProtectedRoute>} 
          />
          <Route 
            path="/admin/global-notices" 
            element={<ProtectedRoute><GlobalNotices /></ProtectedRoute>} 
          />
          <Route 
            path="/admin/students" 
            element={<ProtectedRoute><StudentDirectory /></ProtectedRoute>} 
          />

          {/*  */}
          <Route 
            path="/courses" 
            element={<ProtectedRoute><CourseList /></ProtectedRoute>} 
          />
          <Route 
            path="/courses/:id" 
            element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} 
          />
          <Route 
            path="/quiz-hub" 
            element={<ProtectedRoute><QuizHub /></ProtectedRoute>} 
          />
          <Route 
            path="/quiz/:id" 
            element={<ProtectedRoute><Quiz /></ProtectedRoute>} 
          />
          <Route 
            path="/profile" 
            element={<ProtectedRoute><Profile /></ProtectedRoute>} 
          />
          <Route 
            path="/leaderboard" 
            element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} 
          />
          <Route 
          path="/certificate/:courseTitle" 
          element={<ProtectedRoute><CertificateView /></ProtectedRoute>}
           />
          <Route 
            path="/ai-doubt" 
            element={<ProtectedRoute><AiDoubtSolver /></ProtectedRoute>} 
          />

          {/*  */}
          {/*  */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;