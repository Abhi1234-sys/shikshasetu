package com.shikshasetu.shikshasetu.repository;

import com.shikshasetu.shikshasetu.model.CourseProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface CourseProgressRepository extends JpaRepository<CourseProgress, Long> {
    Optional<CourseProgress> findByStudentIdAndCourseId(Long studentId, Long courseId);
    List<CourseProgress> findByStudentId(Long studentId);
}
