package com.shikshasetu.shikshasetu.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "lesson_completion",
        uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "content_id"}))
public class LessonCompletion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "content_id", nullable = false)
    private CourseContent content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    private LocalDateTime completedAt;

    public Long getId() { return id; }
    public User getStudent() { return student; }
    public CourseContent getContent() { return content; }
    public Course getCourse() { return course; }
    public LocalDateTime getCompletedAt() { return completedAt; }

    public void setStudent(User student) { this.student = student; }
    public void setContent(CourseContent content) { this.content = content; }
    public void setCourse(Course course) { this.course = course; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}