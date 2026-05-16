package com.shikshasetu.shikshasetu.controller;

import com.shikshasetu.shikshasetu.dto.LeaderboardResponse;
import com.shikshasetu.shikshasetu.service.LeaderboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    public LeaderboardController(LeaderboardService leaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    // GET /api/leaderboard
    @GetMapping
    public ResponseEntity<List<LeaderboardResponse>> getLeaderboard() {
        return ResponseEntity.ok(leaderboardService.getLeaderboard());
    }
}