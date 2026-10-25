package com.bill.request.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChangePasswordRequestDTO {
	
	private String oldPassword;
	private String newPassword;
	private String confirmPassword;
	
}
