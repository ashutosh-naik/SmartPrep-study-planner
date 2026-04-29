package com.smartprep.controller;

import com.smartprep.dto.ApiResponse;
import com.smartprep.model.Subject;
import com.smartprep.service.SubjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/subjects")
@RequiredArgsConstructor
public class SubjectController {

    private final SubjectService subjectService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Subject>>> getAllSubjects() {
        return ResponseEntity.ok(ApiResponse.success("Subjects fetched successfully", subjectService.getAllSubjects()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Subject>> getSubjectById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Subject fetched successfully", subjectService.getSubjectById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Subject>> createSubject(@RequestBody Subject subject) {
        return ResponseEntity.ok(ApiResponse.success("Subject created successfully", subjectService.createSubject(subject)));
    }
}
