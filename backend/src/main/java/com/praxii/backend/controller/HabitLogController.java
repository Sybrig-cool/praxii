package com.praxii.backend.controller;

import com.praxii.backend.model.HabitLog;
import com.praxii.backend.repository.HabitLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Optional;

@RestController
@RequestMapping("/api/habits")
@CrossOrigin
public class HabitLogController {

    @Autowired
    private HabitLogRepository habitLogRepository;

    @GetMapping("/today")
    public Optional<HabitLog> getToday(Authentication auth) {
        return habitLogRepository.findByUserEmailAndDate(auth.getName(), LocalDate.now());
    }

    @PostMapping("/check-in")
    public HabitLog checkIn(@RequestBody HabitLog log, Authentication auth) {
        log.setUserEmail(auth.getName());
        log.setDate(LocalDate.now());
        return habitLogRepository.save(log);
    }
}
