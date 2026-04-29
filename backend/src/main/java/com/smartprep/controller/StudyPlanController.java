package com.smartprep.controller;

import com.smartprep.dto.ApiResponse;
import com.smartprep.model.StudyPlan;
import com.smartprep.service.StudyPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/study-plans")
@RequiredArgsConstructor
public class StudyPlanController {

    private final StudyPlanService studyPlanService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<StudyPlan>>> getStudyPlansByUserId(@PathVariable UUID userId) {
        return ResponseEntity.ok(ApiResponse.success("Study plans fetched successfully", studyPlanService.getStudyPlansByUserId(userId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<StudyPlan>> createStudyPlan(@RequestBody StudyPlan studyPlan) {
        return ResponseEntity.ok(ApiResponse.success("Study plan created successfully", studyPlanService.createStudyPlan(studyPlan)));
    }
}
