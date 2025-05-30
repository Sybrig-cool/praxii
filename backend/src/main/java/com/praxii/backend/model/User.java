package com.praxii.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document("users")
public class User {
    @Id
    private String id;

    private String email;
    private String password;
    private String displayName;
    private boolean active = true;
}
