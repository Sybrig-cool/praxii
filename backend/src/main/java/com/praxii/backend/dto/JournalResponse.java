package com.praxii.backend.dto;

import java.time.LocalDateTime;

public class JournalResponse {
    private String id;
    private String content;
    private LocalDateTime createdAt;

    public JournalResponse() {}

    public JournalResponse(String id, String content, LocalDateTime createdAt) {
        this.id = id;
        this.content = content;
        this.createdAt = createdAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
