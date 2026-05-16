package com.shikshasetu.shikshasetu.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "course_progress",
        uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "course_id"}))
public class CourseProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    private int completedLessons = 0;
    private int totalLessons = 0;
    private boolean quizPassed = false;
    private double progressPercent = 0.0;
    private LocalDateTime lastUpdated;

    @PreUpdate
    @PrePersist
    public void recalculate() {
        int total = totalLessons + 1;
        int done = completedLessons + (quizPassed ? 1 : 0);
        this.progressPercent = total == 0 ? 0.0 : ((double) done / total) * 100.0;
        this.lastUpdated = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public User getStudent() { return student; }
    public Course getCourse() { return course; }
    public int getCompletedLessons() { return completedLessons; }
    public int getTotalLessons() { return totalLessons; }
    public boolean isQuizPassed() { return quizPassed; }
    public double getProgressPercent() { return progressPercent; }
    public LocalDateTime getLastUpdated() { return lastUpdated; }

    public void setStudent(User student) { this.student = student; }
    public void setCourse(Course course) { this.course = course; }
    public void setCompletedLessons(int completedLessons) { this.completedLessons = completedLessons; }
    public void setTotalLessons(int totalLessons) { this.totalLessons = totalLessons; }
    public void setQuizPassed(boolean quizPassed) { this.quizPassed = quizPassed; }
}