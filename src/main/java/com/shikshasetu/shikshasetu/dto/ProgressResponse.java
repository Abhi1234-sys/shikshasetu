package com.shikshasetu.shikshasetu.dto;

public class ProgressResponse {
    private Long courseId;
    private String courseTitle;
    private int completedLessons;
    private int totalLessons;
    private boolean quizPassed;
    private double progressPercent;
    private String progressLabel;

    // Getters
    public Long getCourseId() { return courseId; }
    public String getCourseTitle() { return courseTitle; }
    public int getCompletedLessons() { return completedLessons; }
    public int getTotalLessons() { return totalLessons; }
    public boolean isQuizPassed() { return quizPassed; }
    public double getProgressPercent() { return progressPercent; }
    public String getProgressLabel() { return progressLabel; }

    // Setters
    public void setCourseId(Long courseId) { this.courseId = courseId; }
    public void setCourseTitle(String courseTitle) { this.courseTitle = courseTitle; }
    public void setCompletedLessons(int completedLessons) { this.completedLessons = completedLessons; }
    public void setTotalLessons(int totalLessons) { this.totalLessons = totalLessons; }
    public void setQuizPassed(boolean quizPassed) { this.quizPassed = quizPassed; }
    public void setProgressPercent(double progressPercent) { this.progressPercent = progressPercent; }
    public void setProgressLabel(String progressLabel) { this.progressLabel = progressLabel; }
}