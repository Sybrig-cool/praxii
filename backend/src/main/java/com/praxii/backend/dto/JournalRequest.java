package com.praxii.backend.dto;

public class JournalRequest {
    private String content;

    public JournalRequest() {}

    public JournalRequest(String content) {
        this.content = content;
    }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
