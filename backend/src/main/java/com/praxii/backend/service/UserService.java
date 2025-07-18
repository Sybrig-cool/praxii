package com.praxii.backend.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.praxii.backend.model.User;
import com.praxii.backend.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    public User registerUser(String username, String email, String rawPassword) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already in use");
        }
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username already in use");
        }
        
        String hashedPassword = passwordEncoder.encode(rawPassword);
        String verificationToken = UUID.randomUUID().toString();
        Instant tokenExpiration = Instant.now().plus(24, ChronoUnit.HOURS);
        
        User user = new User(username, email, hashedPassword, Instant.now(), Instant.now());
        user.setVerificationToken(verificationToken);
        user.setTokenExpiresAt(tokenExpiration);
        
        User savedUser = userRepository.save(user);
        
        // Send verification email
        emailService.sendVerificationEmail(email, verificationToken);
        
        return savedUser;
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public boolean validatePassword(String rawPassword, String hashedPassword) {
        return passwordEncoder.matches(rawPassword, hashedPassword);
    }

    public boolean verifyEmail(String token) {
        Optional<User> userOptional = userRepository.findByVerificationToken(token);
        
        if (userOptional.isEmpty()) {
            return false;
        }
        
        User user = userOptional.get();
        
        // Check if token is expired
        if (user.getTokenExpiresAt().isBefore(Instant.now())) {
            return false;
        }
        
        // Verify the email
        user.setEmailVerified(true);
        user.setVerificationToken(null);
        user.setTokenExpiresAt(null);
        user.setUpdatedAt(Instant.now());
        
        userRepository.save(user);
        return true;
    }

    public void resendVerificationEmail(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        
        User user = userOptional.get();
        
        if (user.isEmailVerified()) {
            throw new RuntimeException("Email is already verified");
        }
        
        // Generate new token
        String verificationToken = UUID.randomUUID().toString();
        Instant tokenExpiration = Instant.now().plus(24, ChronoUnit.HOURS);
        
        user.setVerificationToken(verificationToken);
        user.setTokenExpiresAt(tokenExpiration);
        user.setUpdatedAt(Instant.now());
        
        userRepository.save(user);
        
        // Send verification email
        emailService.sendVerificationEmail(email, verificationToken);
    }

    public void updatePassword(String userId, String newPassword) {
        Optional<User> userOptional = userRepository.findById(userId);
        
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        
        User user = userOptional.get();
        String hashedPassword = passwordEncoder.encode(newPassword);
        
        user.setPassword(hashedPassword);
        user.setUpdatedAt(Instant.now());
        
        userRepository.save(user);
    }

    public void initiatePasswordReset(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        
        if (userOptional.isEmpty()) {
            // Don't reveal if email doesn't exist - just return silently
            return;
        }
        
        User user = userOptional.get();
        
        // Generate password reset token
        String resetToken = UUID.randomUUID().toString();
        Instant tokenExpiration = Instant.now().plus(1, ChronoUnit.HOURS); // 1 hour expiration
        
        user.setPasswordResetToken(resetToken);
        user.setPasswordResetExpiresAt(tokenExpiration);
        user.setUpdatedAt(Instant.now());
        
        userRepository.save(user);
        
        // Send password reset email
        emailService.sendPasswordResetEmail(email, resetToken);
    }

    public boolean resetPassword(String token, String newPassword) {
        Optional<User> userOptional = userRepository.findByPasswordResetToken(token);
        
        if (userOptional.isEmpty()) {
            return false;
        }
        
        User user = userOptional.get();
        
        // Check if token is expired
        if (user.getPasswordResetExpiresAt().isBefore(Instant.now())) {
            return false;
        }
        
        // Update password
        String hashedPassword = passwordEncoder.encode(newPassword);
        user.setPassword(hashedPassword);
        
        // Clear reset token
        user.setPasswordResetToken(null);
        user.setPasswordResetExpiresAt(null);
        user.setUpdatedAt(Instant.now());
        
        userRepository.save(user);
        return true;
    }
}
