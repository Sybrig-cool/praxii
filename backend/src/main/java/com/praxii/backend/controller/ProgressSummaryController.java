package com.praxii.backend.controller;

import com.praxii.backend.model.ProgressSummary;
import com.praxii.backend.service.ProgressSummaryService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/progress")
public class ProgressSummaryController {

    private final ProgressSummaryService service;

    public ProgressSummaryController(ProgressSummaryService service) {
        this.service = service;
    }

    @GetMapping("/summary")
    public ProgressSummary getProgress(@AuthenticationPrincipal String email) {
        return service.getOrCreateProgress(email);
    }
}
