package com.shikshasetu.shikshasetu.service;

import com.shikshasetu.shikshasetu.model.Rating;
import com.shikshasetu.shikshasetu.model.User;
import com.shikshasetu.shikshasetu.repository.RatingRepository;
import com.shikshasetu.shikshasetu.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class RatingService {
    private final RatingRepository ratingRepository;
    private final UserRepository userRepository; // 🟢 Required to fetch student names

    public RatingService(RatingRepository ratingRepository, UserRepository userRepository) {
        this.ratingRepository = ratingRepository;
        this.userRepository = userRepository;
    }

    public List<Rating> getRatingsByCourse(Long courseId) {
        //  Uses the new repository method to get sorted reviews (newest first)
        return ratingRepository.findByCourseIdOrderByCreatedAtDesc(courseId);
    }

    public Rating addOrUpdateRating(Long userId, Long courseId, Integer stars, String comment) {
        Optional<Rating> existingRating = ratingRepository.findByUserIdAndCourseId(userId, courseId);


        String studentName = userRepository.findById(userId)
                .map(User::getName) // Gets the 'name' field from your User model
                .orElse("Student");

        Rating rating;
        if (existingRating.isPresent()) {
            rating = existingRating.get();
        } else {
            rating = new Rating();
            rating.setUserId(userId);
            rating.setCourseId(courseId);
        }

        rating.setStars(stars);
        rating.setComment(comment);
        rating.setUserName(studentName);

        return ratingRepository.save(rating);
    }
}