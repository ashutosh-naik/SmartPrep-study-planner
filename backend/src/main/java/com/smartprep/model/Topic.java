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
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(name = "estimated_hours", precision = 4, scale = 1)
    private BigDecimal estimatedHours;
    @Column(name = "youtube_video_url")
    private String youtubeVideoUrl;

    @Column(name = "is_completed")
    @Builder.Default
    private Boolean isCompleted = false;
}
