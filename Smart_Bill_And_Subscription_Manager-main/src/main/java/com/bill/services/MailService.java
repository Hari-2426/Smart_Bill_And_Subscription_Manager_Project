package com.bill.services;

import java.math.BigDecimal;
import java.time.LocalDate;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@Async
public class MailService {

    @Autowired(required = false)
    private JavaMailSender javaMailSender;
    
    @Value("${spring.mail.username:smartadmin4@gmail.com}")
    private String fromMail;

    @Value("${brevo.api.key:${BREVO_API_KEY:}}")
    private String brevoApiKey;

    private void sendSafely(SimpleMailMessage mail) {
        // 1. Primary: Use Brevo HTTPS REST API over Port 443 (supported on Render / cloud)
        if (brevoApiKey != null && !brevoApiKey.isBlank()) {
            if (sendViaBrevoApi(mail)) {
                return;
            }
        }

        // 2. Fallback: Use standard JavaMailSender SMTP
        try {
            if (javaMailSender != null) {
                javaMailSender.send(mail);
            }
        } catch (Exception e) {
            System.err.println("Warning: Could not send email via SMTP: " + e.getMessage());
        }
    }

    private boolean sendViaBrevoApi(SimpleMailMessage mail) {
        try {
            String toEmail = (mail.getTo() != null && mail.getTo().length > 0) ? mail.getTo()[0] : "";
            if (toEmail == null || toEmail.isBlank()) return false;

            String senderEmail = (fromMail != null && !fromMail.isBlank()) ? fromMail : "smartadmin4@gmail.com";
            String subject = mail.getSubject() != null ? mail.getSubject() : "SmartBill Notification";
            String content = mail.getText() != null ? mail.getText() : "";

            String payload = String.format(
                "{\"sender\":{\"name\":\"SmartBill\",\"email\":%s},\"to\":[{\"email\":%s}],\"subject\":%s,\"textContent\":%s}",
                toJsonString(senderEmail),
                toJsonString(toEmail),
                toJsonString(subject),
                toJsonString(content)
            );

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.brevo.com/v3/smtp/email"))
                .header("Content-Type", "application/json")
                .header("api-key", brevoApiKey.trim())
                .POST(HttpRequest.BodyPublishers.ofString(payload, StandardCharsets.UTF_8))
                .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                System.out.println("Email sent successfully via Brevo HTTPS API to: " + toEmail);
                return true;
            } else {
                System.err.println("Brevo API error " + response.statusCode() + ": " + response.body());
                return false;
            }
        } catch (Exception e) {
            System.err.println("Failed to send email via Brevo API: " + e.getMessage());
            return false;
        }
    }

    private String toJsonString(String text) {
        if (text == null) return "\"\"";
        StringBuilder sb = new StringBuilder("\"");
        for (char c : text.toCharArray()) {
            switch (c) {
                case '"': sb.append("\\\""); break;
                case '\\': sb.append("\\\\"); break;
                case '\b': sb.append("\\b"); break;
                case '\f': sb.append("\\f"); break;
                case '\n': sb.append("\\n"); break;
                case '\r': sb.append("\\r"); break;
                case '\t': sb.append("\\t"); break;
                default:
                    if (c < ' ') {
                        sb.append(String.format("\\u%04x", (int) c));
                    } else {
                        sb.append(c);
                    }
            }
        }
        sb.append("\"");
        return sb.toString();
    }

    public void sendRegistrationMail(String userName, String email) {

        SimpleMailMessage mailMessage = new SimpleMailMessage();

        mailMessage.setFrom(fromMail);  
        mailMessage.setTo(email);

        mailMessage.setSubject("🎉 Welcome to SmartBill");

        mailMessage.setText(
                "Dear " + userName + ",\n\n" +

                "Welcome to SmartBill!\n\n" +

                "Your account has been created successfully.\n\n" +

                "With SmartBill you can:\n" +
                "• Manage all your subscription bills\n" +
                "• Track payment history\n" +
                "• Receive bill due reminders\n" +
                "• Never miss an important payment\n\n" +

                "Thank you for choosing SmartBill.\n\n" +

                "Regards,\n" +
                "SmartBill Team"
        );

        sendSafely(mailMessage);
    }
    
    public void sendBillCreatedMail(String name, String email, String billName, BigDecimal bigDecimal, LocalDate localDate) {

        SimpleMailMessage mail = new SimpleMailMessage();
        
        mail.setFrom(fromMail);
        mail.setTo(email);
        
        mail.setSubject("✅ Bill Added Successfully");
        
        mail.setText(
                "Dear " + name + ",\n\n" +
                
                "Your bill has been added successfully.\n\n" +
                
                "Bill Name : " + billName + "\n" +
                "Amount : ₹" + bigDecimal + "\n" +
                "Due Date : " + localDate + "\n\n" +
                
                "You will receive reminders before the due date.\n\n" +
                
                "Regards,\n" +
                "SmartBill Team"
        );
            
        sendSafely(mail);
    }

    public void sendBillDeletedMail(String name, String email, String billName) {
    
        SimpleMailMessage mail = new SimpleMailMessage();
        
        mail.setFrom(fromMail);
        mail.setTo(email);
        
        mail.setSubject("🗑 Bill Deleted");
        
        mail.setText(
            "Dear " + name + ",\n\n" +
            
            "The following bill has been removed successfully.\n\n" +
            
            "Bill : " + billName + "\n\n" +
            
            "Regards,\n" +
            "SmartBill Team"
        );
        
        sendSafely(mail);
    }

    public void sendPaymentSuccessMail(String name, String email, String billName, BigDecimal bigDecimal) {
    
        SimpleMailMessage mail = new SimpleMailMessage();
        
        mail.setFrom(fromMail);
        mail.setTo(email);
        
        mail.setSubject("💳 Payment Successful");
        
        mail.setText(
            "Dear " + name + ",\n\n" +
            
            "Your payment has been completed successfully.\n\n" +
            
            "Bill : " + billName + "\n" +
            "Amount Paid : ₹" + bigDecimal + "\n\n" +
            
            "Thank you for using SmartBill.\n\n" +
            
            "Regards,\n" +
            "SmartBill Team"
        );
        
        sendSafely(mail);
    }
    
    public void sendPasswordChangedMail(String name, String email) {
    
        SimpleMailMessage mail = new SimpleMailMessage();
        
        mail.setFrom(fromMail);
        mail.setTo(email);
        
        mail.setSubject("🔒 Password Changed");
        
        mail.setText(
            "Dear " + name + ",\n\n" +
            
            "Your password has been changed successfully.\n\n" +
            
            "If you did not perform this action, please contact support immediately.\n\n" +
            
            "Regards,\n" +
            "SmartBill Team"
        );
    
        sendSafely(mail);
    }
    
    public void sendProfileUpdatedMail(String name, String email) {
    
        SimpleMailMessage mail = new SimpleMailMessage();
        
        mail.setFrom(fromMail);
        mail.setTo(email);
        
        mail.setSubject("👤 Profile Updated");
        
        mail.setText(
            "Dear " + name + ",\n\n" +
            
            "Your profile information has been updated successfully.\n\n" +
            
            "Regards,\n" +
            "SmartBill Team"
        );
        
        sendSafely(mail);
    }
    
    public void sendAccountDeletedMail(String name, String email) {
    
        SimpleMailMessage mail = new SimpleMailMessage();
        
        mail.setFrom(fromMail);
        mail.setTo(email);
        
        mail.setSubject("😔 Account Deleted");
        
        mail.setText(
            "Dear " + name + ",\n\n" +
            
            "Your SmartBill account has been deleted successfully.\n\n" +
            
            "We're sorry to see you go.\n\n" +
            
            "Thank you for being a part of SmartBill.\n\n" +
            
            "Regards,\n" +
            "SmartBill Team"
        );
        
        sendSafely(mail);
    }
    
    public void sendAdminRegisteredMail(String name, String email) {
    
        SimpleMailMessage mail = new SimpleMailMessage();
        
        mail.setFrom(fromMail);
        mail.setTo(email);
        
        mail.setSubject("🎉 Welcome Administrator");
        
        mail.setText(
            "Dear " + name + ",\n\n" +
            
            "Your administrator account has been created successfully.\n\n" +
            
            "Please login and start managing SmartBill.\n\n" +
            
            "Regards,\n" +
            "SmartBill Team"
        );
        
        sendSafely(mail);
    }
    
    public void sendAdminActivatedMail(String name, String email) {
    
        SimpleMailMessage mail = new SimpleMailMessage();
        
        mail.setFrom(fromMail);
        mail.setTo(email);
        
        mail.setSubject("✅ Administrator Account Activated");
        
        mail.setText(
            "Dear " + name + ",\n\n" +
            
            "Your administrator account has been activated.\n\n" +
            
            "You now have access to the SmartBill Admin Portal.\n\n" +
            
            "Regards,\n" +
            "SmartBill Team"
        );
        
        sendSafely(mail);
    }
    
    public void sendAdminDeactivatedMail(String name, String email) {
    
        SimpleMailMessage mail = new SimpleMailMessage();
        
        mail.setFrom(fromMail);
        mail.setTo(email);
        
        mail.setSubject("❌ Administrator Account Deactivated");
        
        mail.setText(
            "Dear " + name + ",\n\n" +
            
            "Your administrator account has been deactivated.\n\n" +
            
            "If you believe this is an error, please contact the Super Administrator.\n\n" +
            
            "Regards,\n" +
            "SmartBill Team"
        );
        
        sendSafely(mail);
    }
    
    public void sendUserActivatedMail(String name, String email) {
    
        SimpleMailMessage mail = new SimpleMailMessage();
        
        mail.setFrom(fromMail);
        mail.setTo(email);
        
        mail.setSubject("✅ Account Activated");
        
        mail.setText(
            "Dear " + name + ",\n\n" +
            
            "Your SmartBill account has been activated successfully.\n\n" +
            
            "Regards,\n" +
            "SmartBill Team"
        );
        
        sendSafely(mail);
    }
    
    public void sendUserDeactivatedMail(String name, String email) {
    
        SimpleMailMessage mail = new SimpleMailMessage();
        
        mail.setFrom(fromMail);
        mail.setTo(email);
        
        mail.setSubject("❌ Account Deactivated");
        
        mail.setText(
            "Dear " + name + ",\n\n" +
            
            "Your SmartBill account has been deactivated.\n\n" +
            
            "Please contact the administrator for more information.\n\n" +
            
            "Regards,\n" +
            "SmartBill Team"
        );
        
        sendSafely(mail);
    }
    
    public void sendBillReminderMail(String name, String email, String billName, BigDecimal amount, String dueDate, int daysLeft) {

        SimpleMailMessage mail = new SimpleMailMessage();
        
        mail.setFrom(fromMail);
        mail.setTo(email);
        
        mail.setSubject("⏰ Bill Reminder - " + daysLeft + " Day(s) Remaining");
        
        mail.setText(
                "Dear " + name + ",\n\n" +
                
                "This is a reminder that your bill is approaching its due date.\n\n" +
                
                "Bill : " + billName + "\n" +
                "Amount : ₹" + amount + "\n" +
                "Due Date : " + dueDate + "\n" +
                "Days Remaining : " + daysLeft + "\n\n" +
                
                "Please pay your bill before the due date to avoid missing a payment.\n\n" +
                
                "Regards,\n" +
                "SmartBill Team"
        );
        
        sendSafely(mail);
    }

}