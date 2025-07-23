package com.praxii.backend.model;

public enum DreamType {
    LUCID("Lucid Dream"),
    NIGHTMARE("Nightmare"),
    RECURRING("Recurring Dream"),
    PROPHETIC("Prophetic Dream"),
    NORMAL("Normal Dream"),
    DAYDREAM("Daydream"),
    MEDITATION("Meditation Vision"),
    OTHER("Other");

    private final String displayName;

    DreamType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}