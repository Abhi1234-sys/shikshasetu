package com.shikshasetu.shikshasetu.repository;

import com.shikshasetu.shikshasetu.model.Quiz;
import com.shikshasetu.shikshasetu.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    // Finds questions using the Course object
    List<Quiz> findByCourse(Course course);

    // Finds questions directly by the Course ID (very useful for performance)
    List<Quiz> findByCourseId(Long courseId);
}