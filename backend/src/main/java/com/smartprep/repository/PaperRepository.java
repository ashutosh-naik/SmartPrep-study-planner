package com.smartprep.repository;

import com.smartprep.model.Paper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaperRepository extends JpaRepository<Paper, UUID> {
    List<Paper> findByUniversityAndCourse(String university, String course);
    List<Paper> findByUniversityAndCourseAndYear(String university, String course, int year);
    Optional<Paper> findByPdfUrl(String pdfUrl);
}
