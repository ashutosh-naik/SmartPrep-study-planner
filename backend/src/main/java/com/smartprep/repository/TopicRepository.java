package com.smartprep.repository;

import com.smartprep.model.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TopicRepository extends JpaRepository<Topic, UUID> {
    List<Topic> findByUnitId(UUID unitId);
    List<Topic> findByUnitSubjectId(UUID subjectId);
    List<Topic> findByUnitSubjectStudyPlanId(UUID planId);
}
