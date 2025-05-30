package com.praxii.backend.repository;

import com.praxii.backend.model.JournalEntry;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface JournalRepository extends MongoRepository<JournalEntry, String> {
    List<JournalEntry> findByUserEmail(String email);
}
