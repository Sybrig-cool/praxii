package com.praxii.backend.repository;

import com.praxii.backend.model.Reflection;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ReflectionRepository extends MongoRepository<Reflection, String> {
    List<Reflection> findByUserIdOrderByCreatedAtDesc(String userId);
}
