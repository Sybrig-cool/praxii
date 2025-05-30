package com.praxii.backend.controller;

import com.praxii.backend.model.JournalEntry;
import com.praxii.backend.repository.JournalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/journal")
@CrossOrigin
public class JournalController {

    @Autowired
    private JournalRepository journalRepository;

    @GetMapping
    public List<JournalEntry> getUserJournals(Authentication auth) {
        return journalRepository.findByUserEmail(auth.getName());
    }

    @PostMapping
    public JournalEntry createJournal(@RequestBody JournalEntry entry, Authentication auth) {
        entry.setUserEmail(auth.getName());
        return journalRepository.save(entry);
    }
}
