package com.smartprep.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    // ── Profile fields ──
    @Column(length = 100)
    private String course;

    @Column(length = 50)
    private String year;

    @Column(name = "exam_type", length = 50)
    private String examType;

    @Column(name = "exam_date")
    private LocalDate examDate;

    @Column(name = "study_hours_per_day")
    @Builder.Default
    private Integer studyHoursPerDay = 4;

    @Column(name = "preferred_study_time", length = 20)
    private String preferredStudyTime;

    @Column(name = "break_duration")
    @Builder.Default
    private Integer breakDuration = 15;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<StudyPlan> studyPlans = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<Result> results = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
