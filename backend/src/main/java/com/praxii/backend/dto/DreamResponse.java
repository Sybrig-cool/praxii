package com.praxii.backend.dto;

import com.praxii.backend.model.DreamType;
import java.time.LocalDate;
import java.time.Instant;

public class DreamResponse {
    private String id;
    private LocalDate dreamDate;
    private String title;
    private String description;
    private DreamType dreamType;
    private String dreamTypeDisplayName;
    private Instant createdAt;
    private Instant updatedAt;

    public DreamResponse() {}

    public DreamResponse(String id, LocalDate dreamDate, String title, String description, 
                        DreamType dreamType, String dreamTypeDisplayName, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.dreamDate = dreamDate;
        this.title = title;
        this.description = description;
        this.dreamType = dreamType;
        this.dreamTypeDisplayName = dreamTypeDisplayName;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public LocalDate getDreamDate() { return dreamDate; }
    public void setDreamDate(LocalDate dreamDate) { this.dreamDate = dreamDate; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public DreamType getDreamType() { return dreamType; }
    public void setDreamType(DreamType dreamType) { this.dreamType = dreamType; }

    public String getDreamTypeDisplayName() { return dreamTypeDisplayName; }
    public void setDreamTypeDisplayName(String dreamTypeDisplayName) { this.dreamTypeDisplayName = dreamTypeDisplayName; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}