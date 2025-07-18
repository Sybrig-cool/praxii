package com.praxii.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:4200")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH")
                        .allowedHeaders("*")
                        .exposedHeaders("*")
                        .allowCredentials(true)
                        .maxAge(3600); // Cache preflight for 1 hour
            }
        };
    }
}
// This configuration class sets up CORS for the backend API, allowing requests from the specified origin.
// It is essential for enabling communication between the frontend and backend during development.
// The allowed origin can be adjusted based on the deployment environment or frontend application URL.
// This is particularly useful when the frontend and backend are served from different origins, such as during local development.
