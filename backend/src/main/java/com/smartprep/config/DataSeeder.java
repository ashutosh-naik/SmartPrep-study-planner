package com.smartprep.config;

import com.smartprep.model.QuestionPaper;
import com.smartprep.model.University;
import com.smartprep.repository.QuestionPaperRepository;
import com.smartprep.repository.UniversityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UniversityRepository universityRepository;
    private final QuestionPaperRepository questionPaperRepository;

    @Override
    public void run(String... args) throws Exception {
        if (universityRepository.count() == 0) {
            University sppu = University.builder()
                    .name("Savitribai Phule Pune University (SPPU)")
                    .officialUrl("http://unipune.ac.in/")
                    .build();
            universityRepository.save(sppu);

            questionPaperRepository.save(QuestionPaper.builder()
                    .university(sppu)
                    .course("MCA")
                    .subjectName("Data Structures")
                    .year(2023)
                    .semester(1)
                    .downloadUrl("http://exam.unipune.ac.in/Pages/PreviousQuestionPapers.html")
                    .build());

            questionPaperRepository.save(QuestionPaper.builder()
                    .university(sppu)
                    .course("MCA")
                    .subjectName("Software Engineering")
                    .year(2023)
                    .semester(1)
                    .downloadUrl("http://exam.unipune.ac.in/Pages/PreviousQuestionPapers.html")
                    .build());
        }
    }
}
