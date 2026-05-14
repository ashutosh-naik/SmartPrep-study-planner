package com.smartprep.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "study_plan_id")
    private StudyPlan studyPlan;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id")
    private Topic topic;

    @Column(name = "scheduled_date")
    private LocalDate scheduledDate;

    @Column(name = "duration_hours", precision = 4, scale = 1)
    private BigDecimal durationHours;

    @Builder.Default
    @Column(length = 20)
    private String status = "pending"; // pending, completed, skipped

    @Builder.Default
    @Column(name = "is_backlog")
    private Boolean isBacklog = false;

    @Builder.Default
    @Column(name = "is_revision")
    private Boolean isRevision = false;

    @Builder.Default
    @Column(name = "revision_level")
    private Integer revisionLevel = 0; // 0=Study, 1=R1, 2=R2, 3=Final

    @Column(name = "original_date")
    private LocalDate originalDate;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    /* ── New fields for personal daily task list ── */

    /** Standalone task title (null for study-plan tasks, set for custom tasks) */
    @Column(name = "title", length = 255)
    private String title;

    /** Subject label for custom tasks */
    @Column(name = "subject_name", length = 100)
    private String subjectName;

    /** Priority: HIGH | MEDIUM | LOW */
    @Builder.Default
    @Column(length = 10)
    private String priority = "MEDIUM";

    /** Optional deadline for reminders */
    @Column(name = "deadline")
    private LocalDateTime deadline;

    /** Optional notes / description */
    @Column(name = "notes", length = 1000)
    private String notes;

    /**
     * true = manually created task (not from study plan generator).
     * Used to separate daily tasks from planner tasks in queries.
     */
    @Builder.Default
    @Column(name = "is_custom_task")
    private Boolean isCustomTask = false;

    /* ── Granular Progress Tracking ── */

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

}

