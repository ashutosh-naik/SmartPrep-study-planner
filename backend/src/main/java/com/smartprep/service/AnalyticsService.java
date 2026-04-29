package com.smartprep.service;

import com.smartprep.model.*;
import com.smartprep.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final TaskRepository taskRepository;
    private final ResultRepository resultRepository;
    private final StudyPlanRepository studyPlanRepository;
    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;

    public Map<String, Object> getDashboardData(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        StudyPlan plan = studyPlanRepository.findTopByUserIdOrderByCreatedAtDesc(user.getId())
                .orElse(null);

        Map<String, Object> data = new HashMap<>();
        
        // Progress Metrics
        long totalTasks = plan != null ? taskRepository.countByStudyPlanId(plan.getId()) : 0;
        long completedTasks = plan != null ? taskRepository.countByStudyPlanIdAndStatus(plan.getId(), "completed") : 0;
        double progress = totalTasks > 0 ? (completedTasks * 100.0 / totalTasks) : 0.0;

        // Days to Exam
        long daysToExam = 0;
        if (user.getExamDate() != null) {
            daysToExam = ChronoUnit.DAYS.between(LocalDate.now(), user.getExamDate());
        }

        // Study Hours Today
        BigDecimal hoursToday = BigDecimal.ZERO;
        if (plan != null) {
            hoursToday = taskRepository.findByStudyPlanIdAndScheduledDate(plan.getId(), LocalDate.now())
                .stream()
                .filter(t -> "completed".equals(t.getStatus()))
                .map(t -> t.getDurationHours() != null ? t.getDurationHours() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        }

        // Backlog
        long backlogCount = plan != null ? taskRepository.countByStudyPlanIdAndIsBacklog(plan.getId(), true) : 0;

        // Readiness Score (Weighted: 40% Progress + 60% Avg Score)
        List<Result> results = resultRepository.findByUserId(user.getId());
        double avgScore = results.stream().mapToInt(Result::getScore).average().orElse(0.0);
        double readiness = (progress * 0.4) + (avgScore * 0.6);

        data.put("overallProgress", Math.round(progress));
        data.put("daysToExam", Math.max(0, daysToExam));
        data.put("studyHoursToday", hoursToday);
        data.put("backlogCount", backlogCount);
        data.put("readinessScore", Math.round(readiness));
        data.put("topicsCovered", completedTasks);
        data.put("totalTopics", totalTasks);
        
        return data;
    }

    public Map<String, Object> getPerformanceData(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<Result> results = resultRepository.findByUserId(user.getId());
        
        double avgScore = results.stream().mapToInt(Result::getScore).average().orElse(0.0);
        int bestScore = results.stream().mapToInt(Result::getScore).max().orElse(0);
        
        // Trends
        List<Map<String, Object>> scoreTrends = results.stream()
                .sorted(Comparator.comparing(Result::getCompletedAt))
                .map(r -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("week", "W" + (results.indexOf(r) + 1));
                    m.put("score", r.getScore());
                    return m;
                })
                .collect(Collectors.toList());

        // Subject Scores (Radar Chart)
        List<Subject> subjects = subjectRepository.findByStudyPlanUserId(user.getId());
        List<Map<String, Object>> subjectScores = subjects.stream().map(s -> {
            Map<String, Object> m = new HashMap<>();
            m.put("subject", s.getName());
            // Mocking logic for subject score until we have specific results per subject
            m.put("score", 60 + new Random().nextInt(35)); 
            return m;
        }).collect(Collectors.toList());

        Map<String, Object> data = new HashMap<>();
        data.put("avgScore", Math.round(avgScore));
        data.put("bestScore", bestScore);
        data.put("improvement", 12); // Mock for now
        data.put("examReadyPercentage", 82); // Mock for now
        data.put("scoreTrends", scoreTrends);
        data.put("subjectScores", subjectScores);

        return data;
    }
}
