package com.smartprep.controller;

import com.smartprep.dto.ApiResponse;
import com.smartprep.model.QuestionPaper;
import com.smartprep.model.University;
import com.smartprep.repository.QuestionPaperRepository;
import com.smartprep.repository.UniversityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/pyqs")
@RequiredArgsConstructor
public class PYQController {

    private final UniversityRepository universityRepository;
    private final QuestionPaperRepository questionPaperRepository;

    @GetMapping("/universities")
    public ResponseEntity<ApiResponse<List<University>>> getAllUniversities() {
        return ResponseEntity.ok(ApiResponse.success("Universities fetched successfully", universityRepository.findAll()));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<QuestionPaper>>> searchPapers(
            @RequestParam UUID universityId,
            @RequestParam String course,
            @RequestParam Integer semester) {
        return ResponseEntity.ok(ApiResponse.success("Papers fetched successfully", 
            questionPaperRepository.findByUniversityIdAndCourseAndSemester(universityId, course, semester)));
    }

    @GetMapping("/subject")
    public ResponseEntity<ApiResponse<List<QuestionPaper>>> findBySubject(@RequestParam String name) {
        return ResponseEntity.ok(ApiResponse.success("Papers fetched successfully", 
            questionPaperRepository.findBySubjectNameContainingIgnoreCase(name)));
    }
}
