package com.shikshasetu.shikshasetu.repository;

import com.shikshasetu.shikshasetu.model.QuizResult;
import com.shikshasetu.shikshasetu.model.User;
import com.shikshasetu.shikshasetu.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuizResultRepository extends JpaRepository<QuizResult, Long> {
    List<QuizResult> findByUser(User user);
    List<QuizResult> findByUserAndCourse(User user, Course course);
    List<QuizResult> findByUserId(Long userId);
}