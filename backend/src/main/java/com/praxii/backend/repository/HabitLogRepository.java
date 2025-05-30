package com.praxii.backend.repository;

import com.praxii.backend.model.HabitLog;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface HabitLogRepository extends MongoRepository<HabitLog, String> {
    Optional<HabitLog> findByUserEmailAndDate(String email, LocalDate date);
}
