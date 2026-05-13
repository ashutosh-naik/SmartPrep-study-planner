package com.smartprep.repository;

import com.smartprep.model.University;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UniversityRepository extends JpaRepository<University, UUID> {
    University findByName(String name);
}
