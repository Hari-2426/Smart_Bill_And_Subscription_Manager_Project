package com.bill.services;


import com.bill.request.dto.ChangePasswordRequestDTO;
import com.bill.request.dto.UserLoginRequestDTO;
import com.bill.request.dto.UserRegisterRequestDTO;
import com.bill.request.dto.UserUpdateRequestDTO;
import com.bill.response.dto.ChangePasswordResponseDTO;
import com.bill.response.dto.UserLoginResponseDTO;
import com.bill.response.dto.UserRegisterResponseDTO;
import com.bill.response.dto.UserResponseDTO;

public interface UserServiceInterface {
	
	public UserRegisterResponseDTO registerNewUser(UserRegisterRequestDTO register);
	
	public UserLoginResponseDTO loginUser(UserLoginRequestDTO loginRequest);
	
	public UserResponseDTO getUserDetails();
	
	public UserResponseDTO updateUserDetails(UserUpdateRequestDTO userUpdate);
	
	public ChangePasswordResponseDTO updatePassword(ChangePasswordRequestDTO changePasswordRequest);
	
	public String deleteAccount();

}
