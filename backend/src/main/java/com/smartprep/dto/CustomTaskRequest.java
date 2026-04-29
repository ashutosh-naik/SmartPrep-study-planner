package com.smartprep.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CustomTaskRequest {
    private String title;
    private String subjectName;
    private String priority;       // HIGH | MEDIUM | LOW
    private Double durationHours;
    private String scheduledDate;  // ISO date string yyyy-MM-dd
    private LocalDateTime deadline;
    private String notes;
}
