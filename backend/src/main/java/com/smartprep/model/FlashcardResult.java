package com.smartprep.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "flashcard_results")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FlashcardResult {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String subject;
    private Integer totalCards;
    private Integer masteredCards;
    private LocalDateTime completedAt;

    @PrePersist
    protected void onCreate() { this.completedAt = LocalDateTime.now(); }
}
