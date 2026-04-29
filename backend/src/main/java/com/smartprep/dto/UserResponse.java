package com.smartprep.dto;

import java.time.LocalDate;

import java.util.UUID;

/**
 * Java 21 Record — immutable DTO for user profile response.
 * Replaces Lombok @Builder/@Getter/@Setter/@NoArgsConstructor/@AllArgsConstructor.
 * Use the canonical constructor directly: new UserResponse(id, name, ...).
 */
public record UserResponse(
        UUID id,
        String name,
        String email,
        String course,
        String year,
        String examType,
        LocalDate examDate,
        Integer studyHoursPerDay,
        String preferredStudyTime,
        Integer breakDuration
) {}
