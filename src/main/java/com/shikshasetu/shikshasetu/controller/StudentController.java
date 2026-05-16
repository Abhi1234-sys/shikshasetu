package com.shikshasetu.shikshasetu.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    @GetMapping("/dashboard")
    public ResponseEntity<String> studentDashboard() {
        return ResponseEntity.ok("Welcome to Student Dashboard!");
    }
}