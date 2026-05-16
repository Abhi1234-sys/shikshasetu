package com.shikshasetu.shikshasetu.service;

import com.shikshasetu.shikshasetu.dto.AuthResponse;
import com.shikshasetu.shikshasetu.dto.LoginRequest;
import com.shikshasetu.shikshasetu.dto.SignupRequest;
import com.shikshasetu.shikshasetu.model.User;
import com.shikshasetu.shikshasetu.repository.UserRepository;
import com.shikshasetu.shikshasetu.util.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }



    public Long getUserIdByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(User::getId)
                .orElse(0L); // Returns 0 if the student is totally new
    }

    public AuthResponse signup(SignupRequest request) {
        // 1. Check if email exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists!");
        }

        // 2. Create and Save User
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));


        user.setStudentClass(request.getStudentClass());


        user.setRole(request.getRole() != null ? request.getRole() : "STUDENT");

        userRepository.save(user);


        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());


        return new AuthResponse(token, user.getRole(), user.getName(), user.getId());
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found!"));

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());


        return new AuthResponse(token, user.getRole(), user.getName(), user.getId());
    }
}