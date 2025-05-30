package com.praxii.backend.repository;

import com.praxii.backend.model.ProgressSummary;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ProgressSummaryRepository extends MongoRepository<ProgressSummary, String> {
    Optional<ProgressSummary> findByUserEmail(String userEmail);
}
