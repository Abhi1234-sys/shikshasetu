package com.shikshasetu.shikshasetu.controller;

import com.shikshasetu.shikshasetu.dto.AuthResponse;
import com.shikshasetu.shikshasetu.dto.LoginRequest;
import com.shikshasetu.shikshasetu.dto.SignupRequest;
import com.shikshasetu.shikshasetu.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", allowCredentials = "true")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }


    // This allows the same student to "identify" themselves for multiple course enrollments
    @GetMapping("/check-email")
    public ResponseEntity<Long> checkEmail(@RequestParam String email) {
        return ResponseEntity.ok(authService.getUserIdByEmail(email));
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody SignupRequest request) {
        return ResponseEntity.ok(authService.signup(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}