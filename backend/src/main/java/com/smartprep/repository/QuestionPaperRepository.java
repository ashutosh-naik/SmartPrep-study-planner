package com.smartprep.repository;

import com.smartprep.model.QuestionPaper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface QuestionPaperRepository extends JpaRepository<QuestionPaper, UUID> {
    List<QuestionPaper> findByUniversityIdAndCourseAndSemester(UUID universityId, String course, Integer semester);
    List<QuestionPaper> findBySubjectNameContainingIgnoreCase(String subjectName);
}
