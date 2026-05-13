package com.smartprep.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "universities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class University {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 150)
    private String name;

    @Column(name = "official_url")
    private String officialUrl;

    @Column(name = "logo_url")
    private String logoUrl;

    @OneToMany(mappedBy = "university", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<QuestionPaper> questionPapers = new ArrayList<>();
}
