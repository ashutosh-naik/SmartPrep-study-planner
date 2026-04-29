package com.smartprep.repository;

import com.smartprep.model.Test;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TestRepository extends JpaRepository<Test, UUID> {
    List<Test> findBySubjectId(UUID subjectId);
}
