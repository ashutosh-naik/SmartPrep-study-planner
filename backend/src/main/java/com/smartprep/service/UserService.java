package com.smartprep.service;

import com.smartprep.model.User;
import com.smartprep.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User getProfile(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }

    @Transactional
    public User updateProfile(String email, User updatedData) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        if (updatedData.getName() != null) user.setName(updatedData.getName());
        if (updatedData.getCourse() != null) user.setCourse(updatedData.getCourse());
        if (updatedData.getYear() != null) user.setYear(updatedData.getYear());
        if (updatedData.getExamType() != null) user.setExamType(updatedData.getExamType());
        if (updatedData.getExamDate() != null) user.setExamDate(updatedData.getExamDate());
        if (updatedData.getUniversity() != null) user.setUniversity(updatedData.getUniversity());
        if (updatedData.getStudyHoursPerDay() != null) user.setStudyHoursPerDay(updatedData.getStudyHoursPerDay());
        if (updatedData.getPreferredStudyTime() != null) user.setPreferredStudyTime(updatedData.getPreferredStudyTime());
        if (updatedData.getBreakDuration() != null) user.setBreakDuration(updatedData.getBreakDuration());

        return userRepository.save(user);
    }
}
