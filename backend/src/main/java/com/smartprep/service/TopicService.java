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
        // Automatic Resource Seeding Logic
        if (topic.getYoutubeVideoUrl() == null || topic.getYoutubeVideoUrl().isEmpty()) {
            String subjectName = "";
            if (topic.getUnit() != null && topic.getUnit().getSubject() != null) {
                subjectName = topic.getUnit().getSubject().getName();
            }
            
            String query = (topic.getName() + " " + subjectName + " Lecture").replace(" ", "+");
            topic.setYoutubeVideoUrl("https://www.youtube.com/results?search_query=" + query);
        }

        if (topic.getShortNotes() == null || topic.getShortNotes().isEmpty()) {
            topic.setShortNotes("Summary for " + topic.getName() + ": Focus on key concepts and university exam patterns. Check official syllabus for detailed theorems.");
        }

        return topicRepository.save(topic);
    }
}
