package com.smartprep.controller;

import com.smartprep.dto.ApiResponse;
import com.smartprep.model.FlashcardResult;
import com.smartprep.model.User;
import com.smartprep.service.FlashcardResultService;
import com.smartprep.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/flashcards")
@RequiredArgsConstructor
public class FlashcardResultController {
    private final FlashcardResultService service;
    private final UserService userService;

    @PostMapping("/submit")
    public ResponseEntity<ApiResponse<FlashcardResult>> submitResult(
            Authentication auth,
            @RequestBody Map<String, Object> body) {
        User user = userService.findUserByEmail(auth.getName());
        String subject = (String) body.get("subject");
        Integer total = (Integer) body.get("totalCards");
        Integer mastered = (Integer) body.get("masteredCards");
        
        FlashcardResult saved = service.saveResult(user, subject, total, mastered);
        return ResponseEntity.ok(ApiResponse.success("Flashcard score saved successfully", saved));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<FlashcardResult>>> getHistory(Authentication auth) {
        User user = userService.findUserByEmail(auth.getName());
        List<FlashcardResult> history = service.getUserResults(user.getId());
        return ResponseEntity.ok(ApiResponse.success("Flashcard history fetched", history));
    }
}
