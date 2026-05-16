package com.shikshasetu.shikshasetu.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "password_reset_tokens")
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    private boolean used = false;

    @PrePersist
    public void setExpiresAt() {
        this.expiresAt = LocalDateTime.now().plusMinutes(30); // expires in 30 min
    }

    // Getters
    public Long getId() { return id; }
    public String getToken() { return token; }
    public User getUser() { return user; }
    public LocalDateTime getExpiresAt() { return expiresAt; }
    public boolean isUsed() { return used; }

    // Setters
    public void setToken(String token) { this.token = token; }
    public void setUser(User user) { this.user = user; }
    public void setUsed(boolean used) { this.used = used; }
}