package com.smartprep.controller;

import com.smartprep.dto.ApiResponse;
import com.smartprep.model.CustomTask;
import com.smartprep.model.User;
import com.smartprep.repository.CustomTaskRepository;
import com.smartprep.repository.UserRepository;
import com.smartprep.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final CustomTaskRepository taskRepo;
    private final UserRepository userRepo;
    private final TaskService taskService;

    /* ── Study-plan tasks ── */

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getTasks(
            Authentication auth,
            @RequestParam(defaultValue = "all") String filter) {
        return ResponseEntity.ok(ApiResponse.success("Tasks fetched", taskService.getTasks(auth.getName(), filter)));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<Map<String, Object>>> completeTask(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Task completed", taskService.completeTask(id)));
    }

    @PutMapping("/{id}/skip")
    public ResponseEntity<ApiResponse<Map<String, Object>>> skipTask(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Task skipped", taskService.skipTask(id)));
    }

    @PutMapping("/{id}/subtask")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateSubTask(
            @PathVariable Long id,
            @RequestParam String type,
            @RequestParam boolean completed) {
        return ResponseEntity.ok(ApiResponse.success("Subtask updated", taskService.updateSubTaskStatus(id, type, completed)));
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getTaskSummary(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success("Task summary fetched", taskService.getTaskSummary(auth.getName())));
    }

    @PostMapping("/recovery")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> createRecoveryRoadmap(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success("Recovery roadmap created", taskService.createRecoveryRoadmap(auth.getName())));
    }

    /* ── Custom (personal) daily tasks ── */

    @GetMapping("/custom")
    public ResponseEntity<ApiResponse<List<CustomTask>>> getCustomTasks(
            Authentication auth,
            @RequestParam(defaultValue = "all") String filter) {

        List<CustomTask> tasks = taskRepo.findByUserEmailOrderByCreatedAtDesc(auth.getName());

        List<CustomTask> filtered = tasks.stream().filter(t -> {
            if ("today".equals(filter)) {
                return t.getScheduledDate() != null && t.getScheduledDate().equals(LocalDate.now());
            }
            if ("done".equals(filter))    return "completed".equals(t.getStatus());
            if ("pending".equals(filter)) return !"completed".equals(t.getStatus());
            return true;
        }).toList();

        return ResponseEntity.ok(ApiResponse.success("Tasks fetched", filtered));
    }

    @PostMapping("/custom")
    public ResponseEntity<ApiResponse<CustomTask>> createTask(
            Authentication auth,
            @RequestBody Map<String, Object> body) {

        User user = userRepo.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        CustomTask task = CustomTask.builder()
                .user(user)
                .title(str(body, "title"))
                .subjectName(str(body, "subjectName"))
                .priority(body.getOrDefault("priority", "MEDIUM").toString())
                .durationHours(toDouble(body.get("durationHours"), 1.0))
                .scheduledDate(body.get("scheduledDate") != null
                        ? LocalDate.parse(body.get("scheduledDate").toString()) : null)
                .deadline(body.get("deadline") != null && !body.get("deadline").toString().isBlank()
                        ? LocalDateTime.parse(body.get("deadline").toString().replace(" ", "T").substring(0, 19)) : null)
                .notes(str(body, "notes"))
                .status("pending")
                .build();

        return ResponseEntity.ok(ApiResponse.success("Task created", taskRepo.save(task)));
    }

    @PutMapping("/custom/{id}")
    public ResponseEntity<ApiResponse<CustomTask>> updateTask(
            Authentication auth,
            @PathVariable UUID id,
            @RequestBody Map<String, Object> body) {

        CustomTask task = taskRepo.findByIdAndUserEmail(id, auth.getName())
                .orElseThrow(() -> new RuntimeException("Task not found or access denied"));

        if (body.containsKey("title"))        task.setTitle(str(body, "title"));
        if (body.containsKey("subjectName"))  task.setSubjectName(str(body, "subjectName"));
        if (body.containsKey("priority"))     task.setPriority(body.get("priority").toString());
        if (body.containsKey("durationHours")) task.setDurationHours(toDouble(body.get("durationHours"), 1.0));
        if (body.containsKey("scheduledDate") && body.get("scheduledDate") != null)
            task.setScheduledDate(LocalDate.parse(body.get("scheduledDate").toString()));
        if (body.containsKey("notes"))        task.setNotes(str(body, "notes"));
        if (body.containsKey("status"))       task.setStatus(body.get("status").toString());
        if (body.containsKey("videoCompleted")) task.setVideoCompleted((Boolean) body.get("videoCompleted"));
        if (body.containsKey("notesCompleted")) task.setNotesCompleted((Boolean) body.get("notesCompleted"));
        if (body.containsKey("mcqCompleted"))   task.setMcqCompleted((Boolean) body.get("mcqCompleted"));
        if (body.containsKey("pyqCompleted"))   task.setPyqCompleted((Boolean) body.get("pyqCompleted"));
        if (body.containsKey("isRescheduled"))  task.setIsRescheduled((Boolean) body.get("isRescheduled"));

        if (body.containsKey("deadline") && body.get("deadline") != null && !body.get("deadline").toString().isBlank()) {
            try { task.setDeadline(LocalDateTime.parse(body.get("deadline").toString().replace(" ", "T").substring(0, 19))); }
            catch (Exception ignored) {}
        }

        return ResponseEntity.ok(ApiResponse.success("Task updated", taskRepo.save(task)));
    }

    @DeleteMapping("/custom/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(
            Authentication auth, @PathVariable UUID id) {

        CustomTask task = taskRepo.findByIdAndUserEmail(id, auth.getName())
                .orElseThrow(() -> new RuntimeException("Task not found or access denied"));
        taskRepo.delete(task);
        return ResponseEntity.ok(ApiResponse.success("Task deleted", null));
    }

    @PostMapping("/recover")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> recoverBacklogs(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success("Recovery roadmap generated", taskService.createRecoveryRoadmap(auth.getName())));
    }

    /* ── helpers ── */
    private String str(Map<String, Object> m, String key) {
        return m.get(key) != null ? m.get(key).toString() : null;
    }
    private double toDouble(Object v, double def) {
        try { return v != null ? Double.parseDouble(v.toString()) : def; } catch (Exception e) { return def; }
    }
}
