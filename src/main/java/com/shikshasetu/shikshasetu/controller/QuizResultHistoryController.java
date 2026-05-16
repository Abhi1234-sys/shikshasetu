package com.shikshasetu.shikshasetu.controller;

import com.shikshasetu.shikshasetu.dto.QuizResultResponse;
import com.shikshasetu.shikshasetu.security.CustomUserDetails;
import com.shikshasetu.shikshasetu.service.QuizResultHistoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quiz-history")
public class QuizResultHistoryController {

    private final QuizResultHistoryService quizResultHistoryService;

    public QuizResultHistoryController(QuizResultHistoryService quizResultHistoryService) {
        this.quizResultHistoryService = quizResultHistoryService;
    }

    // GET /api/quiz-history
    @GetMapping
    public ResponseEntity<List<QuizResultResponse>> getHistory(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(
                quizResultHistoryService.getHistory(userDetails.getId())
        );
    }
}