package com.shikshasetu.shikshasetu.service;

import com.shikshasetu.shikshasetu.model.Announcement;
import com.shikshasetu.shikshasetu.model.User;
import com.shikshasetu.shikshasetu.repository.AnnouncementRepository;
import com.shikshasetu.shikshasetu.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final UserRepository userRepository;

    public AnnouncementService(AnnouncementRepository announcementRepository,
                               UserRepository userRepository) {
        this.announcementRepository = announcementRepository;
        this.userRepository = userRepository;
    }

    /**
     * Admin creates announcement.
     * Maps the Title, Message, and the Admin User object.
     */
    @Transactional
    public Announcement createAnnouncement(String title, String message, Long adminId) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Error: Admin user not found."));

        Announcement announcement = new Announcement();
        announcement.setTitle(title);
        announcement.setMessage(message);
        announcement.setCreatedBy(admin);

        return announcementRepository.save(announcement);
    }

    /**
     *  Everyone can see announcements.
     * FIXED: Uses findAllByOrderByIdDesc to resolve the IDE error
     * and ensure the latest notices appear at the top.
     */
    @Transactional(readOnly = true)
    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAllByOrderByIdDesc();
    }

    /**
     *  Admin deletes announcement.
     */
    @Transactional
    public void deleteAnnouncement(Long id) {
        if (!announcementRepository.existsById(id)) {
            throw new RuntimeException("Error: Notice not found.");
        }
        announcementRepository.deleteById(id);
    }
}