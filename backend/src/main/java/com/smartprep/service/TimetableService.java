package com.smartprep.service;

import com.smartprep.model.TimetableSlot;
import com.smartprep.model.User;
import com.smartprep.repository.TimetableRepository;
import com.smartprep.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class TimetableService {

    private final TimetableRepository timetableRepository;
    private final UserRepository userRepository;

    public List<TimetableSlot> getSlots(String email) {
        return timetableRepository.findByUserEmail(email);
    }

    public TimetableSlot createSlot(String email, Map<String, Object> body) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Integer dayOfWeek = body.get("dayOfWeek") instanceof Integer
                ? (Integer) body.get("dayOfWeek")
                : Integer.parseInt(String.valueOf(body.get("dayOfWeek")));

        TimetableSlot slot = TimetableSlot.builder()
                .user(user)
                .dayOfWeek(dayOfWeek)
                .startTime(String.valueOf(body.get("startTime")))
                .endTime(String.valueOf(body.get("endTime")))
                .subjectName(String.valueOf(body.get("subjectName")))
                .label(body.get("label") != null ? String.valueOf(body.get("label")) : "")
                .color(body.getOrDefault("color", "#6366f1") != null
                        ? String.valueOf(body.get("color")) : "#6366f1")
                .build();

        return timetableRepository.save(slot);
    }

    public void deleteSlot(String email, UUID id) {
        TimetableSlot slot = timetableRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Slot not found"));
        if (!slot.getUser().getEmail().equals(email)) {
            throw new IllegalArgumentException("Access denied");
        }
        timetableRepository.delete(slot);
    }
}
