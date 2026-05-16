package com.shikshasetu.shikshasetu.service;

import com.shikshasetu.shikshasetu.model.Course;
import com.shikshasetu.shikshasetu.model.Enrollment;
import com.shikshasetu.shikshasetu.model.User;
import com.shikshasetu.shikshasetu.repository.CourseRepository;
import com.shikshasetu.shikshasetu.repository.EnrollmentRepository;
import com.shikshasetu.shikshasetu.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;

    public CourseService(CourseRepository courseRepository,
                         EnrollmentRepository enrollmentRepository,
                         UserRepository userRepository) {
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.userRepository = userRepository;
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Course getCourseById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found!"));
    }

    public Course addCourse(Course course) {
        return courseRepository.save(course);
    }

    @Transactional
    public Course updateCourse(Long id, Course courseDetails) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));

        course.setTitle(courseDetails.getTitle());
        course.setDescription(courseDetails.getDescription());
        course.setCategory(courseDetails.getCategory());
        course.setCourseLink(courseDetails.getCourseLink());
        course.setThumbnailUrl(courseDetails.getThumbnailUrl());
        course.setLevel(courseDetails.getLevel());
        course.setPopular(courseDetails.isPopular());

        return courseRepository.save(course);
    }

    @Transactional
    public void deleteCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cannot delete: Course ID " + id + " not found!"));

        try {
            // Clearing relationships before deletion to avoid integrity violations
            course.getEnrollments().clear();
            courseRepository.delete(course);
            courseRepository.flush();
            System.out.println(" Successfully deleted course ID: " + id);
        } catch (Exception e) {
            System.err.println(" Error during deletion: " + e.getMessage());
            throw new RuntimeException("Database error: " + e.getMessage());
        }
    }

    /**
     *  Handles enrollment via email (useful for legacy frontend calls)
     * Now uses the fixed repository method existsByUserAndCourse
     */
    @Transactional
    public String enrollCourse(Long courseId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found!"));

        if (enrollmentRepository.existsByUserAndCourse(user, course)) {
            return "Already enrolled!";
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setUser(user);
        enrollment.setCourse(course);
        enrollmentRepository.save(enrollment);

        return "Enrolled successfully!";
    }

    /**
     *  FIXED: Retrieves permanent enrollments using the User object
     * This directly supports your line 97 requirement.
     */
    public List<Enrollment> getMyEnrollments(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));
        return enrollmentRepository.findByUser(user);
    }

    public List<Course> searchCourses(String keyword) {
        return courseRepository.findByTitleContainingIgnoreCase(keyword);
    }
}