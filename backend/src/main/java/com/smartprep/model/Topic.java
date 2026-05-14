package com.smartprep.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "topics")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Topic {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unit_id", nullable = false)
    private Unit unit;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(name = "estimated_hours", precision = 4, scale = 1)
    private BigDecimal estimatedHours;

    @Builder.Default
    @Column(name = "difficulty", length = 20)
    private String difficulty = "MEDIUM"; // EASY, MEDIUM, HARD

    @Column(name = "youtube_video_url")
    private String youtubeVideoUrl;

    @Column(name = "short_notes", columnDefinition = "TEXT")
    private String shortNotes;

    @Column(name = "has_mcqs")
    @Builder.Default
    private Boolean hasMcqs = true;

    @Column(name = "has_pyqs")
    @Builder.Default
    private Boolean hasPyqs = true;

    @Column(name = "is_completed")
    @Builder.Default
    private Boolean isCompleted = false;
}
