package com.bill.response.dto;

import com.bill.enums.UserEnum;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserLoginResponseDTO {
	
	private int userId;
	private String firstName;
	private String lastName;
	private String email;
	private UserEnum role;
	private String token;
	private String message;
	private boolean otpRequired;
}
