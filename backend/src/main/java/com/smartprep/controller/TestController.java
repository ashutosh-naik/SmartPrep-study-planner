package com.smartprep.controller;

import com.smartprep.dto.ApiResponse;
import com.smartprep.model.Test;
import com.smartprep.model.User;
import com.smartprep.model.Result;
import com.smartprep.service.TestService;
import com.smartprep.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tests")
@RequiredArgsConstructor
public class TestController {

    private final TestService testService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Test>>> getAllTests() {
        return ResponseEntity.ok(ApiResponse.success("Tests fetched successfully", testService.getAllTests()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Test>> getTestById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Test fetched successfully", testService.getTestById(id)));
    }

    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<ApiResponse<List<Test>>> getTestsBySubjectId(@PathVariable UUID subjectId) {
        return ResponseEntity.ok(ApiResponse.success("Tests fetched successfully", testService.getTestsBySubjectId(subjectId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Test>> createTest(@RequestBody Test test) {
        return ResponseEntity.ok(ApiResponse.success("Test created successfully", testService.createTest(test)));
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<ApiResponse<Result>> submitTest(
            Authentication auth,
            @PathVariable UUID id,
            @RequestBody java.util.Map<String, Object> body) {
        User user = userService.findUserByEmail(auth.getName());
        Integer score = (Integer) body.get("score");
        return ResponseEntity.ok(ApiResponse.success("Test result saved", testService.submitTest(user, id, score)));
    }
}
