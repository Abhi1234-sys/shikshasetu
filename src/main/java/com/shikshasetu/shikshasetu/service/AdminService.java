package com.shikshasetu.shikshasetu.service;

import com.shikshasetu.shikshasetu.dto.StudentDTO;
import com.shikshasetu.shikshasetu.model.*;
import com.shikshasetu.shikshasetu.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final AnnouncementRepository announcementRepository;
    private final CourseContentRepository courseContentRepository;

    public AdminService(CourseRepository courseRepository,
                        UserRepository userRepository,
                        AnnouncementRepository announcementRepository,
                        CourseContentRepository courseContentRepository) {
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.announcementRepository = announcementRepository;
        this.courseContentRepository = courseContentRepository;
    }

    @Transactional(readOnly = true)
    public List<StudentDTO> getAllStudentsForDirectory() {
        return userRepository.findAll().stream()
                .filter(user -> "STUDENT".equalsIgnoreCase(user.getRole()) || "ROLE_STUDENT".equalsIgnoreCase(user.getRole()))
                .map(this::mapToStudentDTO)
                .collect(Collectors.toList());
    }

    private StudentDTO mapToStudentDTO(User user) {
        StudentDTO dto = new StudentDTO();
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setStudentClass(user.getStudentClass() != null ? user.getStudentClass() : "N/A");

        if (user.getCreatedAt() != null) {
            dto.setEnrollmentDate(user.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
        }

        if (user.getEnrollments() != null && !user.getEnrollments().isEmpty()) {
            List<String> titles = user.getEnrollments().stream()
                    .map(enrollment -> enrollment.getCourse() != null ? enrollment.getCourse().getTitle() : "Unknown Course")
                    .distinct()
                    .collect(Collectors.toList());
            dto.setEnrolledCourses(titles);
        } else {
            dto.setEnrolledCourses(new ArrayList<>());
        }
        return dto;
    }

    @Transactional
    public Course togglePopularStatus(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Course not found."));
        course.setPopular(!course.isPopular());
        return courseRepository.save(course);
    }

    @Transactional
    public CourseContent addContentToCourse(Long courseId, CourseContent content) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Error: Course ID " + courseId + " not found."));
        content.setCourse(course);
        return courseContentRepository.save(content);
    }

    @Transactional
    public Announcement postAnnouncement(String message) {
        Announcement announcement = new Announcement();
        announcement.setTitle("Campus Update");
        announcement.setMessage(message);
        return announcementRepository.save(announcement);
    }


    @Transactional
    public Announcement updateAnnouncement(Long id, String newMessage) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Announcement not found."));
        announcement.setMessage(newMessage);
        return announcementRepository.save(announcement);
    }


    @Transactional
    public void deleteAnnouncement(Long id) {
        if (!announcementRepository.existsById(id)) {
            throw new RuntimeException("Error: Announcement not found.");
        }
        announcementRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAllByOrderByIdDesc();
    }
}