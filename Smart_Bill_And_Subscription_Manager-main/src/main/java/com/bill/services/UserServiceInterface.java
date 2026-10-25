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
	
	public void sendRegisterOtp(com.bill.request.dto.SendOtpRequestDTO request);
	
	public UserLoginResponseDTO verifyLoginOtp(com.bill.request.dto.VerifyLoginOtpRequestDTO request);
	
	public void resendLoginOtp(com.bill.request.dto.SendOtpRequestDTO request);
	
	public String deleteAccount();

}
