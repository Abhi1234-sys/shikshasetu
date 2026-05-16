package com.shikshasetu.shikshasetu.service;

import com.shikshasetu.shikshasetu.model.Question;
import com.shikshasetu.shikshasetu.model.Course;
import com.shikshasetu.shikshasetu.repository.QuestionRepository;
import com.shikshasetu.shikshasetu.repository.CourseRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final CourseRepository courseRepository;

    public QuestionService(QuestionRepository questionRepository, CourseRepository courseRepository) {
        this.questionRepository = questionRepository;
        this.courseRepository = courseRepository;
    }

    // 🟢 Add a question to a specific course
    public Question addQuestion(Long courseId, Question question) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found!"));

        question.setCourse(course);
        return questionRepository.save(question);
    }

    // 🟢 Get all questions for a specific quiz/course
    public List<Question> getQuestionsByCourse(Long courseId) {
        return questionRepository.findByCourseId(courseId);
    }
}