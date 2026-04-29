package com.smartprep.service;

import com.smartprep.model.FlashcardResult;
import com.smartprep.model.User;
import com.smartprep.repository.FlashcardResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FlashcardResultService {
    private final FlashcardResultRepository repository;

    public FlashcardResult saveResult(User user, String subject, Integer total, Integer mastered) {
        FlashcardResult result = FlashcardResult.builder()
                .user(user)
                .subject(subject)
                .totalCards(total)
                .masteredCards(mastered)
                .build();
        return repository.save(result);
    }

    public List<FlashcardResult> getUserResults(UUID userId) {
        return repository.findByUserIdOrderByCompletedAtDesc(userId);
    }
}
