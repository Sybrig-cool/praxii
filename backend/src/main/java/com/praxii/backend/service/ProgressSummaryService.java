package com.praxii.backend.service;

import com.praxii.backend.model.ProgressSummary;
import com.praxii.backend.repository.ProgressSummaryRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProgressSummaryService {
    private final ProgressSummaryRepository repository;

    public ProgressSummaryService(ProgressSummaryRepository repository) {
        this.repository = repository;
    }

    public ProgressSummary getOrCreateProgress(String userEmail) {
        return repository.findByUserEmail(userEmail)
                .orElseGet(() -> {
                    ProgressSummary summary = new ProgressSummary();
                    summary.setUserEmail(userEmail);
                    summary.setDaysAbstinent(0);
                    summary.setMeditationStreak(0);
                    summary.setDreamFrequency(0);
                    summary.setEgoDetection(0);
                    return repository.save(summary);
                });
    }
}
