package com.praxii.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "reflections")
public class Reflection {
    @Id
    private String id;
    private String userId;
    private LocalDateTime date;
    private String mood;
    private String thoughts;
    private String aiReflection;
    private LocalDateTime createdAt;
}
