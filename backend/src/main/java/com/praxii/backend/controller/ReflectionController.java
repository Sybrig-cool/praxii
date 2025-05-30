package com.praxii.backend.controller;

import com.praxii.backend.model.Reflection;
import com.praxii.backend.service.ReflectionService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reflection")
@RequiredArgsConstructor
public class ReflectionController {

    private final ReflectionService service;

    @PostMapping
    public ResponseEntity<Reflection> createReflection(@AuthenticationPrincipal String userEmail,
                                                       @RequestBody Map<String, String> payload) {
        String mood = payload.get("mood");
        String thoughts = payload.get("thoughts");

        Reflection reflection = service.saveReflection(userEmail, mood, thoughts);
        return ResponseEntity.ok(reflection);
    }

    @GetMapping
    public ResponseEntity<List<Reflection>> getReflections(@AuthenticationPrincipal(expression = "username") String userEmail) {
        return ResponseEntity.ok(service.getUserReflections(userEmail));
    }
}
