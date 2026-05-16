package com.shikshasetu.shikshasetu.repository;

import com.shikshasetu.shikshasetu.model.LessonCompletion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LessonCompletionRepository extends JpaRepository<LessonCompletion, Long> {
    boolean existsByStudentIdAndContentId(Long studentId, Long contentId);
    long countByStudentIdAndCourseId(Long studentId, Long courseId);
    List<LessonCompletion> findByStudentIdAndCourseId(Long studentId, Long courseId);
}
