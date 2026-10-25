package com.bill.request.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRegisterRequestDTO {
	

	private String firstName;
	
	private String lastName;
	
	
	private String email;
	
	private String password;
	
	private String address;
	
	private long phoneNumber;
	

}
