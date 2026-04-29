package com.smartprep.controller;

import com.smartprep.dto.ApiResponse;
import com.smartprep.model.Topic;
import com.smartprep.service.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/topics")
@RequiredArgsConstructor
public class TopicController {

    private final TopicService topicService;

    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<ApiResponse<List<Topic>>> getTopicsBySubjectId(@PathVariable UUID subjectId) {
        return ResponseEntity.ok(ApiResponse.success("Topics fetched successfully", topicService.getTopicsBySubjectId(subjectId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Topic>> createTopic(@RequestBody Topic topic) {
        return ResponseEntity.ok(ApiResponse.success("Topic created successfully", topicService.createTopic(topic)));
    }
}
