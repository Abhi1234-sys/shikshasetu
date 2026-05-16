package com.shikshasetu.shikshasetu.repository;

import com.shikshasetu.shikshasetu.model.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {



    List<Announcement> findAllByOrderByIdDesc();


}