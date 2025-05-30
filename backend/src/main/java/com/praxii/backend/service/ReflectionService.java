package com.praxii.backend.service;

import com.praxii.backend.model.Reflection;
import com.praxii.backend.repository.ReflectionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReflectionService {

    private final ReflectionRepository repository;

    public Reflection saveReflection(String userId, String mood, String thoughts) {
        String aiResponse = generateAIReflection(mood, thoughts);

        Reflection reflection = Reflection.builder()
                .userId(userId)
                .date(LocalDateTime.now())
                .mood(mood)
                .thoughts(thoughts)
                .aiReflection(aiResponse)
                .createdAt(LocalDateTime.now())
                .build();

        return repository.save(reflection);
    }

    public List<Reflection> getUserReflections(String userId) {
        return repository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    private String generateAIReflection(String mood, String thoughts) {
        // Simulated AI logic – replace with real OpenAI call later
        return "Today, based on your mood '" + mood + "', it seems you're reflecting on: \"" + thoughts + "\". Stay grounded.";
    }
}
