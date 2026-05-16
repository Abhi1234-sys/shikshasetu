package com.shikshasetu.shikshasetu.repository;

import com.shikshasetu.shikshasetu.model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {

    Optional<Rating> findByUserIdAndCourseId(Long userId, Long courseId);


    List<Rating> findByCourseIdOrderByCreatedAtDesc(Long courseId);
}