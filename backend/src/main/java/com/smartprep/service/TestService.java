package com.smartprep.service;

import com.smartprep.model.Test;
import com.smartprep.model.User;
import com.smartprep.model.Result;
import com.smartprep.repository.TestRepository;
import com.smartprep.repository.ResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TestService {

    private final TestRepository testRepository;
    private final ResultRepository resultRepository;

    public List<Test> getAllTests() {
        return testRepository.findAll();
    }

    public List<Test> getTestsBySubjectId(UUID subjectId) {
        return testRepository.findBySubjectId(subjectId);
    }

    public Test getTestById(UUID id) {
        return testRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Test not found"));
    }

    public Test createTest(Test test) {
        return testRepository.save(test);
    }

    public Result submitTest(User user, UUID testId, Integer score) {
        Test test = getTestById(testId);
        Result result = Result.builder()
                .user(user)
                .test(test)
                .score(score)
                .build();
        return resultRepository.save(result);
    }
}
