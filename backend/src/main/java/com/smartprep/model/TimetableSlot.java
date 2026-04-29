package com.smartprep.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "timetable_slots")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TimetableSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, columnDefinition = "uuid")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User user;

    // Matches frontend field: dayOfWeek (1=Mon … 7=Sun)
    @Column(name = "day_of_week", nullable = false)
    private Integer dayOfWeek;

    @Column(name = "start_time", nullable = false, length = 10)
    private String startTime;

    @Column(name = "end_time", nullable = false, length = 10)
    private String endTime;

    // Matches frontend field: subjectName
    @Column(name = "subject_name", nullable = false, length = 150)
    private String subjectName;

    @Column(length = 200)
    private String label;

    @Column(length = 7)
    private String color;
}
