package com.shikshasetu.shikshasetu.repository;

import com.shikshasetu.shikshasetu.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByStudentIdAndCourseId(Long studentId, Long courseId);
    List<Note> findByStudentId(Long studentId);
}