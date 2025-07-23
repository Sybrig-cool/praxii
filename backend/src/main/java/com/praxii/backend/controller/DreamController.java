package com.praxii.backend.controller;

import com.praxii.backend.dto.DreamRequest;
import com.praxii.backend.dto.DreamResponse;
import com.praxii.backend.model.Dream;
import com.praxii.backend.model.DreamType;
import com.praxii.backend.repository.DreamRepository;
import com.praxii.backend.security.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dreams")
@CrossOrigin(origins = "http://localhost:4200")
public class DreamController {

    private static final Logger logger = LoggerFactory.getLogger(DreamController.class);

    @Autowired
    private DreamRepository dreamRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<?> createDream(@Valid @RequestBody DreamRequest dreamRequest, @RequestHeader("Authorization") String token) {
        try {
            logger.info("Entered createDream endpoint");
            
            String jwt = token.substring(7);
            String userId = jwtUtil.extractUserId(jwt);
            
            Dream dream = new Dream(
                userId,
                dreamRequest.getDreamDate(),
                dreamRequest.getTitle(),
                dreamRequest.getDescription(),
                dreamRequest.getDreamType()
            );
            
            Dream savedDream = dreamRepository.save(dream);
            logger.info("Saved dream for user: {} with title: {} at {}", userId, savedDream.getTitle(), savedDream.getCreatedAt());
            
            return ResponseEntity.ok(convertToResponse(savedDream));
        } catch (Exception e) {
            logger.error("Error creating dream: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create dream entry");
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllDreams(@RequestHeader("Authorization") String token,
                                         @RequestParam(required = false) String dreamType,
                                         @RequestParam(required = false) String startDate,
                                         @RequestParam(required = false) String endDate,
                                         @RequestParam(required = false) String search) {
        try {
            String jwt = token.substring(7);
            String userId = jwtUtil.extractUserId(jwt);
            
            Sort sort = Sort.by(Sort.Direction.DESC, "dreamDate", "createdAt");
            List<Dream> dreams;
            
            if (dreamType != null && !dreamType.isEmpty()) {
                DreamType type = DreamType.valueOf(dreamType.toUpperCase());
                dreams = dreamRepository.findByUserIdAndDreamType(userId, type, sort);
            } else if (startDate != null && endDate != null) {
                LocalDate start = LocalDate.parse(startDate);
                LocalDate end = LocalDate.parse(endDate);
                dreams = dreamRepository.findByUserIdAndDreamDateBetween(userId, start, end, sort);
            } else if (search != null && !search.isEmpty()) {
                dreams = dreamRepository.findByUserIdAndTitleContainingIgnoreCase(userId, search, sort);
            } else {
                dreams = dreamRepository.findByUserId(userId, sort);
            }
            
            List<DreamResponse> responses = dreams.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
            
            logger.info("Retrieved {} dreams for user: {}", responses.size(), userId);
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            logger.error("Error retrieving dreams: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to retrieve dreams");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDreamById(@PathVariable String id, @RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String userId = jwtUtil.extractUserId(jwt);
            
            Optional<Dream> dreamOpt = dreamRepository.findByIdAndUserId(id, userId);
            if (dreamOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            return ResponseEntity.ok(convertToResponse(dreamOpt.get()));
        } catch (Exception e) {
            logger.error("Error retrieving dream by id: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to retrieve dream");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDream(@PathVariable String id, 
                                        @Valid @RequestBody DreamRequest dreamRequest, 
                                        @RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String userId = jwtUtil.extractUserId(jwt);
            
            Optional<Dream> dreamOpt = dreamRepository.findByIdAndUserId(id, userId);
            if (dreamOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Dream dream = dreamOpt.get();
            dream.setDreamDate(dreamRequest.getDreamDate());
            dream.setTitle(dreamRequest.getTitle());
            dream.setDescription(dreamRequest.getDescription());
            dream.setDreamType(dreamRequest.getDreamType());
            dream.setUpdatedAt(Instant.now());
            
            Dream updatedDream = dreamRepository.save(dream);
            logger.info("Updated dream for user: {} with id: {}", userId, id);
            
            return ResponseEntity.ok(convertToResponse(updatedDream));
        } catch (Exception e) {
            logger.error("Error updating dream: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update dream");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDream(@PathVariable String id, @RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String userId = jwtUtil.extractUserId(jwt);
            
            Optional<Dream> dreamOpt = dreamRepository.findByIdAndUserId(id, userId);
            if (dreamOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            dreamRepository.deleteByIdAndUserId(id, userId);
            logger.info("Deleted dream for user: {} with id: {}", userId, id);
            
            return ResponseEntity.ok("Dream deleted successfully");
        } catch (Exception e) {
            logger.error("Error deleting dream: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete dream");
        }
    }

    @GetMapping("/types")
    public ResponseEntity<?> getDreamTypes() {
        try {
            return ResponseEntity.ok(DreamType.values());
        } catch (Exception e) {
            logger.error("Error retrieving dream types: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to retrieve dream types");
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getDreamStats(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String userId = jwtUtil.extractUserId(jwt);
            
            long totalDreams = dreamRepository.countByUserId(userId);
            
            return ResponseEntity.ok(new DreamStats(totalDreams));
        } catch (Exception e) {
            logger.error("Error retrieving dream stats: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to retrieve dream statistics");
        }
    }

    private DreamResponse convertToResponse(Dream dream) {
        DreamResponse response = new DreamResponse();
        response.setId(dream.getId());
        response.setDreamDate(dream.getDreamDate());
        response.setTitle(dream.getTitle());
        response.setDescription(dream.getDescription());
        response.setDreamType(dream.getDreamType());
        response.setDreamTypeDisplayName(dream.getDreamType().getDisplayName());
        response.setCreatedAt(dream.getCreatedAt());
        response.setUpdatedAt(dream.getUpdatedAt());
        return response;
    }

    public static class DreamStats {
        private long totalDreams;

        public DreamStats(long totalDreams) {
            this.totalDreams = totalDreams;
        }

        public long getTotalDreams() {
            return totalDreams;
        }

        public void setTotalDreams(long totalDreams) {
            this.totalDreams = totalDreams;
        }
    }
}