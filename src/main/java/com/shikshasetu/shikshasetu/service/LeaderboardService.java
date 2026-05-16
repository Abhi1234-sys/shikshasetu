package com.shikshasetu.shikshasetu.service;

import com.shikshasetu.shikshasetu.dto.LeaderboardResponse;
import com.shikshasetu.shikshasetu.model.QuizResult;
import com.shikshasetu.shikshasetu.repository.QuizResultRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class LeaderboardService {

    private final QuizResultRepository quizResultRepository;

    public LeaderboardService(QuizResultRepository quizResultRepository) {
        this.quizResultRepository = quizResultRepository;
    }

    public List<LeaderboardResponse> getLeaderboard() {

        // Get all quiz results
        List<QuizResult> allResults = quizResultRepository.findAll();

        // Group by student and sum scores
        Map<Long, List<QuizResult>> groupedByStudent = allResults.stream()
                .collect(Collectors.groupingBy(r -> r.getUser().getId()));

        // Build leaderboard list
        List<LeaderboardResponse> leaderboard = new ArrayList<>();

        for (Map.Entry<Long, List<QuizResult>> entry : groupedByStudent.entrySet()) {
            List<QuizResult> results = entry.getValue();

            int totalScore = results.stream().mapToInt(QuizResult::getScore).sum();
            int quizzesAttempted = results.size();
            String name = results.get(0).getUser().getName();
            String email = results.get(0).getUser().getEmail();

            LeaderboardResponse response = new LeaderboardResponse();
            response.setStudentName(name);
            response.setStudentEmail(email);
            response.setTotalScore(totalScore);
            response.setQuizzesAttempted(quizzesAttempted);

            leaderboard.add(response);
        }

        // Sort by total score descending
        leaderboard.sort((a, b) -> b.getTotalScore() - a.getTotalScore());

        // Assign ranks
        for (int i = 0; i < leaderboard.size(); i++) {
            leaderboard.get(i).setRank(i + 1);
        }

        return leaderboard;
    }
}