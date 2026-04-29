package com.smartprep.service;

import com.smartprep.model.Topic;
import com.smartprep.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TopicService {

    private final TopicRepository topicRepository;

    public List<Topic> getTopicsBySubjectId(UUID subjectId) {
        return topicRepository.findBySubjectId(subjectId);
    }

    public Topic getTopicById(UUID id) {
        return topicRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Topic not found"));
    }

    public Topic createTopic(Topic topic) {
        return topicRepository.save(topic);
    }
}
