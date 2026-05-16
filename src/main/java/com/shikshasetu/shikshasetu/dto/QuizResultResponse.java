package com.shikshasetu.shikshasetu.dto;

import java.time.LocalDateTime;

public class QuizResultResponse {
    private Long id;
    private String courseTitle;
    private int score;
    private int totalQuestions;
    private double percentage;
    private String grade;
    private LocalDateTime attemptedAt;

    // Getters
    public Long getId() { return id; }
    public String getCourseTitle() { return courseTitle; }
    public int getScore() { return score; }
    public int getTotalQuestions() { return totalQuestions; }
    public double getPercentage() { return percentage; }
    public String getGrade() { return grade; }
    public LocalDateTime getAttemptedAt() { return attemptedAt; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setCourseTitle(String courseTitle) { this.courseTitle = courseTitle; }
    public void setScore(int score) { this.score = score; }
    public void setTotalQuestions(int totalQuestions) { this.totalQuestions = totalQuestions; }
    public void setPercentage(double percentage) { this.percentage = percentage; }
    public void setGrade(String grade) { this.grade = grade; }
    public void setAttemptedAt(LocalDateTime attemptedAt) { this.attemptedAt = attemptedAt; }
}