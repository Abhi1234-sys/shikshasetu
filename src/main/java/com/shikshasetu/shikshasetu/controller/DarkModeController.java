package com.shikshasetu.shikshasetu.controller;

import com.shikshasetu.shikshasetu.model.User;
import com.shikshasetu.shikshasetu.repository.UserRepository;
import com.shikshasetu.shikshasetu.security.CustomUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/darkmode")
public class DarkModeController {

    private final UserRepository userRepository;

    public DarkModeController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // GET /api/darkmode — get current preference
    @GetMapping
    public ResponseEntity<Map<String, Boolean>> getDarkMode(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userRepository.findById(userDetails.getId()).orElseThrow();
        return ResponseEntity.ok(Map.of("darkMode", user.isDarkMode()));
    }

    // PUT /api/darkmode — toggle dark mode
    @PutMapping
    public ResponseEntity<Map<String, Boolean>> toggleDarkMode(
            @RequestBody Map<String, Boolean> request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userRepository.findById(userDetails.getId()).orElseThrow();
        user.setDarkMode(request.get("darkMode"));
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("darkMode", user.isDarkMode()));
    }
}