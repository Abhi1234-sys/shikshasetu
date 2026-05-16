package com.shikshasetu.shikshasetu.service;

import com.shikshasetu.shikshasetu.model.Course;
import com.shikshasetu.shikshasetu.model.Note;
import com.shikshasetu.shikshasetu.model.User;
import com.shikshasetu.shikshasetu.repository.CourseRepository;
import com.shikshasetu.shikshasetu.repository.NoteRepository;
import com.shikshasetu.shikshasetu.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoteService {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    public NoteService(NoteRepository noteRepository,
                       UserRepository userRepository,
                       CourseRepository courseRepository) {
        this.noteRepository = noteRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
    }

    // Create note
    public Note createNote(Long studentId, Long courseId, String content) {
        User student = userRepository.findById(studentId).orElseThrow();
        Course course = courseRepository.findById(courseId).orElseThrow();

        Note note = new Note();
        note.setStudent(student);
        note.setCourse(course);
        note.setContent(content);

        return noteRepository.save(note);
    }

    // Get all notes for a course
    public List<Note> getNotesByCourse(Long studentId, Long courseId) {
        return noteRepository.findByStudentIdAndCourseId(studentId, courseId);
    }

    // Get all notes for a student
    public List<Note> getAllNotes(Long studentId) {
        return noteRepository.findByStudentId(studentId);
    }

    // Update note
    public Note updateNote(Long noteId, String content) {
        Note note = noteRepository.findById(noteId).orElseThrow();
        note.setContent(content);
        return noteRepository.save(note);
    }

    // Delete note
    public void deleteNote(Long noteId) {
        noteRepository.deleteById(noteId);
    }
}