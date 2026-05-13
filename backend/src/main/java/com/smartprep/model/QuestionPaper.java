package com.smartprep.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "question_papers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionPaper {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "university_id", nullable = false)
    private University university;

    @Column(nullable = false, length = 100)
    private String course;

    @Column(nullable = false, length = 150)
    private String subjectName;

    @Column(nullable = false)
    private Integer year;

    @Column(nullable = false)
    private Integer semester;

    @Column(name = "download_url", nullable = false)
    private String downloadUrl;

    @Column(name = "is_official")
    @Builder.Default
    private Boolean isOfficial = true;
}
