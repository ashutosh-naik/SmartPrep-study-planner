package com.smartprep.repository;

import com.smartprep.model.Course;
import com.smartprep.model.University;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CourseRepository extends JpaRepository<Course, UUID> {
    List<Course> findByUniversity(University university);
}
