package com.shikshasetu.shikshasetu.service;

import com.shikshasetu.shikshasetu.model.Course;
import com.shikshasetu.shikshasetu.model.CourseContent;
import com.shikshasetu.shikshasetu.repository.CourseContentRepository;
import com.shikshasetu.shikshasetu.repository.CourseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseContentService {

    private final CourseContentRepository courseContentRepository;
    private final CourseRepository courseRepository;

    public CourseContentService(CourseContentRepository courseContentRepository,
                                CourseRepository courseRepository) {
        this.courseContentRepository = courseContentRepository;
        this.courseRepository = courseRepository;
    }

    public CourseContent addContent(Long courseId, CourseContent content) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found!"));
        content.setCourse(course);
        return courseContentRepository.save(content);
    }

    public List<CourseContent> getContentByCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found!"));
        return courseContentRepository.findByCourseOrderByOrderIndexAsc(course);
    }

    public void deleteContent(Long contentId) {
        courseContentRepository.deleteById(contentId);
    }
}