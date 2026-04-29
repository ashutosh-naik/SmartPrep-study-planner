package com.smartprep.dto;

import java.util.Map;

/**
 * Java 21 Record — immutable DTO for test submission payload.
 * answers: questionId → selectedOption (A/B/C/D)
 */
public record TestSubmissionRequest(
        Map<Long, String> answers,
        Integer timeTakenMinutes
) {}
