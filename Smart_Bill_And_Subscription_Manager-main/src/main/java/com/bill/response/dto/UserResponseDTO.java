package com.bill.response.dto;

import java.time.LocalDateTime;


import com.bill.enums.AccountStatusEnum;
import com.bill.enums.UserEnum;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDTO {
	
	private int userId;
	
	private String firstName;
	
	private String lastName;
	
	private String email;
	
	private UserEnum role;

	private AccountStatusEnum accountStatus;
	
	private LocalDateTime createdAt;
	
	private String address;
	
	private long phoneNumber;

}
