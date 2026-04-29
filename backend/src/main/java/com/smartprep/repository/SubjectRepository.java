package com.smartprep.repository;

import com.smartprep.model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, UUID> {

    List<Subject> findByStudyPlanId(UUID planId);

    @Query("SELECT s FROM Subject s WHERE s.studyPlan.user.email = :email ORDER BY s.name")
    List<Subject> findByUserEmail(@Param("email") String email);

    List<Subject> findByStudyPlanUserId(UUID userId);
}
