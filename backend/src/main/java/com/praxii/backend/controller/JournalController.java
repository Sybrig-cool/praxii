package com.praxii.backend.controller;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.praxii.backend.dto.JournalRequest;
import com.praxii.backend.dto.JournalResponse;
import com.praxii.backend.model.Journal;
import com.praxii.backend.model.User;
import com.praxii.backend.repository.JournalRepository;
import com.praxii.backend.repository.UserRepository;


@RestController
@RequestMapping("/api/journal")
public class JournalController {
    @Autowired
    private JournalRepository journalRepository;
    @Autowired
    private UserRepository userRepository;
    private static final Logger log = LoggerFactory.getLogger(JournalController.class);

    // Create new journal entry
   @PostMapping
    public ResponseEntity<?> createJournal(@RequestBody JournalRequest request, Principal principal) {
        log.info("Entered createJournal endpoint");
    // Find the user by username
    User user = userRepository.findByUsername(principal.getName())
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

    // Create a new journal entry and associate with userId
    Journal journal = new Journal();
    journal.setUserId(user.getId());
    journal.setContent(request.getContent());
    journal.setCreatedAt(LocalDateTime.now());

        journalRepository.save(journal);
        log.info("Saved journal for user: {} {} at {}", user.getId(), user.getUsername(), journal.getCreatedAt());

    return ResponseEntity.ok("Journal saved");
}


    // Get all journals for current user
    @GetMapping
    public ResponseEntity<List<JournalResponse>> getJournals(Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        List<Journal> journals = journalRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        List<JournalResponse> response = journals.stream()
                .map(j -> new JournalResponse(j.getId(), j.getContent(), j.getCreatedAt()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
}
