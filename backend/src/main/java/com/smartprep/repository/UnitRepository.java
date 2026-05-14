package com.smartprep.repository;

import com.smartprep.model.Unit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UnitRepository extends JpaRepository<Unit, UUID> {
    List<Unit> findBySubjectId(UUID subjectId);
}
