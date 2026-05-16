package com.shikshasetu.shikshasetu.controller;

import com.shikshasetu.shikshasetu.model.Certificate;
import com.shikshasetu.shikshasetu.security.CustomUserDetails;
import com.shikshasetu.shikshasetu.service.CertificateService;
import com.shikshasetu.shikshasetu.service.ProgressService;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.File;

@RestController
@RequestMapping("/api/certificate")
public class CertificateController {

    private final CertificateService certificateService;
    private final ProgressService progressService;

    public CertificateController(CertificateService certificateService,
                                 ProgressService progressService) {
        this.certificateService = certificateService;
        this.progressService = progressService;
    }

    // POST /api/certificate/generate/{courseId}
    @PostMapping("/generate/{courseId}")
    public ResponseEntity<?> generateCertificate(
            @PathVariable Long courseId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            Long studentId = userDetails.getId();


            double progress = progressService.getProgress(studentId, courseId).getProgressPercent();
            if (progress < 100.0) {
                return ResponseEntity.badRequest()
                        .body("Course not completed yet! Progress: " + progress + "%");
            }

            Certificate cert = certificateService.generateCertificate(studentId, courseId);
            return ResponseEntity.ok("Certificate generated! Number: " + cert.getCertificateNumber());

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    // GET /api/certificate/download/{courseId}
    @GetMapping("/download/{courseId}")
    public ResponseEntity<Resource> downloadCertificate(
            @PathVariable Long courseId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            Long studentId = userDetails.getId();
            Certificate cert = certificateService.getCertificate(studentId, courseId);

            File file = new File(cert.getFilePath());
            Resource resource = new FileSystemResource(file);

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + cert.getCertificateNumber() + ".pdf\"")
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}