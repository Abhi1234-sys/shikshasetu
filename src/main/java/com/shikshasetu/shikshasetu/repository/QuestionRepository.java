package com.shikshasetu.shikshasetu.repository;

import com.shikshasetu.shikshasetu.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    /**
     * Finds questions by the ID of the associated Course.
     * Spring Data JPA automatically parses this based on the 'course' field in your Question entity.
     */
    List<Question> findByCourseId(Long courseId);
}