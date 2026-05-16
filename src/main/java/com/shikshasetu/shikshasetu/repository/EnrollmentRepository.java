package com.shikshasetu.shikshasetu.repository;

import com.shikshasetu.shikshasetu.model.Enrollment;
import com.shikshasetu.shikshasetu.model.User;
import com.shikshasetu.shikshasetu.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    /**
     *  Used in EnrollmentService to prevent duplicate enrollments
     * using ID values directly.
     */
    boolean existsByUserIdAndCourseId(Long userId, Long courseId);

    /**
     * Supporting CourseService (Line 82)
     * Checks existence using Entity objects.
     */
    boolean existsByUserAndCourse(User user, Course course);

    /**
     *  Supporting CourseService (Line 97)
     * Fetches enrollments by passing the User object.
     */
    List<Enrollment> findByUser(User user);

    /**
     * Supporting the new 'Permanent Enrollment' logic
     * Fetches all enrollment records for a specific User ID.
     */
    List<Enrollment> findByUserId(Long userId);
}