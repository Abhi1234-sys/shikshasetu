package com.shikshasetu.shikshasetu.service;

import com.shikshasetu.shikshasetu.model.*;
import com.shikshasetu.shikshasetu.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuizResultRepository quizResultRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public QuizService(QuizRepository quizRepository,
                       QuizResultRepository quizResultRepository,
                       CourseRepository courseRepository,
                       UserRepository userRepository) {
        this.quizRepository = quizRepository;
        this.quizResultRepository = quizResultRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

    /**
     *  Admin: Save a NEW question.
     */
    @Transactional
    public Quiz saveQuestion(Quiz quiz) {
        if (quiz.getCourse() == null || quiz.getCourse().getId() == null) {
            throw new RuntimeException("Course ID must be provided!");
        }

        Course course = courseRepository.findById(quiz.getCourse().getId())
                .orElseThrow(() -> new RuntimeException("Course not found!"));

        quiz.setCourse(course);
        Quiz savedQuiz = quizRepository.save(quiz);

        // 🔍 DEBUG LOG
        System.out.println(" Question Saved! ID: " + savedQuiz.getId() + " Linked to Course ID: " + course.getId());

        return savedQuiz;
    }

    /**
     *  Admin: Update an EXISTING question.
     */
    @Transactional
    public Quiz updateQuestion(Long id, Quiz details) {
        Quiz existingQuestion = quizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found with ID: " + id));

        existingQuestion.setQuestionText(details.getQuestionText());
        existingQuestion.setOption1(details.getOption1());
        existingQuestion.setOption2(details.getOption2());
        existingQuestion.setOption3(details.getOption3());
        existingQuestion.setOption4(details.getOption4());
        existingQuestion.setCorrectAnswer(details.getCorrectAnswer());

        return quizRepository.save(existingQuestion);
    }

    /**
     *  Admin: Delete a question.
     */
    @Transactional
    public void deleteQuestion(Long id) {
        if (!quizRepository.existsById(id)) {
            throw new RuntimeException("Question not found with ID: " + id);
        }
        quizRepository.deleteById(id);
    }

    //  STUDENT METHODS

    /**
     *  UPDATED: Uses the direct courseId query for better performance and reliability.
     */
    public List<Quiz> getQuizByCourse(Long courseId) {

        List<Quiz> questions = quizRepository.findByCourseId(courseId);


        System.out.println("🔎 Attempting to fetch Quiz for Course ID: " + courseId);
        System.out.println("📊 Database Result: " + questions.size() + " questions found.");

        return questions;
    }

    @Transactional
    public QuizResult submitQuiz(Long courseId, String email, Map<Long, String> answers) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found!"));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        // Also updated here to use the ID-based search
        List<Quiz> questions = quizRepository.findByCourseId(courseId);
        int score = 0;

        for (Quiz question : questions) {
            String userAnswer = answers.get(question.getId());
            if (userAnswer != null && userAnswer.trim().equalsIgnoreCase(question.getCorrectAnswer().trim())) {
                score++;
            }
        }

        QuizResult result = new QuizResult();
        result.setUser(user);
        result.setCourse(course);
        result.setScore(score);
        result.setTotalQuestions(questions.size());

        return quizResultRepository.save(result);
    }

    public List<QuizResult> getMyResults(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));
        return quizResultRepository.findByUser(user);
    }
}