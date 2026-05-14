package com.smartprep.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "custom_tasks")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CustomTask {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, columnDefinition = "uuid")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User user;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(name = "subject_name", length = 150)
    private String subjectName;

    @Column(length = 10)
    @Builder.Default
    private String priority = "MEDIUM"; // HIGH | MEDIUM | LOW

    @Column(name = "duration_hours")
    @Builder.Default
    private Double durationHours = 1.0;

    @Column(name = "scheduled_date")
    private LocalDate scheduledDate;

    @Column(name = "deadline")
    private LocalDateTime deadline;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(length = 20)
    @Builder.Default
    private String status = "pending"; // pending | completed

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    /* ── Granular Progress Tracking (Structured Execution) ── */

    @Builder.Default
    @Column(name = "video_completed")
    private Boolean videoCompleted = false;

    @Builder.Default
    @Column(name = "notes_completed")
    private Boolean notesCompleted = false;

    @Builder.Default
    @Column(name = "mcq_completed")
    private Boolean mcqCompleted = false;

    @Builder.Default
    @Column(name = "pyq_completed")
    private Boolean pyqCompleted = false;

    @Builder.Default
    @Column(name = "is_rescheduled")
    private Boolean isRescheduled = false;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
