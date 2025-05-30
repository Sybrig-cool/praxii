package com.praxii.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Data
@Document("habits")
public class HabitLog {
    @Id
    private String id;

    private String userEmail;

    private LocalDate date = LocalDate.now();

    private boolean abstinent;
    private boolean prayedMorning;
    private boolean prayedNight;
    private boolean mantraDone;
    private boolean meditated;
    private int meditationMinutes;

    private boolean rememberedDream;
    private String dreamNote;

    private String egoObserved;
    private String mood;
}
