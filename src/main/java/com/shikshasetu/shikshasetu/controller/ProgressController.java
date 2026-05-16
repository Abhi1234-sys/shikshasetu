package com.shikshasetu.shikshasetu.controller;

import com.shikshasetu.shikshasetu.dto.MarkLessonRequest;
import com.shikshasetu.shikshasetu.dto.ProgressResponse;
import com.shikshasetu.shikshasetu.security.CustomUserDetails;
import com.shikshasetu.shikshasetu.service.ProgressService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    private final ProgressService progressService;

    public ProgressController(ProgressService progressService) {
        this.progressService = progressService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<ProgressResponse>> getAllProgress(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(progressService.getAllProgress(userDetails.getId()));
    }

    @GetMapping("/{courseId}")
    public ResponseEntity<ProgressResponse> getCourseProgress(
            @PathVariable Long courseId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(progressService.getProgress(userDetails.getId(), courseId));
    }

    @PostMapping("/lesson/complete")
    public ResponseEntity<ProgressResponse> markLesson(
            @RequestBody MarkLessonRequest req,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(
                progressService.markLessonComplete(
                        userDetails.getId(),
                        req.getCourseId(),
                        req.getContentId()
                )
        );
    }
}