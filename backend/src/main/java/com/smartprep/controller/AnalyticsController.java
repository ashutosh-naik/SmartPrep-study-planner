package com.smartprep.controller;

import com.smartprep.dto.ApiResponse;
import com.smartprep.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboard(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success(
            "Dashboard data fetched", 
            analyticsService.getDashboardData(auth.getName())
        ));
    }

    @GetMapping("/performance")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPerformance(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success(
            "Performance metrics fetched", 
            analyticsService.getPerformanceData(auth.getName())
        ));
    }

    @GetMapping("/readiness")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getReadiness(Authentication auth) {
        // For now, readiness is part of dashboard/performance, but providing a dedicated endpoint
        return ResponseEntity.ok(ApiResponse.success(
            "Readiness index fetched", 
            analyticsService.getDashboardData(auth.getName())
        ));
    }
}
