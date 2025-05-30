package com.praxii.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document("journals")
public class JournalEntry {
    @Id
    private String id;

    private String userEmail; // ties to JWT-authenticated user

    private String title;
    private String content;
    private LocalDateTime timestamp = LocalDateTime.now();
}
