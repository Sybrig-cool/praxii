package com.praxii.backend.repository;

import java.time.Instant;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.praxii.backend.model.Journal;

public interface JournalRepository extends MongoRepository<Journal, String> {
    List<Journal> findByUserIdOrderByCreatedAtDesc(String userId);
    List<Journal> findByUserIdAndCreatedAtBetweenOrderByCreatedAtDesc(String userId, Instant startDate, Instant endDate);
}
 