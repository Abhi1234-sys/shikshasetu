package com.shikshasetu.shikshasetu.service;

import com.shikshasetu.shikshasetu.model.Course;
import com.shikshasetu.shikshasetu.model.Enrollment;
import com.shikshasetu.shikshasetu.model.User;
import com.shikshasetu.shikshasetu.repository.CourseRepository;
import com.shikshasetu.shikshasetu.repository.EnrollmentRepository;
import com.shikshasetu.shikshasetu.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    public EnrollmentService(EnrollmentRepository enrollmentRepository,
                             UserRepository userRepository,
                             CourseRepository courseRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
    }

    /**
     *  This resolves your CourseContentController error!
     */
    public boolean isEnrolled(Long userId, Long courseId) {
        return enrollmentRepository.existsByUserIdAndCourseId(userId, courseId);
    }

    @Transactional
    public Enrollment enrollStudent(Long userId, Long courseId) {
        if (isEnrolled(userId, courseId)) {
            throw new RuntimeException("Student is already enrolled.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Enrollment enrollment = new Enrollment();
        enrollment.setUser(user);
        enrollment.setCourse(course);
        enrollment.setEnrolledAt(LocalDateTime.now());

        return enrollmentRepository.save(enrollment);
    }

    public List<Course> getCoursesByUserId(Long userId) {
        return enrollmentRepository.findByUserId(userId)
                .stream()
                .map(Enrollment::getCourse)
                .collect(Collectors.toList());
    }
}