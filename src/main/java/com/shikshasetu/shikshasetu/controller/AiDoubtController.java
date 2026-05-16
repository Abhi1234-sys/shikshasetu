package com.shikshasetu.shikshasetu.controller;

import com.shikshasetu.shikshasetu.service.AiDoubtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:3000")
public class AiDoubtController {

    private final AiDoubtService aiDoubtService;

    public AiDoubtController(AiDoubtService aiDoubtService) {
        this.aiDoubtService = aiDoubtService;
    }

    @PostMapping("/doubt")
    public ResponseEntity<Map<String, String>> solveDoubt(@RequestBody Map<String, String> request) {

        System.out.println("[AI Doubt Solver] Incoming network request detected.");

        if (request == null || !request.containsKey("question")) {
            System.out.println("[AI Doubt Solver] Rejected: Missing payload entirely.");
            return ResponseEntity.badRequest().body(Map.of("answer", "Malformed request payload. Missing 'question' key."));
        }

        String question = request.get("question");
        System.out.println("[AI Doubt Solver] Processing query: \"" + question + "\"");

        if (question == null || question.trim().isEmpty()) {
            System.out.println("[AI Doubt Solver] Rejected: Empty question string.");
            return ResponseEntity.badRequest().body(Map.of("answer", "Please ask a valid coding question!"));
        }

        try {

            String answer = aiDoubtService.solveDoubt(question);

            System.out.println("[AI Doubt Solver] Solution generated successfully.");
            return ResponseEntity.ok(Map.of("answer", answer));

        } catch (Exception e) {

            System.err.println("[AI Doubt Solver] CRITICAL EXCEPTION inside AiDoubtService layer:");
            e.printStackTrace();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "answer", "The AI model encountered a structural error: " + e.getMessage()
            ));
        }
    }
}