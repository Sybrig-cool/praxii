package com.praxii.backend.repository;

import com.praxii.backend.model.Dream;
import com.praxii.backend.model.DreamType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DreamRepository extends MongoRepository<Dream, String> {
    
    List<Dream> findByUserId(String userId, Sort sort);
    
    List<Dream> findByUserIdAndDreamType(String userId, DreamType dreamType, Sort sort);
    
    List<Dream> findByUserIdAndDreamDateBetween(String userId, LocalDate startDate, LocalDate endDate, Sort sort);
    
    List<Dream> findByUserIdAndTitleContainingIgnoreCase(String userId, String title, Sort sort);
    
    Optional<Dream> findByIdAndUserId(String id, String userId);
    
    void deleteByIdAndUserId(String id, String userId);
    
    long countByUserId(String userId);
}