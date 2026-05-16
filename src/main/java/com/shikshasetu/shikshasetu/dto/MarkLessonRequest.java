package com.shikshasetu.shikshasetu.dto;

public class MarkLessonRequest {
    private Long contentId;
    private Long courseId;

    public Long getContentId() { return contentId; }
    public Long getCourseId() { return courseId; }
    public void setContentId(Long contentId) { this.contentId = contentId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }
}