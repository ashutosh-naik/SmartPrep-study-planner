package com.smartprep.repository;

import com.smartprep.model.CustomTask;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface CustomTaskRepository extends JpaRepository<CustomTask, UUID> {
    List<CustomTask> findByUserEmailOrderByCreatedAtDesc(String email);
}
