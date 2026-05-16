package com.shikshasetu.shikshasetu.controller;

import com.shikshasetu.shikshasetu.model.Announcement;
import com.shikshasetu.shikshasetu.security.CustomUserDetails;
import com.shikshasetu.shikshasetu.service.AnnouncementService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController {

    private final AnnouncementService announcementService;

    public AnnouncementController(AnnouncementService announcementService) {
        this.announcementService = announcementService;
    }

    // GET /api/announcements
    @GetMapping
    public ResponseEntity<List<Announcement>> getAllAnnouncements() {
        return ResponseEntity.ok(announcementService.getAllAnnouncements());
    }

    // POST /api/announcements/create
    @PostMapping("/create")
    public ResponseEntity<Announcement> createAnnouncement(
            @RequestBody Map<String, String> request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        String title = request.get("title");
        String message = request.get("message");
        return ResponseEntity.ok(
                announcementService.createAnnouncement(title, message, userDetails.getId())
        );
    }

    // DELETE /api/announcements/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAnnouncement(@PathVariable Long id) {
        announcementService.deleteAnnouncement(id);
        return ResponseEntity.ok("Announcement deleted successfully!");
    }
}