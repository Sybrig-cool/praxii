package com.praxii.backend.dto;

import com.praxii.backend.model.DreamType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class DreamRequest {
    
    @NotNull(message = "Dream date is required")
    private LocalDate dreamDate;
    
    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must be less than 200 characters")
    private String title;
    
    @NotBlank(message = "Description is required")
    @Size(max = 5000, message = "Description must be less than 5000 characters")
    private String description;
    
    @NotNull(message = "Dream type is required")
    private DreamType dreamType;

    public DreamRequest() {}

    public DreamRequest(LocalDate dreamDate, String title, String description, DreamType dreamType) {
        this.dreamDate = dreamDate;
        this.title = title;
        this.description = description;
        this.dreamType = dreamType;
    }

    public LocalDate getDreamDate() { return dreamDate; }
    public void setDreamDate(LocalDate dreamDate) { this.dreamDate = dreamDate; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public DreamType getDreamType() { return dreamType; }
    public void setDreamType(DreamType dreamType) { this.dreamType = dreamType; }
}