package com.bill.services;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OtpService {

    private static final int EXPIRATION_MINUTES = 10;
    private static final int MAX_ATTEMPTS = 5;
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    @Autowired
    private MailService mailService;

    private static class OtpEntry {
        private final String otp;
        private final LocalDateTime expiresAt;
        private int attempts;

        public OtpEntry(String otp, LocalDateTime expiresAt) {
            this.otp = otp;
            this.expiresAt = expiresAt;
            this.attempts = 0;
        }

        public String getOtp() {
            return otp;
        }

        public boolean isExpired() {
            return LocalDateTime.now().isAfter(expiresAt);
        }

        public int getAttempts() {
            return attempts;
        }

        public void incrementAttempts() {
            this.attempts++;
        }
    }

    private final Map<String, OtpEntry> otpStorage = new ConcurrentHashMap<>();

    private String generateOtp() {
        int code = SECURE_RANDOM.nextInt(1_000_000);
        return String.format("%06d", code);
    }

    public void sendRegisterOtp(String email, String name) {
        if (email == null || email.isBlank()) {
            throw new RuntimeException("Email address is required.");
        }
        String normalizedEmail = email.toLowerCase().trim();
        String otp = generateOtp();
        otpStorage.put("REGISTER:" + normalizedEmail, new OtpEntry(otp, LocalDateTime.now().plusMinutes(EXPIRATION_MINUTES)));
        mailService.sendRegisterOtpMail(name, normalizedEmail, otp);
    }

    public void verifyRegisterOtp(String email, String otp) {
        if (email == null || otp == null || otp.isBlank()) {
            throw new RuntimeException("Verification code is required.");
        }
        String key = "REGISTER:" + email.toLowerCase().trim();
        validateAndConsumeOtp(key, otp.trim());
    }

    public void sendLoginOtp(String email, String name) {
        if (email == null || email.isBlank()) {
            throw new RuntimeException("Email address is required.");
        }
        String normalizedEmail = email.toLowerCase().trim();
        String otp = generateOtp();
        otpStorage.put("LOGIN:" + normalizedEmail, new OtpEntry(otp, LocalDateTime.now().plusMinutes(EXPIRATION_MINUTES)));
        mailService.sendLoginOtpMail(name, normalizedEmail, otp);
    }

    public void verifyLoginOtp(String email, String otp) {
        if (email == null || otp == null || otp.isBlank()) {
            throw new RuntimeException("Verification code is required.");
        }
        String key = "LOGIN:" + email.toLowerCase().trim();
        validateAndConsumeOtp(key, otp.trim());
    }

    private void validateAndConsumeOtp(String key, String providedOtp) {
        OtpEntry entry = otpStorage.get(key);
        if (entry == null) {
            throw new RuntimeException("Verification code not found or already used. Please request a new code.");
        }

        if (entry.isExpired()) {
            otpStorage.remove(key);
            throw new RuntimeException("Verification code has expired. Please request a new code.");
        }

        if (entry.getAttempts() >= MAX_ATTEMPTS) {
            otpStorage.remove(key);
            throw new RuntimeException("Too many incorrect attempts. Please request a new code.");
        }

        if (!entry.getOtp().equals(providedOtp)) {
            entry.incrementAttempts();
            int remaining = MAX_ATTEMPTS - entry.getAttempts();
            throw new RuntimeException("Invalid verification code. " + (remaining > 0 ? remaining + " attempt(s) remaining." : "Please request a new code."));
        }

        // Successfully verified, consume and remove
        otpStorage.remove(key);
    }
}
