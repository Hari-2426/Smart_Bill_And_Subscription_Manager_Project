package com.bill.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bill.request.dto.ChangePasswordRequestDTO;
import com.bill.request.dto.UserLoginRequestDTO;
import com.bill.request.dto.UserRegisterRequestDTO;
import com.bill.request.dto.UserUpdateRequestDTO;
import com.bill.response.dto.ChangePasswordResponseDTO;
import com.bill.response.dto.UserLoginResponseDTO;
import com.bill.response.dto.UserRegisterResponseDTO;
import com.bill.response.dto.UserResponseDTO;
import com.bill.services.UserServiceInterface;

@RestController
@RequestMapping("/users/auth")
public class UserController {
	
	@Autowired
	private UserServiceInterface userService;
	
	@PostMapping("/register")
	public UserRegisterResponseDTO registerUser(@RequestBody UserRegisterRequestDTO registerRequest)
	{
		return userService.registerNewUser(registerRequest);
	}
	
	@PostMapping("/login")
	public UserLoginResponseDTO loginUser(@RequestBody UserLoginRequestDTO loginUserRequest)
	{
		return userService.loginUser(loginUserRequest);
	}
	
	
	@GetMapping("/profile")
	public UserResponseDTO getUserDetails()
	{
		return userService.getUserDetails();
	}
	
	@PatchMapping("/updateProfile")
	public UserResponseDTO updateUserDetails(@RequestBody UserUpdateRequestDTO userUpdateRequest)
	{
		return userService.updateUserDetails(userUpdateRequest);
	}
	
	@PutMapping("/updatePassword")
	public ChangePasswordResponseDTO changeUserPassword(@RequestBody ChangePasswordRequestDTO changePassword)
	{
		return userService.updatePassword(changePassword);
	}
	
	@DeleteMapping("/delete")
	public String deleteUser()
	{
		return userService.deleteAccount();
	}

}
