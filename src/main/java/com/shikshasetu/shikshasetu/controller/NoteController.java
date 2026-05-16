package com.shikshasetu.shikshasetu.controller;

import com.shikshasetu.shikshasetu.model.Note;
import com.shikshasetu.shikshasetu.security.CustomUserDetails;
import com.shikshasetu.shikshasetu.service.NoteService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    // Matches frontend: API.post('/notes/course/${courseId}', data)
    @PostMapping("/course/{courseId}")
    public ResponseEntity<Note> saveNote(
            @PathVariable Long courseId,
            @RequestBody Map<String, String> request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        // Using userDetails.getId() ensures the note belongs to the logged-in student
        return ResponseEntity.ok(
                noteService.createNote(userDetails.getId(), courseId, request.get("content"))
        );
    }

    // Matches frontend: API.get('/notes/course/${courseId}')
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Note>> getNotesByCourse(
            @PathVariable Long courseId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(
                noteService.getNotesByCourse(userDetails.getId(), courseId)
        );
    }

    @DeleteMapping("/{noteId}")
    public ResponseEntity<String> deleteNote(@PathVariable Long noteId) {
        noteService.deleteNote(noteId);
        return ResponseEntity.ok("Note deleted successfully!");
    }
}