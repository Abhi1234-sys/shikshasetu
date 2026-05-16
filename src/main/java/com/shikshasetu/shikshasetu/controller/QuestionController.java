package com.shikshasetu.shikshasetu.controller;

import com.shikshasetu.shikshasetu.model.Question;
import com.shikshasetu.shikshasetu.service.QuestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "http://localhost:3000")
public class QuestionController {

    // Final variable ensures the service cannot be changed after initialization
    private final QuestionService questionService;

    // Constructor Injection: This is the standard "best practice" way to initialize services
    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    /**
     * Admin Endpoint: Add a new MCQ question to a specific course.
     */
    @PostMapping("/add/{courseId}")
    public ResponseEntity<Question> addQuestion(@PathVariable Long courseId, @RequestBody Question question) {
        Question savedQuestion = questionService.addQuestion(courseId, question);
        return ResponseEntity.ok(savedQuestion);
    }

    /**
     * Student Endpoint: Fetch all questions for the Quiz View.
     * Returns 200 OK with the list, or 204 No Content if the quiz is empty.
     */
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Question>> getQuestionsByCourse(@PathVariable Long courseId) {
        List<Question> questions = questionService.getQuestionsByCourse(courseId);

        if (questions.isEmpty()) {
            // Returns a 204 status which tells the frontend: "Success, but no data found."
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(questions);
    }
}