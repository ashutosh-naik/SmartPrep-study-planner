package com.smartprep.dto;

/**
 * Java 21 Record — immutable DTO for task status update payload.
 * Valid status values: "completed", "skipped"
 */
public record TaskUpdateRequest(String status) {}
