package com.praxii.backend.service;

import org.springframework.stereotype.Service;

@Service
public class EmailService {

    public void sendVerificationEmail(String email, String verificationToken) {
        String verificationUrl = "http://localhost:4200/verify-email?token=" + verificationToken;
        
        System.out.println("=== EMAIL VERIFICATION ===");
        System.out.println("To: " + email);
        System.out.println("Subject: Verify your Praxii account");
        System.out.println("Body: Please click the following link to verify your email:");
        System.out.println(verificationUrl);
        System.out.println("This link will expire in 24 hours.");
        System.out.println("========================");
        
        // In a real application, you would integrate with an email service like:
        // - AWS SES
        // - SendGrid
        // - JavaMailSender with SMTP
        // For now, we're just logging to console for development
    }
}