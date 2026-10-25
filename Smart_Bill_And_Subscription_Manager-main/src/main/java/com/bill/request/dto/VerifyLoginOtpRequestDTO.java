package com.bill.request.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VerifyLoginOtpRequestDTO {
    private String email;
    private String otp;
}
