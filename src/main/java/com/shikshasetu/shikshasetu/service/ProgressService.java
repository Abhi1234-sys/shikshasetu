package com.shikshasetu.shikshasetu.service;

import com.shikshasetu.shikshasetu.dto.ProgressResponse;
import com.shikshasetu.shikshasetu.model.*;
import com.shikshasetu.shikshasetu.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProgressService {

    private final CourseProgressRepository progressRepo;
    private final LessonCompletionRepository lessonCompletionRepo;
    private final CourseContentRepository contentRepo;
    private final CourseRepository courseRepo;
    private final UserRepository userRepo;

    public ProgressService(CourseProgressRepository progressRepo,
                           LessonCompletionRepository lessonCompletionRepo,
                           CourseContentRepository contentRepo,
                           CourseRepository courseRepo,
                           UserRepository userRepo) {
        this.progressRepo = progressRepo;
        this.lessonCompletionRepo = lessonCompletionRepo;
        this.contentRepo = contentRepo;
        this.courseRepo = courseRepo;
        this.userRepo = userRepo;
    }

    @Transactional
    public void initializeProgress(Long studentId, Long courseId) {
        if (progressRepo.findByStudentIdAndCourseId(studentId, courseId).isPresent()) return;

        int totalLessons = contentRepo.countByCourseId(courseId);

        User student = userRepo.findById(studentId).orElseThrow();
        Course course = courseRepo.findById(courseId).orElseThrow();

        CourseProgress progress = new CourseProgress();
        progress.setStudent(student);
        progress.setCourse(course);
        progress.setTotalLessons(totalLessons);
        progress.setCompletedLessons(0);
        progress.setQuizPassed(false);

        progressRepo.save(progress);
    }

    @Transactional
    public ProgressResponse markLessonComplete(Long studentId, Long courseId, Long contentId) {
        if (lessonCompletionRepo.existsByStudentIdAndContentId(studentId, contentId)) {
            return getProgress(studentId, courseId);
        }

        User student = userRepo.findById(studentId).orElseThrow();
        CourseContent content = contentRepo.findById(contentId).orElseThrow();
        Course course = courseRepo.findById(courseId).orElseThrow();

        LessonCompletion lc = new LessonCompletion();
        lc.setStudent(student);
        lc.setContent(content);
        lc.setCourse(course);
        lc.setCompletedAt(LocalDateTime.now());
        lessonCompletionRepo.save(lc);

        CourseProgress progress = progressRepo
                .findByStudentIdAndCourseId(studentId, courseId)
                .orElseThrow();
        progress.setCompletedLessons(progress.getCompletedLessons() + 1);
        progressRepo.save(progress);

        return toDto(progress);
    }

    @Transactional
    public void markQuizPassed(Long studentId, Long courseId) {
        CourseProgress progress = progressRepo
                .findByStudentIdAndCourseId(studentId, courseId)
                .orElseThrow();
        if (!progress.isQuizPassed()) {
            progress.setQuizPassed(true);
            progressRepo.save(progress);
        }
    }

    public ProgressResponse getProgress(Long studentId, Long courseId) {
        CourseProgress p = progressRepo
                .findByStudentIdAndCourseId(studentId, courseId)
                .orElseThrow(() -> new RuntimeException("Progress record not found"));
        return toDto(p);
    }

    public List<ProgressResponse> getAllProgress(Long studentId) {
        return progressRepo.findByStudentId(studentId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private ProgressResponse toDto(CourseProgress p) {
        ProgressResponse response = new ProgressResponse();
        response.setCourseId(p.getCourse().getId());
        response.setCourseTitle(p.getCourse().getTitle());
        response.setCompletedLessons(p.getCompletedLessons());
        response.setTotalLessons(p.getTotalLessons());
        response.setQuizPassed(p.isQuizPassed());
        response.setProgressPercent(Math.round(p.getProgressPercent() * 10.0) / 10.0);
        response.setProgressLabel(p.getCompletedLessons() + " / " + p.getTotalLessons() + " lessons");
        return response;
    }
}