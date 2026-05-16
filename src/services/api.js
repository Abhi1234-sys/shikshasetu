import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && token !== 'null' && token !== 'undefined') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// AUTHENTICATION 
export const login = (data) => API.post('/auth/login', data);
export const signup = (data) => API.post('/auth/signup', data);
export const checkEmail = (email) => API.get(`/auth/check-email?email=${email}`);

// COURSES & ENROLLMENT 
export const getAllCourses = () => API.get('/courses');
export const getCourseDetails = (id) => API.get(`/courses/${id}`); 
export const addCourse = (data) => API.post('/courses', data);
export const updateCourse = (id, data) => API.put(`/courses/${id}`, data);
export const deleteCourse = (id) => API.delete(`/courses/${id}`);
export const searchCourses = (keyword) => API.get(`/courses/search?keyword=${keyword}`);
export const togglePopularCourse = (id) => API.put(`/admin/course/${id}/toggle-popular`);

// ENROLLMENT ACTIONS
export const enrollCourse = (userId, courseId) => API.post(`/enrollments/enroll/${userId}/${courseId}`);
export const getEnrolledCourses = (userId) => API.get(`/enrollments/user/${userId}`);
export const checkEnrollment = (courseId, userId) => API.get(`/content/check/${courseId}/${userId}`);

// ADMIN & DIRECTORY 
export const addCourseContent = (courseId, data) => API.post(`/admin/course/${courseId}/content`, data);
export const getGatedContent = (courseId, userId) => API.get(`/content/course/${courseId}/${userId}`);
export const getAllStudents = () => API.get('/admin/students');

// GLOBAL NOTICE BOARD 
export const broadcastNotice = (message) => API.post('/admin/broadcast', message, {
    headers: { 'Content-Type': 'text/plain' }
});
export const getAnnouncements = () => API.get('/admin/announcements');
export const updateAnnouncement = (id, message) => API.put(`/admin/announcement/${id}`, message, {
    headers: { 'Content-Type': 'text/plain' }
});
export const deleteAnnouncement = (id) => API.delete(`/admin/announcement/${id}`);

// PROGRESS & ANALYTICS 
export const getAllProgress = () => API.get('/progress/all');
export const getProgress = (courseId) => API.get(`/progress/${courseId}`);
export const markLessonComplete = (data) => API.post('/progress/lesson/complete', data);

// QUIZ ENGINE 
export const getQuizByCourse = (courseId) => API.get(`/quiz/course/${courseId}`);
export const submitQuiz = (courseId, answers) => API.post(`/quiz/submit/${courseId}`, answers);
export const addQuizQuestion = (data) => API.post('/quiz/admin/add-question', data);
export const updateQuizQuestion = (id, data) => API.put(`/quiz/question/${id}`, data); 
export const deleteQuizQuestion = (id) => API.delete(`/quiz/question/${id}`);

/**  */

export const getUserQuizHistory = (userId) => API.get(`/quiz/history/${userId}`);

// LEADERBOARD & RATINGS 
export const getLeaderboard = () => API.get('/leaderboard');
export const addRating = (courseId, data) => API.post(`/ratings/course/${courseId}`, data);
export const getCourseRatings = (courseId) => API.get(`/ratings/course/${courseId}`);

// PERSONAL NOTES 
export const saveNote = (courseId, data) => API.post(`/notes/course/${courseId}`, data);
export const getNote = (courseId) => API.get(`/notes/course/${courseId}`);

/**  */

export const getUserNotes = (userId) => API.get(`/notes/user/${userId}`);

export default API;