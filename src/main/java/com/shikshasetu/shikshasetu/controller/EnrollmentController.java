package com.shikshasetu.shikshasetu.controller;

import com.shikshasetu.shikshasetu.model.Course;
import com.shikshasetu.shikshasetu.model.Enrollment;
import com.shikshasetu.shikshasetu.service.EnrollmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin(origins = "http://localhost:3000")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    /**
     * POST: Creates a permanent record in the database
     */
    @PostMapping("/enroll/{userId}/{courseId}")
    public ResponseEntity<?> enrollStudent(@PathVariable Long userId, @PathVariable Long courseId) {
        try {
            Enrollment enrollment = enrollmentService.enrollStudent(userId, courseId);
            return ResponseEntity.ok(enrollment);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    /**
     *  GET: Used by React on page load/login to restore enrolled courses
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Course>> getEnrolledCourses(@PathVariable Long userId) {
        List<Course> enrolledCourses = enrollmentService.getCoursesByUserId(userId);
        return ResponseEntity.ok(enrolledCourses);
    }
}