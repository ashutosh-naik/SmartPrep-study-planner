package com.smartprep.service;

import com.smartprep.exception.ResourceNotFoundException;
import com.smartprep.model.StudyPlan;
import com.smartprep.model.Task;
import com.smartprep.model.Topic;
import com.smartprep.repository.StudyPlanRepository;
import com.smartprep.repository.TaskRepository;
import com.smartprep.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StudyPlanService {

    private final StudyPlanRepository studyPlanRepository;
    private final TaskRepository taskRepository;
    private final TopicRepository topicRepository;

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

        // Clear existing tasks for fresh generation
        taskRepository.deleteByStudyPlanId(planId);

        List<Topic> allTopics = topicRepository.findByUnitSubjectStudyPlanId(planId);
        if (allTopics.isEmpty()) return;

        LocalDate startDate = LocalDate.now();
        LocalDate cutoffDate = examDate.minusDays(7); // Reserve last week for final review
        
        long daysAvailable = ChronoUnit.DAYS.between(startDate, cutoffDate);
        if (daysAvailable <= 0) {
            cutoffDate = examDate.minusDays(1);
        }

        LocalDate currentDate = startDate;
        double remainingHoursToday = hoursPerDay;

        for (Topic topic : allTopics) {
            double topicHours = topic.getEstimatedHours() != null ? topic.getEstimatedHours().doubleValue() : 2.0;

            // If a topic is very long or doesn't fit in remaining time, move to next day
            if (topicHours > remainingHoursToday && remainingHoursToday < hoursPerDay * 0.4) {
                currentDate = currentDate.plusDays(1);
                remainingHoursToday = hoursPerDay;
            }

            // Cap the date at cutoff
            if (currentDate.isAfter(cutoffDate)) {
                currentDate = cutoffDate;
            }

            Task task = Task.builder()
                .user(plan.getUser())
                .studyPlan(plan)
                .topic(topic)
                .scheduledDate(currentDate)
                .durationHours(BigDecimal.valueOf(topicHours))
                .status("pending")
                .isRevision(false)
                .revisionLevel(0)
                .videoCompleted(false)
                .notesCompleted(false)
                .mcqCompleted(false)
                .pyqCompleted(false)
                .isCustomTask(false)
                .build();
            
            taskRepository.save(task);
            remainingHoursToday -= topicHours;

            // Standard Spaced Repetition (R1 after 3 days, R2 after 10 days)
            scheduleRevision(task, currentDate.plusDays(3), 1, examDate);
            scheduleRevision(task, currentDate.plusDays(10), 2, examDate);
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
