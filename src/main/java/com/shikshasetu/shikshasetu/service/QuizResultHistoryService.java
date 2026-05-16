package com.shikshasetu.shikshasetu.service;

import com.shikshasetu.shikshasetu.dto.QuizResultResponse;
import com.shikshasetu.shikshasetu.model.QuizResult;
import com.shikshasetu.shikshasetu.repository.QuizResultRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuizResultHistoryService {

    private final QuizResultRepository quizResultRepository;

    public QuizResultHistoryService(QuizResultRepository quizResultRepository) {
        this.quizResultRepository = quizResultRepository;
    }

    public List<QuizResultResponse> getHistory(Long studentId) {
        List<QuizResult> results = quizResultRepository.findByUserId(studentId);

        return results.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private QuizResultResponse toDto(QuizResult r) {
        double percentage = r.getTotalQuestions() == 0 ? 0 :
                ((double) r.getScore() / r.getTotalQuestions()) * 100;

        String grade;
        if (percentage >= 90) grade = "A+";
        else if (percentage >= 80) grade = "A";
        else if (percentage >= 70) grade = "B";
        else if (percentage >= 60) grade = "C";
        else grade = "F";

        QuizResultResponse response = new QuizResultResponse();
        response.setId(r.getId());
        response.setCourseTitle(r.getCourse().getTitle());
        response.setScore(r.getScore());
        response.setTotalQuestions(r.getTotalQuestions());
        response.setPercentage(Math.round(percentage * 10.0) / 10.0);
        response.setGrade(grade);
        response.setAttemptedAt(r.getAttemptedAt());

        return response;
    }
}