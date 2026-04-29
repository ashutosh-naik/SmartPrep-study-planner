package com.smartprep.controller;

import com.smartprep.dto.ApiResponse;
import com.smartprep.model.TimetableSlot;
import com.smartprep.service.TimetableService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/timetable")
@RequiredArgsConstructor
public class TimetableController {

    private final TimetableService timetableService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TimetableSlot>>> getSlots(Authentication auth) {
        List<TimetableSlot> slots = timetableService.getSlots(auth.getName());
        return ResponseEntity.ok(ApiResponse.success("Timetable fetched", slots));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TimetableSlot>> createSlot(
            Authentication auth,
            @RequestBody Map<String, Object> body) {
        TimetableSlot slot = timetableService.createSlot(auth.getName(), body);
        return ResponseEntity.ok(ApiResponse.success("Slot created", slot));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSlot(
            Authentication auth,
            @PathVariable UUID id) {
        timetableService.deleteSlot(auth.getName(), id);
        return ResponseEntity.ok(ApiResponse.success("Slot deleted", null));
    }
}
