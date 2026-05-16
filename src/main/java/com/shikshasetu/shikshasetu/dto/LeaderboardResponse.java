package com.shikshasetu.shikshasetu.dto;

public class LeaderboardResponse {
    private int rank;
    private String studentName;
    private String studentEmail;
    private int totalScore;
    private int quizzesAttempted;

    // Getters
    public int getRank() { return rank; }
    public String getStudentName() { return studentName; }
    public String getStudentEmail() { return studentEmail; }
    public int getTotalScore() { return totalScore; }
    public int getQuizzesAttempted() { return quizzesAttempted; }

    // Setters
    public void setRank(int rank) { this.rank = rank; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }
    public void setTotalScore(int totalScore) { this.totalScore = totalScore; }
    public void setQuizzesAttempted(int quizzesAttempted) { this.quizzesAttempted = quizzesAttempted; }
}