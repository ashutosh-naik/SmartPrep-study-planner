package com.smartprep.controller;

import com.smartprep.model.Course;
import com.smartprep.model.Paper;
import com.smartprep.model.University;
import com.smartprep.service.PYQService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pyqs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PYQController {

    private final PYQService pyqService;

    @GetMapping("/universities")
    public ResponseEntity<List<University>> getUniversities() {
        return ResponseEntity.ok(pyqService.getAllUniversities());
    }

    @GetMapping("/courses")
    public ResponseEntity<List<Course>> getCourses(@RequestParam String university) {
        return ResponseEntity.ok(pyqService.getCoursesByUniversity(university));
    }

    @GetMapping("/papers")
    public ResponseEntity<List<Paper>> getPapers(
            @RequestParam String university,
            @RequestParam String course,
            @RequestParam(required = false) Integer year) {
        return ResponseEntity.ok(pyqService.getPapers(university, course, year));
    }
}
