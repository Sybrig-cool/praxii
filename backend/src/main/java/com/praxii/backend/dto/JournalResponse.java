package com.praxii.backend.dto;

import java.time.Instant;

public class JournalResponse {
    private String id;
    private String content;
    private Instant createdAt;

    public JournalResponse() {}

    public JournalResponse(String id, String content, Instant createdAt) {
        this.id = id;
        this.content = content;
        this.createdAt = createdAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
