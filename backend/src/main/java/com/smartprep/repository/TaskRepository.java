package com.smartprep.repository;

import com.smartprep.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByStudyPlanIdAndScheduledDate(UUID studyPlanId, LocalDate date);

    List<Task> findByStudyPlanIdAndScheduledDateBetween(UUID studyPlanId, LocalDate startDate, LocalDate endDate);

    List<Task> findByStudyPlanId(UUID studyPlanId);

    List<Task> findByStudyPlanIdAndStatus(UUID studyPlanId, String status);

    List<Task> findByStudyPlanIdAndIsBacklogTrue(UUID studyPlanId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.studyPlan.id = :planId")
    long countByStudyPlanId(@Param("planId") UUID planId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.studyPlan.id = :planId AND t.status = :status")
    long countByStudyPlanIdAndStatus(@Param("planId") UUID planId, @Param("status") String status);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.studyPlan.id = :planId AND t.isBacklog = :isBacklog")
    long countByStudyPlanIdAndIsBacklog(@Param("planId") UUID planId, @Param("isBacklog") boolean isBacklog);

    /* ── Custom (personal) task queries ── */

    @Query("SELECT t FROM Task t WHERE t.user.id = :userId AND t.isCustomTask = true ORDER BY " +
           "CASE t.priority WHEN 'HIGH' THEN 1 WHEN 'MEDIUM' THEN 2 ELSE 3 END, t.deadline ASC NULLS LAST")
    List<Task> findCustomTasksByUserId(@Param("userId") UUID userId);

    @Query("SELECT t FROM Task t WHERE t.user.id = :userId AND t.isCustomTask = true AND t.scheduledDate = :date " +
           "ORDER BY CASE t.priority WHEN 'HIGH' THEN 1 WHEN 'MEDIUM' THEN 2 ELSE 3 END")
    List<Task> findCustomTasksByUserIdAndDate(@Param("userId") UUID userId, @Param("date") LocalDate date);

    @Query("SELECT t FROM Task t WHERE t.user.id = :userId AND t.isCustomTask = true " +
           "AND t.status = 'pending' AND t.deadline IS NOT NULL AND t.deadline < :now")
    List<Task> findOverdueCustomTasks(@Param("userId") UUID userId, @Param("now") LocalDateTime now);
}
