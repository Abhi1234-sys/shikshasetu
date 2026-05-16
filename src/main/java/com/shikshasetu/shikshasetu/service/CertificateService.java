package com.shikshasetu.shikshasetu.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import com.shikshasetu.shikshasetu.model.Certificate;
import com.shikshasetu.shikshasetu.model.Course;
import com.shikshasetu.shikshasetu.model.User;
import com.shikshasetu.shikshasetu.repository.CertificateRepository;
import com.shikshasetu.shikshasetu.repository.CourseRepository;
import com.shikshasetu.shikshasetu.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.io.FileOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
public class CertificateService {

    private final CertificateRepository certificateRepo;
    private final UserRepository userRepo;
    private final CourseRepository courseRepo;

    public CertificateService(CertificateRepository certificateRepo,
                              UserRepository userRepo,
                              CourseRepository courseRepo) {
        this.certificateRepo = certificateRepo;
        this.userRepo = userRepo;
        this.courseRepo = courseRepo;
    }

    private static final String CERT_DIR = "certificates/";

    public Certificate generateCertificate(Long studentId, Long courseId) throws Exception {

        if (certificateRepo.existsByStudentIdAndCourseId(studentId, courseId)) {
            return certificateRepo.findByStudentIdAndCourseId(studentId, courseId).orElseThrow();
        }

        User student = userRepo.findById(studentId).orElseThrow();
        Course course = courseRepo.findById(courseId).orElseThrow();

        String certNumber = "CERT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        java.io.File dir = new java.io.File(CERT_DIR);
        if (!dir.exists()) dir.mkdirs();

        String filePath = CERT_DIR + certNumber + ".pdf";

        generatePdf(student.getName(), course.getTitle(), certNumber, filePath);

        Certificate certificate = new Certificate();
        certificate.setStudent(student);
        certificate.setCourse(course);
        certificate.setCertificateNumber(certNumber);
        certificate.setFilePath(filePath);

        return certificateRepo.save(certificate);
    }

    private void generatePdf(String studentName, String courseTitle,
                             String certNumber, String filePath)
            throws DocumentException, IOException {

        Document document = new Document(PageSize.A4.rotate());
        PdfWriter.getInstance(document, new FileOutputStream(filePath));
        document.open();

        Font titleFont = new Font(Font.FontFamily.HELVETICA, 36, Font.BOLD, new BaseColor(0, 102, 204));
        Paragraph title = new Paragraph("Certificate of Completion", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingBefore(60);
        document.add(title);

        Font subFont = new Font(Font.FontFamily.HELVETICA, 16, Font.NORMAL, BaseColor.DARK_GRAY);
        Paragraph subtitle = new Paragraph("This is to certify that", subFont);
        subtitle.setAlignment(Element.ALIGN_CENTER);
        subtitle.setSpacingBefore(30);
        document.add(subtitle);

        Font nameFont = new Font(Font.FontFamily.HELVETICA, 28, Font.BOLD, new BaseColor(0, 51, 102));
        Paragraph name = new Paragraph(studentName, nameFont);
        name.setAlignment(Element.ALIGN_CENTER);
        name.setSpacingBefore(10);
        document.add(name);

        Font courseFont = new Font(Font.FontFamily.HELVETICA, 16, Font.NORMAL, BaseColor.DARK_GRAY);
        Paragraph courseText = new Paragraph("has successfully completed the course", courseFont);
        courseText.setAlignment(Element.ALIGN_CENTER);
        courseText.setSpacingBefore(10);
        document.add(courseText);

        Font courseTitleFont = new Font(Font.FontFamily.HELVETICA, 22, Font.BOLDITALIC, new BaseColor(0, 102, 204));
        Paragraph courseTitlePara = new Paragraph(courseTitle, courseTitleFont);
        courseTitlePara.setAlignment(Element.ALIGN_CENTER);
        courseTitlePara.setSpacingBefore(10);
        document.add(courseTitlePara);

        String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy"));
        Font dateFont = new Font(Font.FontFamily.HELVETICA, 14, Font.NORMAL, BaseColor.GRAY);
        Paragraph datePara = new Paragraph("Date: " + date, dateFont);
        datePara.setAlignment(Element.ALIGN_CENTER);
        datePara.setSpacingBefore(30);
        document.add(datePara);

        Font certFont = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL, BaseColor.GRAY);
        Paragraph certPara = new Paragraph("Certificate No: " + certNumber, certFont);
        certPara.setAlignment(Element.ALIGN_CENTER);
        certPara.setSpacingBefore(10);
        document.add(certPara);

        Font brandFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD, new BaseColor(0, 102, 204));
        Paragraph brand = new Paragraph("Shikshasetu", brandFont);
        brand.setAlignment(Element.ALIGN_CENTER);
        brand.setSpacingBefore(40);
        document.add(brand);

        document.close();
    }

    public Certificate getCertificate(Long studentId, Long courseId) {
        return certificateRepo.findByStudentIdAndCourseId(studentId, courseId)
                .orElseThrow(() -> new RuntimeException("Certificate not found!"));
    }
}