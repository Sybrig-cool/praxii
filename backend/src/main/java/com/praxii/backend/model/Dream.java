package com.praxii.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;
import java.time.Instant;

@Document(collection = "dreams")
public class Dream {
    @Id
    private String id;
    
    private String userId;
    
    private LocalDate dreamDate;
    
    private String title;
    
    private String description;
    
    private DreamType dreamType;
    
    private Instant createdAt;
    
    private Instant updatedAt;

    public Dream() {}

    public Dream(String userId, LocalDate dreamDate, String title, String description, DreamType dreamType) {
        this.userId = userId;
        this.dreamDate = dreamDate;
        this.title = title;
        this.description = description;
        this.dreamType = dreamType;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public LocalDate getDreamDate() { return dreamDate; }
    public void setDreamDate(LocalDate dreamDate) { this.dreamDate = dreamDate; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public DreamType getDreamType() { return dreamType; }
    public void setDreamType(DreamType dreamType) { this.dreamType = dreamType; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}