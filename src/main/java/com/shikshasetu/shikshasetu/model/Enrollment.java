package com.shikshasetu.shikshasetu.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "enrollments")
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    private LocalDateTime enrolledAt = LocalDateTime.now();

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }

    /**
     *  CRITICAL SYNC LOGIC
     * This ensures the User's list of enrollments is updated in memory.
     * Without this, the 'EAGER' fetch in your Student Directory might return an empty list
     * until the application is fully restarted.
     */
    public void setUser(User user) {
        this.user = user;
        if (user != null && user.getEnrollments() != null) {
            if (!user.getEnrollments().contains(this)) {
                user.getEnrollments().add(this);
            }
        }
    }

    public Course getCourse() { return course; }

    public void setCourse(Course course) {
        this.course = course;
    }

    public LocalDateTime getEnrolledAt() { return enrolledAt; }
    public void setEnrolledAt(LocalDateTime enrolledAt) { this.enrolledAt = enrolledAt; }
}