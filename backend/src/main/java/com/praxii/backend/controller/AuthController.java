package com.praxii.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.praxii.backend.model.User;
import com.praxii.backend.security.JwtUtil;
import com.praxii.backend.service.UserService;
import com.praxii.backend.dto.PasswordChangeRequest;
import com.praxii.backend.dto.ForgotPasswordRequest;
import com.praxii.backend.dto.ResetPasswordRequest;

import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    
    @Autowired
    private UserService userService;
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest request) {
        try {
            User user = userService.registerUser(request.getUsername(), request.getEmail(), request.getPassword());
            return ResponseEntity.ok("User registered successfully. Please check your email to verify your account.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {
        User user = userService.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!userService.validatePassword(request.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Invalid email or password");
        }

        // Temporarily bypass email verification for development
        // if (!user.isEmailVerified()) {
        //     return ResponseEntity.badRequest().body("Please verify your email before logging in");
        // }

        String token = jwtUtil.generateToken(user.getUsername());
        return ResponseEntity.ok(new JwtResponse(token, user.getUsername(), user.getEmail()));
    }

    @GetMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        try {
            boolean verified = userService.verifyEmail(token);
            if (verified) {
                return ResponseEntity.ok("Email verified successfully");
            } else {
                return ResponseEntity.badRequest().body("Invalid or expired verification token");
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerification(@RequestBody ResendVerificationRequest request) {
        try {
            userService.resendVerificationEmail(request.getEmail());
            return ResponseEntity.ok("Verification email sent successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Temporarily commented out password change endpoints due to compilation issues
    // Will be re-enabled after fixing DTOs
    
    /*
    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody PasswordChangeRequest request, 
                                           @RequestHeader("Authorization") String token) {
        // Implementation temporarily disabled
        return ResponseEntity.ok("Password change temporarily disabled");
    }

    @PostMapping("/forgot-password") 
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        // Implementation temporarily disabled
        return ResponseEntity.ok("Forgot password temporarily disabled");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        // Implementation temporarily disabled
        return ResponseEntity.ok("Reset password temporarily disabled");
    }
    */

    @PostMapping("/manual-verify-email")
    public ResponseEntity<?> manualVerifyEmail(@RequestBody ManualVerifyRequest request) {
        try {
            logger.info("Manual email verification request for: {}", request.getEmail());
            
            boolean verified = userService.manualVerifyEmail(request.getEmail());
            
            if (verified) {
                return ResponseEntity.ok("Email verified successfully for user: " + request.getEmail());
            } else {
                return ResponseEntity.badRequest().body("User not found with email: " + request.getEmail());
            }
            
        } catch (Exception e) {
            logger.error("Error manually verifying email: ", e);
            return ResponseEntity.badRequest().body("Failed to verify email: " + e.getMessage());
        }
    }

    // DTO classes for requests and responses

    public static class ManualVerifyRequest {
        private String email;
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }

    // @Data
    // static class SignupRequest {
    //     private String username;
    //     private String email;
    //     private String password;
    // }

    // @Data
    // static class LoginRequest {
    //     private String email;
    //     private String password;
    // }

    // @Data
    // static class JwtResponse {
    //     private final String token;
    //     private final String username;
    //     private final String email;
    // }

public static class SignupRequest {
    private String username;
    private String email;
    private String password;

    public SignupRequest() {}

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}

public static class LoginRequest {
    private String email;
    private String password;

    public LoginRequest() {}

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}

public static class JwtResponse {
    private String token;
    private String username;
    private String email;

    public JwtResponse(String token, String username, String email) {
        this.token = token;
        this.username = username;
        this.email = email;
    }

    public String getToken() { return token; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
}

public static class ResendVerificationRequest {
    private String email;

    public ResendVerificationRequest() {}

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}

}
