package com.smartprep.service;

import com.smartprep.dto.CustomTaskRequest;
import com.smartprep.exception.ResourceNotFoundException;
import com.smartprep.model.*;
import com.smartprep.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired private TaskRepository taskRepository;
    @Autowired private StudyPlanRepository studyPlanRepository;
    @Autowired private UserRepository userRepository;

    /* ─── Study-plan task queries ──────────────────────────────────── */

    public List<Map<String, Object>> getTasks(String email, String filter) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        StudyPlan plan = studyPlanRepository.findTopByUserIdOrderByCreatedAtDesc(user.getId())
                .orElse(null);

        if (plan == null) return new ArrayList<>();

        List<Task> tasks;
        LocalDate today = LocalDate.now();
        String filterType = filter != null ? filter.toLowerCase() : "all";

        tasks = switch (filterType) {
            case "today"  -> taskRepository.findByStudyPlanIdAndScheduledDate(plan.getId(), today);
            case "week"   -> taskRepository.findByStudyPlanIdAndScheduledDateBetween(plan.getId(), today, today.plusDays(6));
            default       -> taskRepository.findByStudyPlanId(plan.getId());
        };

        return tasks.stream().map(this::mapTask).collect(Collectors.toList());
    }

    public Map<String, Object> completeTask(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        task.setStatus("completed");
        task.setCompletedAt(LocalDateTime.now());
        return mapTask(taskRepository.save(task));
    }

    public Map<String, Object> skipTask(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        task.setStatus("skipped");
        task.setIsBacklog(true);
        return mapTask(taskRepository.save(task));
    }

    public Map<String, Object> getTaskSummary(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        StudyPlan plan = studyPlanRepository.findTopByUserIdOrderByCreatedAtDesc(user.getId())
                .orElse(null);

        Map<String, Object> summary = new HashMap<>();
        if (plan == null) {
            summary.put("total", 0); summary.put("completed", 0);
            summary.put("pending", 0); summary.put("skipped", 0);
            summary.put("completionRate", 0.0);
            return summary;
        }

        long total     = taskRepository.countByStudyPlanId(plan.getId());
        long completed = taskRepository.countByStudyPlanIdAndStatus(plan.getId(), "completed");
        long pending   = taskRepository.countByStudyPlanIdAndStatus(plan.getId(), "pending");
        long skipped   = taskRepository.countByStudyPlanIdAndStatus(plan.getId(), "skipped");

        summary.put("total", total);
        summary.put("completed", completed);
        summary.put("pending", pending);
        summary.put("skipped", skipped);
        summary.put("completionRate", total > 0 ? Math.round((completed * 100.0 / total) * 100.0) / 100.0 : 0.0);
        return summary;
    }

    /* ─── Custom (personal) daily tasks ───────────────────────────── */

    @Transactional
    public Map<String, Object> createCustomTask(String email, CustomTaskRequest req) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        LocalDate scheduled = LocalDate.now();
        if (req.getScheduledDate() != null && !req.getScheduledDate().isBlank()) {
            try { scheduled = LocalDate.parse(req.getScheduledDate()); } catch (Exception ignored) {}
        }

        Task task = Task.builder()
                .user(user)
                .title(req.getTitle())
                .subjectName(req.getSubjectName())
                .priority(req.getPriority() != null ? req.getPriority() : "MEDIUM")
                .durationHours(req.getDurationHours() != null
                        ? BigDecimal.valueOf(req.getDurationHours()) : BigDecimal.ONE)
                .deadline(req.getDeadline())
                .notes(req.getNotes())
                .scheduledDate(scheduled)
                .isCustomTask(true)
                .status("pending")
                .build();

        return mapTask(taskRepository.save(task));
    }

    public List<Map<String, Object>> getCustomTasks(String email, String filter) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Task> tasks = "today".equalsIgnoreCase(filter)
                ? taskRepository.findCustomTasksByUserIdAndDate(user.getId(), LocalDate.now())
                : taskRepository.findCustomTasksByUserId(user.getId());

        return tasks.stream().map(this::mapTask).collect(Collectors.toList());
    }

    public List<Map<String, Object>> getOverdueTasks(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return taskRepository.findOverdueCustomTasks(user.getId(), LocalDateTime.now())
                .stream().map(this::mapTask).collect(Collectors.toList());
    }

    @Transactional
    public void deleteCustomTask(Long taskId) {
        taskRepository.deleteById(taskId);
    }

    @Transactional
    public Map<String, Object> updateCustomTask(Long taskId, CustomTaskRequest req) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        if (req.getTitle()       != null) task.setTitle(req.getTitle());
        if (req.getSubjectName() != null) task.setSubjectName(req.getSubjectName());
        if (req.getPriority()    != null) task.setPriority(req.getPriority());
        if (req.getDeadline()    != null) task.setDeadline(req.getDeadline());
        if (req.getNotes()       != null) task.setNotes(req.getNotes());
        if (req.getDurationHours() != null) task.setDurationHours(BigDecimal.valueOf(req.getDurationHours()));
        return mapTask(taskRepository.save(task));
    }

    @Transactional
    public Map<String, Object> updateSubTaskStatus(Long taskId, String type, boolean completed) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        
        switch (type.toLowerCase()) {
            case "video" -> task.setVideoCompleted(completed);
            case "notes" -> task.setNotesCompleted(completed);
            case "mcq"   -> task.setMcqCompleted(completed);
            case "pyq"   -> task.setPyqCompleted(completed);
        }

        // Auto-update main status
        boolean allDone = true;
        if (task.getTopic() != null) {
            // Video and Notes are always mandatory
            if (!task.getVideoCompleted() || !task.getNotesCompleted()) allDone = false;
            if (task.getTopic().getHasMcqs() && !task.getMcqCompleted()) allDone = false;
            if (task.getTopic().getHasPyqs() && !task.getPyqCompleted()) allDone = false;
        } else {
            // For custom tasks, just use the main status
            allDone = "completed".equals(task.getStatus());
        }

        if (allDone) {
            task.setStatus("completed");
            task.setCompletedAt(LocalDateTime.now());
        } else {
            task.setStatus("pending");
            task.setCompletedAt(null);
        }

        return mapTask(taskRepository.save(task));
    }

    @Transactional
    public List<Map<String, Object>> createRecoveryRoadmap(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // Find the active study plan if it exists
        StudyPlan plan = studyPlanRepository.findTopByUserIdOrderByCreatedAtDesc(user.getId())
                .orElse(null);

        List<Task> overdueTasks = new ArrayList<>();

        // 1. Gather overdue study-plan tasks (if plan exists)
        if (plan != null) {
            overdueTasks.addAll(taskRepository.findByStudyPlanId(plan.getId()).stream()
                    .filter(t -> t.getScheduledDate() != null && t.getScheduledDate().isBefore(LocalDate.now()) && !"completed".equals(t.getStatus()))
                    .collect(Collectors.toList()));
        }

        // 2. Gather overdue custom tasks
        List<Task> overdueCustom = taskRepository.findCustomTasksByUserId(user.getId()).stream()
                .filter(t -> t.getScheduledDate() != null && t.getScheduledDate().isBefore(LocalDate.now()) && !"completed".equals(t.getStatus()))
                .collect(Collectors.toList());
        overdueTasks.addAll(overdueCustom);

        if (overdueTasks.isEmpty()) return new ArrayList<>();

        // Sort by priority and date to ensure logical recovery
        overdueTasks.sort((a, b) -> {
            Map<String, Integer> pMap = Map.of("HIGH", 1, "MEDIUM", 2, "LOW", 3);
            int pA = pMap.getOrDefault(a.getPriority(), 2);
            int pB = pMap.getOrDefault(b.getPriority(), 2);
            if (pA != pB) return pA - pB;
            return a.getScheduledDate().compareTo(b.getScheduledDate());
        });

        // Shift them intelligently: 3 topics max per recovery day to avoid overload
        LocalDate resumeDate = LocalDate.now().plusDays(1);
        for (int i = 0; i < overdueTasks.size(); i++) {
            Task t = overdueTasks.get(i);
            
            // Adjust duration based on remaining work (for mission-based tasks)
            double effortRemaining = 1.0;
            if (t.getVideoCompleted()) effortRemaining -= 0.4;
            if (t.getNotesCompleted()) effortRemaining -= 0.3;
            if (t.getMcqCompleted())   effortRemaining -= 0.2;
            if (t.getPyqCompleted())   effortRemaining -= 0.1;
            
            if (effortRemaining < 0.1) effortRemaining = 0.1;
            
            BigDecimal originalDuration = t.getDurationHours() != null ? t.getDurationHours() : BigDecimal.ONE;
            t.setDurationHours(originalDuration.multiply(BigDecimal.valueOf(effortRemaining)));
            
            t.setIsBacklog(true);
            t.setIsRescheduled(true); // Tag it for UI
            if (t.getOriginalDate() == null) t.setOriginalDate(t.getScheduledDate());
            t.setScheduledDate(resumeDate.plusDays(i / 3)); 
            taskRepository.save(t);
        }

        return overdueTasks.stream().map(this::mapTask).collect(Collectors.toList());
    }

    /* ─── Mapper ───────────────────────────────────────────────────── */

    private Map<String, Object> mapTask(Task task) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", task.getId());
        // Study-plan task fields
        map.put("topicName",    task.getTopic()   != null ? task.getTopic().getTitle()   : task.getTitle());
        map.put("subjectName",  task.getTopic()   != null && task.getTopic().getSubject() != null
                ? task.getTopic().getSubject().getName() : task.getSubjectName());
        map.put("scheduledDate",  task.getScheduledDate());
        map.put("durationHours",  task.getDurationHours());
        map.put("status",         task.getStatus());
        map.put("isBacklog",      task.getIsBacklog());
        map.put("isRevision",     task.getIsRevision());
        map.put("revisionLevel",  task.getRevisionLevel());
        map.put("originalDate",   task.getOriginalDate());
        map.put("completedAt",    task.getCompletedAt());
        // Custom task fields
        map.put("title",         task.getTitle());
        map.put("priority",      task.getPriority() != null ? task.getPriority() : "MEDIUM");
        map.put("deadline",      task.getDeadline());
        map.put("notes",         task.getNotes());
        map.put("isCustomTask",  task.getIsCustomTask());
        
        // Granular Progress
        map.put("videoCompleted", task.getVideoCompleted());
        map.put("notesCompleted", task.getNotesCompleted());
        map.put("mcqCompleted",   task.getMcqCompleted());
        map.put("pyqCompleted",   task.getPyqCompleted());

        // Topic Metadata
        if (task.getTopic() != null) {
            map.put("topicDifficulty", task.getTopic().getDifficulty());
            map.put("youtubeVideoUrl", task.getTopic().getYoutubeVideoUrl());
            map.put("hasMcqs", task.getTopic().getHasMcqs());
            map.put("hasPyqs", task.getTopic().getHasPyqs());
        }
        
        return map;
    }
}

