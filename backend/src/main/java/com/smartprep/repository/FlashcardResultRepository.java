package com.smartprep.repository;

import com.smartprep.model.FlashcardResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FlashcardResultRepository extends JpaRepository<FlashcardResult, UUID> {
    List<FlashcardResult> findByUserIdOrderByCompletedAtDesc(UUID userId);
}
