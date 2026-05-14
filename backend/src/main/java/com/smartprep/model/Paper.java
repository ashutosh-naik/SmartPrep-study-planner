package com.smartprep.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "papers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Paper {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String university;

    @Column(nullable = false)
    private String course;

    @Column(nullable = false)
    private String session; // e.g., April 2025

    @Column(nullable = false)
    private Integer year;

    @Column(nullable = false, length = 1024)
    private String pdfUrl;

    @Column(nullable = false, length = 1024)
    private String sourceUrl;

    private String pattern;

    private boolean fileExistsStatus;

    private LocalDateTime fetchedAt;
}
