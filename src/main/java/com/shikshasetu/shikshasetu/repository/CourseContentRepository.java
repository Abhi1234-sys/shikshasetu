package com.shikshasetu.shikshasetu.repository;

import com.shikshasetu.shikshasetu.model.Course;
import com.shikshasetu.shikshasetu.model.CourseContent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CourseContentRepository extends JpaRepository<CourseContent, Long> {
    List<CourseContent> findByCourseOrderByOrderIndexAsc(Course course);
    int countByCourseId(Long courseId);
}