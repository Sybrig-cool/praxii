package com.praxii.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document("progress_summary")
public class ProgressSummary {
    @Id
    private String id;

    private String userEmail;
    private int daysAbstinent;
    private int meditationStreak;
    private int dreamFrequency;
    private int egoDetection;
}
