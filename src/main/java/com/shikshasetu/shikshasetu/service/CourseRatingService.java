package com.shikshasetu.shikshasetu.service;

import com.shikshasetu.shikshasetu.model.Course;
import com.shikshasetu.shikshasetu.model.CourseRating;
import com.shikshasetu.shikshasetu.model.User;
import com.shikshasetu.shikshasetu.repository.CourseRatingRepository;
import com.shikshasetu.shikshasetu.repository.CourseRepository;
import com.shikshasetu.shikshasetu.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CourseRatingService {

    private final CourseRatingRepository ratingRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public CourseRatingService(CourseRatingRepository ratingRepository,
                               CourseRepository courseRepository,
                               UserRepository userRepository) {
        this.ratingRepository = ratingRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public CourseRating submitRating(Long courseId, CourseRating ratingRequest) {
        // 1. Identify student from JWT Token
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        // 2. Identify Course
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with ID: " + courseId));

        // 3. Logic: Update if already exists, otherwise create new
        return ratingRepository.findByStudentIdAndCourseId(student.getId(), courseId)
                .map(existingRating -> {
                    existingRating.setRating(ratingRequest.getRating());
                    existingRating.setReview(ratingRequest.getReview());
                    return ratingRepository.save(existingRating);
                })
                .orElseGet(() -> {
                    ratingRequest.setStudent(student);
                    ratingRequest.setCourse(course);
                    return ratingRepository.save(ratingRequest);
                });
    }

    public List<CourseRating> getCourseRatings(Long courseId) {
        return ratingRepository.findByCourseId(courseId);
    }

    public double getAverageRating(Long courseId) {
        List<CourseRating> ratings = ratingRepository.findByCourseId(courseId);
        if (ratings.isEmpty()) return 0.0;

        double avg = ratings.stream()
                .mapToDouble(CourseRating::getRating)
                .average()
                .orElse(0.0);

        return Math.round(avg * 10.0) / 10.0;
    }
}