package com.smartprep.service;

import com.smartprep.exception.ResourceNotFoundException;
import com.smartprep.model.StudyPlan;
import com.smartprep.model.Subject;
import com.smartprep.model.Task;
import com.smartprep.model.Topic;
import com.smartprep.repository.QuestionPaperRepository;
import com.smartprep.repository.StudyPlanRepository;
import com.smartprep.repository.TaskRepository;
import com.smartprep.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StudyPlanService {

    private final StudyPlanRepository studyPlanRepository;
    private final TaskRepository taskRepository;
    private final TopicRepository topicRepository;
    private final QuestionPaperRepository questionPaperRepository;

    public List<StudyPlan> getStudyPlansByUserId(UUID userId) {
        return studyPlanRepository.findByUserId(userId);
    }

    public StudyPlan getStudyPlanById(UUID id) {
        return studyPlanRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Study Plan not found"));
    }

    public StudyPlan createStudyPlan(StudyPlan studyPlan) {
        return studyPlanRepository.save(studyPlan);
    }

    @Transactional
    public void generateAdaptivePlan(UUID planId, LocalDate examDate, double hoursPerDay) {
        StudyPlan plan = studyPlanRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("Study plan not found"));

        List<Topic> allTopics = topicRepository.findBySubjectStudyPlanId(planId);
        
        // Sort topics by "Importance" (Frequency in PYQs)
        allTopics.sort((t1, t2) -> {
            int w1 = questionPaperRepository.findBySubjectNameContainingIgnoreCase(t1.getTitle()).size();
            int w2 = questionPaperRepository.findBySubjectNameContainingIgnoreCase(t2.getTitle()).size();
            return Integer.compare(w2, w1); // High frequency first
        });
        
        if (allTopics.isEmpty()) return;

        LocalDate startDate = LocalDate.now();
        long totalDays = ChronoUnit.DAYS.between(startDate, examDate);
        
        if (totalDays <= 0) return;

        // Calculate distribution
        int topicsPerDay = (int) Math.ceil((double) allTopics.size() / (totalDays * 0.7)); // Reserve 30% for revisions
        
        for (int i = 0; i < allTopics.size(); i++) {
            Topic topic = allTopics.get(i);
            LocalDate scheduledDate = startDate.plusDays(i / topicsPerDay);
            
            if (scheduledDate.isAfter(examDate.minusDays(7))) {
                scheduledDate = examDate.minusDays(7); // Ensure core study finishes before final week
            }

            Task task = Task.builder()
                .user(plan.getUser())
                .studyPlan(plan)
                .topic(topic)
                .scheduledDate(scheduledDate)
                .durationHours(BigDecimal.valueOf(2.0))
                .status("pending")
                .isRevision(false)
                .revisionLevel(0)
                .isCustomTask(false)
                .build();
            
            taskRepository.save(task);
            
            // Schedule Revisions
            scheduleRevision(task, scheduledDate.plusDays(3), 1, examDate);
            scheduleRevision(task, scheduledDate.plusDays(10), 2, examDate);
            scheduleRevision(task, examDate.minusDays(2), 3, examDate);
        }
    }

    private void scheduleRevision(Task originalTask, LocalDate revisionDate, int level, LocalDate examDate) {
        if (revisionDate.isAfter(examDate) || revisionDate.isBefore(originalTask.getScheduledDate().plusDays(1))) return;
        
        Task revision = Task.builder()
            .user(originalTask.getUser())
            .studyPlan(originalTask.getStudyPlan())
            .topic(originalTask.getTopic())
            .scheduledDate(revisionDate)
            .durationHours(BigDecimal.valueOf(1.0))
            .status("pending")
            .isRevision(true)
            .revisionLevel(level)
            .isCustomTask(false)
            .build();
        
        taskRepository.save(revision);
    }
}
