package com.bill.response.dto;


import com.bill.enums.UserEnum;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminResponseDTO {
	
	private int adminId;
	
	
	private String firstName;
	
	private String lastName;
	
	private String email;
	
	private UserEnum role;
	
	

}

