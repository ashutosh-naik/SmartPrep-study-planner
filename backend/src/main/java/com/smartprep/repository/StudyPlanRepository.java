package com.smartprep.repository;

import com.smartprep.model.StudyPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

import java.util.Optional;

@Repository
public interface StudyPlanRepository extends JpaRepository<StudyPlan, UUID> {
    List<StudyPlan> findByUserId(UUID userId);
    Optional<StudyPlan> findTopByUserIdOrderByCreatedAtDesc(UUID userId);
}
