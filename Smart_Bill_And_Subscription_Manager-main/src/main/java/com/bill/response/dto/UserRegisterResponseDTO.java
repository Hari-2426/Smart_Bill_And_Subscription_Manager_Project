package com.bill.response.dto;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRegisterResponseDTO {
	
	private int userId;
	
	private String firstName;
	
	private String lastName;
	
	private String email;
		
	private String address;
	
	private long phoneNumber;
	
	private LocalDateTime createdAt;
	
	private String token;
	
	// We can write User logged in successfully or registered successfully


}