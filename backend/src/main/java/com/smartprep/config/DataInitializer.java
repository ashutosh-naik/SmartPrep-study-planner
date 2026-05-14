package com.smartprep.config;

import com.smartprep.model.Course;
import com.smartprep.model.University;
import com.smartprep.repository.CourseRepository;
import com.smartprep.repository.UniversityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

@Configuration
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UniversityRepository universityRepository;
    private final CourseRepository courseRepository;

    @Override
    public void run(String... args) throws Exception {
        if (universityRepository.count() == 0) {
            University sppu = University.builder()
                    .name("Savitribai Phule Pune University")
                    .shortName("SPPU")
                    .website("https://unipune.ac.in/")
                    .location("Pune, Maharashtra")
                    .color("#7c2d12") // Brownish
                    .build();

            University mu = University.builder()
                    .name("University of Mumbai")
                    .shortName("MU")
                    .website("https://mu.ac.in/")
                    .location("Mumbai, Maharashtra")
                    .color("#1e40af") // Blue
                    .build();

            universityRepository.saveAll(Arrays.asList(sppu, mu));

            // Courses for SPPU
            Course mca = Course.builder().name("Master of Computer Applications").shortName("MCA").university(sppu).build();
            Course mba = Course.builder().name("Master of Business Administration").shortName("MBA").university(sppu).build();
            Course mbait = Course.builder().name("MBA Information Technology").shortName("MBA IT").university(sppu).build();
            Course mbahrd = Course.builder().name("MBA Human Resource Development").shortName("MBA HRD").university(sppu).build();

            courseRepository.saveAll(Arrays.asList(mca, mba, mbait, mbahrd));
        }
    }
}
