package com.smartprep.service;

import com.smartprep.model.Course;
import com.smartprep.model.Paper;
import com.smartprep.model.University;
import com.smartprep.repository.CourseRepository;
import com.smartprep.repository.PaperRepository;
import com.smartprep.repository.UniversityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PYQService {

    private final PaperRepository paperRepository;
    private final UniversityRepository universityRepository;
    private final CourseRepository courseRepository;
    private final PaperScraperService scraperService;

    public List<University> getAllUniversities() {
        return universityRepository.findAll();
    }

    public List<Course> getCoursesByUniversity(String uniShortName) {
        University university = universityRepository.findByShortName(uniShortName)
                .orElseThrow(() -> new RuntimeException("University not found"));
        return courseRepository.findByUniversity(university);
    }

    public List<Paper> getPapers(String university, String course, Integer year) {
        log.info("Fetching papers for {} - {} - {}", university, course, year);
        
        // Ensure synchronization happens for SPPU
        if ("SPPU".equalsIgnoreCase(university) && year != null) {
            scraperService.scrapeSPPU(course, year);
        }
        
        List<Paper> results;
        if (year != null && year > 0) {
            results = paperRepository.findByUniversityAndCourseAndYear(university, course, year);
        } else {
            results = paperRepository.findByUniversityAndCourse(university, course);
        }
        
        log.info("Found {} papers in database", results.size());
        return results;
    }
}
