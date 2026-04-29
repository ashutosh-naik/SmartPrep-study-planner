package com.smartprep.service;

import com.smartprep.model.StudyPlan;
import com.smartprep.repository.StudyPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StudyPlanService {

    private final StudyPlanRepository studyPlanRepository;

    public List<StudyPlan> getStudyPlansByUserId(UUID userId) {
        return studyPlanRepository.findByUserId(userId);
    }

    public StudyPlan getStudyPlanById(UUID id) {
        return studyPlanRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Study Plan not found"));
    }

    public StudyPlan createStudyPlan(StudyPlan studyPlan) {
        return studyPlanRepository.save(studyPlan);
    }
}
