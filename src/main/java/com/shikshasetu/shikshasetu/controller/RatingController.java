package com.shikshasetu.shikshasetu.controller;

import com.shikshasetu.shikshasetu.model.Rating;
import com.shikshasetu.shikshasetu.security.CustomUserDetails;
import com.shikshasetu.shikshasetu.service.RatingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ratings")
@CrossOrigin(origins = "http://localhost:3000")
public class RatingController {

    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    /**
     * Matches: API.get(`/ratings/course/${courseId}`)
     */
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Rating>> getCourseRatings(@PathVariable Long courseId) {
        return ResponseEntity.ok(ratingService.getRatingsByCourse(courseId));
    }

    /**
     * Matches: API.post(`/ratings/course/${courseId}`, data)
     */
    @PostMapping("/course/{courseId}")
    public ResponseEntity<Rating> addOrUpdateRating(
            @PathVariable Long courseId,
            @RequestBody Map<String, Object> request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        // Safe extraction of data from Map
        Integer stars = request.get("stars") != null ? (Integer) request.get("stars") : 0;
        String comment = (String) request.get("comment");

        Rating savedRating = ratingService.addOrUpdateRating(
                userDetails.getId(),
                courseId,
                stars,
                comment
        );

        return ResponseEntity.ok(savedRating);
    }
}