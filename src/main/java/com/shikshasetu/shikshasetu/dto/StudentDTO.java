package com.shikshasetu.shikshasetu.dto;

import java.util.ArrayList;
import java.util.List;

public class StudentDTO {
    private String name;
    private String email;
    private String studentClass;
    private String enrollmentDate;
    private List<String> enrolledCourses = new ArrayList<>(); // 🟢 Initialize to avoid NullPointerException

    public StudentDTO() {}

    public StudentDTO(String name, String email, String studentClass, String enrollmentDate, List<String> enrolledCourses) {
        this.name = name;
        this.email = email;
        this.studentClass = studentClass;
        this.enrollmentDate = enrollmentDate;
        this.enrolledCourses = enrolledCourses != null ? enrolledCourses : new ArrayList<>();
    }

    // --- GETTERS AND SETTERS ---
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getStudentClass() { return studentClass; }
    public void setStudentClass(String studentClass) { this.studentClass = studentClass; }

    public String getEnrollmentDate() { return enrollmentDate; }
    public void setEnrollmentDate(String enrollmentDate) { this.enrollmentDate = enrollmentDate; }

    public List<String> getEnrolledCourses() { return enrolledCourses; }
    public void setEnrolledCourses(List<String> enrolledCourses) {
        this.enrolledCourses = enrolledCourses != null ? enrolledCourses : new ArrayList<>();
    }
}