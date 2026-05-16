package com.shikshasetu.shikshasetu.service;

import com.shikshasetu.shikshasetu.model.PasswordResetToken;
import com.shikshasetu.shikshasetu.model.User;
import com.shikshasetu.shikshasetu.repository.PasswordResetTokenRepository;
import com.shikshasetu.shikshasetu.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PasswordResetService {

    private final PasswordResetTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public PasswordResetService(PasswordResetTokenRepository tokenRepository,
                                UserRepository userRepository,
                                PasswordEncoder passwordEncoder) {
        this.tokenRepository = tokenRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Generate reset token
    @Transactional
    public String generateResetToken(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email not found!"));

        // Delete old tokens for this user
        tokenRepository.deleteByUserId(user.getId());

        // Generate new token
        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        tokenRepository.save(resetToken);


        return token;
    }


    @Transactional
    public String resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token!"));


        if (resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token has expired!");
        }


        if (resetToken.isUsed()) {
            throw new RuntimeException("Token already used!");
        }


        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);


        resetToken.setUsed(true);
        tokenRepository.save(resetToken);

        return "Password reset successfully!";
    }
}