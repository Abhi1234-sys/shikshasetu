package com.shikshasetu.shikshasetu.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "certificates")
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(nullable = false, unique = true)
    private String certificateNumber;

    @Column(nullable = false)
    private String filePath;

    private LocalDateTime issuedAt;

    @PrePersist
    public void setIssuedAt() {
        this.issuedAt = LocalDateTime.now();
    }

    // Getters
    public Long getId() { return id; }
    public User getStudent() { return student; }
    public Course getCourse() { return course; }
    public String getCertificateNumber() { return certificateNumber; }
    public String getFilePath() { return filePath; }
    public LocalDateTime getIssuedAt() { return issuedAt; }

    // Setters
    public void setStudent(User student) { this.student = student; }
    public void setCourse(Course course) { this.course = course; }
    public void setCertificateNumber(String certificateNumber) { this.certificateNumber = certificateNumber; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
}