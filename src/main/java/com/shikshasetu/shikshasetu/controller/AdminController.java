package com.shikshasetu.shikshasetu.controller;

import com.shikshasetu.shikshasetu.dto.StudentDTO;
import com.shikshasetu.shikshasetu.model.*;
import com.shikshasetu.shikshasetu.service.AdminService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    //  STUDENT MANAGEMENT

    @GetMapping("/students")
    public ResponseEntity<List<StudentDTO>> getAllStudents() {

        List<StudentDTO> directory = adminService.getAllStudentsForDirectory();
        return ResponseEntity.ok(directory);
    }

    // COURSE MANAGEMENT

    @PutMapping("/course/{id}/toggle-popular")
    public ResponseEntity<Course> togglePopularCourse(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.togglePopularStatus(id));
    }

    @PostMapping("/course/{courseId}/content")
    public ResponseEntity<CourseContent> addCourseContent(@PathVariable Long courseId, @RequestBody CourseContent content) {
        return ResponseEntity.ok(adminService.addContentToCourse(courseId, content));
    }

    //  ANNOUNCEMENT MANAGEMENT

    @PostMapping(value = "/broadcast", consumes = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<Announcement> broadcastNotice(@RequestBody String message) {
        return ResponseEntity.ok(adminService.postAnnouncement(message));
    }

    @PutMapping(value = "/announcement/{id}", consumes = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<Announcement> updateAnnouncement(@PathVariable Long id, @RequestBody String message) {
        return ResponseEntity.ok(adminService.updateAnnouncement(id, message));
    }

    @DeleteMapping("/announcement/{id}")
    public ResponseEntity<Void> deleteAnnouncement(@PathVariable Long id) {
        adminService.deleteAnnouncement(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/announcements")
    public ResponseEntity<List<Announcement>> getAnnouncements() {
        return ResponseEntity.ok(adminService.getAllAnnouncements());
    }
}