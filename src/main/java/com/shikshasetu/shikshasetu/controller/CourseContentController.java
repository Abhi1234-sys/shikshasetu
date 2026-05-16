package com.shikshasetu.shikshasetu.controller;

import com.shikshasetu.shikshasetu.model.CourseContent;
import com.shikshasetu.shikshasetu.service.CourseContentService;
import com.shikshasetu.shikshasetu.service.EnrollmentService; // <--- Check this import carefully
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/content")
public class CourseContentController {

    private final CourseContentService courseContentService;
    private final EnrollmentService enrollmentService;

    // The constructor must match the field names exactly
    public CourseContentController(CourseContentService courseContentService, EnrollmentService enrollmentService) {
        this.courseContentService = courseContentService;
        this.enrollmentService = enrollmentService;
    }

    @GetMapping("/check/{courseId}/{userId}")
    public ResponseEntity<Boolean> checkEnrollment(@PathVariable Long courseId, @PathVariable Long userId) {
        return ResponseEntity.ok(enrollmentService.isEnrolled(userId, courseId));
    }

    @GetMapping("/course/{courseId}/{userId}")
    public ResponseEntity<?> getContentByCourse(@PathVariable Long courseId, @PathVariable Long userId) {
        boolean isEnrolled = enrollmentService.isEnrolled(userId, courseId);

        if (isEnrolled) {
            return ResponseEntity.ok(courseContentService.getContentByCourse(courseId));
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Please enroll in the course to access the curriculum links.");
        }
    }

    // ... rest of your methods (addContent, deleteContent)
}