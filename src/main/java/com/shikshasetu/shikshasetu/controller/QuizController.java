package com.shikshasetu.shikshasetu.controller;

import com.shikshasetu.shikshasetu.model.Quiz;
import com.shikshasetu.shikshasetu.model.QuizResult;
import com.shikshasetu.shikshasetu.service.QuizService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quiz")
@CrossOrigin(origins = "http://localhost:3000")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    //

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Quiz>> getQuizByCourse(@PathVariable Long courseId) {
        try {
            List<Quiz> quizzes = quizService.getQuizByCourse(courseId);
            return ResponseEntity.ok(quizzes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping("/submit/{courseId}")
    public ResponseEntity<?> submitQuiz(@PathVariable Long courseId,
                                        @RequestBody Map<Long, String> answers,
                                        Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login required to submit quiz.");
        }
        try {
            QuizResult result = quizService.submitQuiz(courseId, principal.getName(), answers);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error submitting quiz: " + e.getMessage());
        }
    }

    /**
     *  NEWEST PORTION: Fetches quiz history by User ID for the Profile Page
     * This matches your React fetch call: API.get(`/quiz/history/${userId}`)
     */
    @GetMapping("/history/{userId}")
    public ResponseEntity<?> getQuizHistoryByUserId(@PathVariable String userId) {
        try {
            // Note: You can also use principal.getName() if you want to be more secure
            return ResponseEntity.ok(quizService.getMyResults(userId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching history");
        }
    }

    @GetMapping("/my-results")
    public ResponseEntity<?> getMyResults(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized access.");
        }
        return ResponseEntity.ok(quizService.getMyResults(principal.getName()));
    }

    // ADMIN METHODS (CRUD)

    @PostMapping("/admin/add-question")
    public ResponseEntity<?> addNewAdminQuestion(@RequestBody Quiz question) {
        try {
            Quiz savedQuestion = quizService.saveQuestion(question);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedQuestion);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving question: " + e.getMessage());
        }
    }

    @PutMapping("/question/{id}")
    public ResponseEntity<?> updateAdminQuestion(@PathVariable Long id, @RequestBody Quiz questionDetails) {
        try {
            Quiz updatedQuestion = quizService.updateQuestion(id, questionDetails);
            return ResponseEntity.ok(updatedQuestion);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating question: " + e.getMessage());
        }
    }

    @DeleteMapping("/question/{id}")
    public ResponseEntity<?> deleteAdminQuestion(@PathVariable Long id) {
        try {
            quizService.deleteQuestion(id);
            return ResponseEntity.ok(Map.of("message", "✅ Question deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting question: " + e.getMessage());
        }
    }
}