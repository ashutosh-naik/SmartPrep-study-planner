package com.smartprep.service;

import com.smartprep.model.Subject;
import com.smartprep.repository.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SubjectService {

    private final SubjectRepository subjectRepository;

    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    public Subject getSubjectById(UUID id) {
        return subjectRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Subject not found"));
    }

    public Subject createSubject(Subject subject) {
        return subjectRepository.save(subject);
    }
}
