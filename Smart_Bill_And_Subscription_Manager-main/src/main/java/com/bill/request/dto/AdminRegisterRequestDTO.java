package com.bill.request.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminRegisterRequestDTO {
	private String firstName;
	private String lastName;
	private String email;
	private String password;

}
