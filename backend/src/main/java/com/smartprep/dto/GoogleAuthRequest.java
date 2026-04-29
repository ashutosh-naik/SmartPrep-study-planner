package com.smartprep.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Java 21 Record — immutable DTO for Google OAuth token payload.
 */
public record GoogleAuthRequest(
        @NotBlank(message = "Token is required")
        String token
) {}
