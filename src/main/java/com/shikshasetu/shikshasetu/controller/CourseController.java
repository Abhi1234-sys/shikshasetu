package com.shikshasetu.shikshasetu.controller;

import com.shikshasetu.shikshasetu.model.Course;
import com.shikshasetu.shikshasetu.model.Enrollment;
import com.shikshasetu.shikshasetu.service.CourseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:3000")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }



    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        try {
            Course course = courseService.getCourseById(id);
            if (course.getContents() != null) {
                course.getContents().size();
            } else {
                course.setContents(new ArrayList<>());
            }
            return ResponseEntity.ok(course);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Course>> searchCourses(@RequestParam String keyword) {
        return ResponseEntity.ok(courseService.searchCourses(keyword));
    }

    // --- 🛠️ ADMIN / MANAGEMENT ---

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCourse(@PathVariable Long id, @RequestBody Course courseDetails) {
        try {
            Course currentCourse = courseService.getCourseById(id);
            if (currentCourse == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Course not found");

            // Updating all relevant fields for ShikshaSetu
            currentCourse.setTitle(courseDetails.getTitle());
            currentCourse.setCategory(courseDetails.getCategory());
            currentCourse.setDescription(courseDetails.getDescription());
            currentCourse.setCourseLink(courseDetails.getCourseLink()); // Permanent storage
            currentCourse.setLevel(courseDetails.getLevel());

            Course updated = courseService.addCourse(currentCourse);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<Course> addCourse(@RequestBody Course course) {
        try {
            if (course.getContents() == null) {
                course.setContents(new ArrayList<>());
            }
            Course savedCourse = courseService.addCourse(course);
            return new ResponseEntity<>(savedCourse, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCourse(@PathVariable Long id) {
        try {
            courseService.deleteCourse(id);
            return ResponseEntity.ok("Course deleted successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Could not delete course.");
        }
    }

    // --- 🎓 ENROLLMENT ---

    @PostMapping("/enroll/{courseId}")
    public ResponseEntity<String> enrollCourse(@PathVariable Long courseId, Principal principal) {
        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login required");
        return ResponseEntity.ok(courseService.enrollCourse(courseId, principal.getName()));
    }

    @GetMapping("/my-enrollments")
    public ResponseEntity<List<Enrollment>> getMyEnrollments(Principal principal) {
        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        return ResponseEntity.ok(courseService.getMyEnrollments(principal.getName()));
    }
}