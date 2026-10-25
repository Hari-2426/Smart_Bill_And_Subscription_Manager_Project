package com.bill.serviceimpl;

import java.time.LocalDateTime;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.bill.dao.UsersRepository;
import com.bill.enums.AccountStatusEnum;
import com.bill.enums.UserEnum;
import com.bill.model.Users;
import com.bill.request.dto.ChangePasswordRequestDTO;
import com.bill.request.dto.UserLoginRequestDTO;
import com.bill.request.dto.UserRegisterRequestDTO;
import com.bill.request.dto.UserUpdateRequestDTO;
import com.bill.response.dto.ChangePasswordResponseDTO;
import com.bill.response.dto.UserLoginResponseDTO;
import com.bill.response.dto.UserRegisterResponseDTO;
import com.bill.response.dto.UserResponseDTO;
import com.bill.security.JwtService;
import com.bill.services.MailService;
import com.bill.services.UserServiceInterface;

@Service
public class UserServiceImpl implements UserServiceInterface {

    @Autowired
    private UsersRepository userRepo;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;
    
    @Autowired
    private MailService emailService;

    @Autowired
    private com.bill.services.OtpService otpService;
    
    private Users getLoggedInActiveUser() {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        Users user = userRepo.findByEmail(email);

        if (user == null) {
            throw new RuntimeException("User not found.");
        }

        if (user.getAccountStatus() == AccountStatusEnum.INACTIVE) {
            throw new RuntimeException("Account is deactivated.");
        }

        return user;
    }

    @Override
    public void sendRegisterOtp(com.bill.request.dto.SendOtpRequestDTO request) {
        if (request == null || request.getEmail() == null || request.getEmail().isBlank()) {
            throw new RuntimeException("Email address is required.");
        }
        String email = request.getEmail().trim().toLowerCase();
        Users existingUser = userRepo.findByEmail(email);
        if (existingUser != null) {
            throw new RuntimeException("Email already registered. Please sign in instead.");
        }
        otpService.sendRegisterOtp(email, request.getName());
    }

    @Override
    public UserRegisterResponseDTO registerNewUser(UserRegisterRequestDTO register) {

        String email = register.getEmail().trim().toLowerCase();
        Users existingUser = userRepo.findByEmail(email);

        if (existingUser != null) {
            throw new RuntimeException("Email already registered.");
        }

        if (register.getOtp() == null || register.getOtp().isBlank()) {
            throw new RuntimeException("Verification code is required to complete registration.");
        }

        // Verify the OTP entered by user
        otpService.verifyRegisterOtp(email, register.getOtp());

        Users user = new Users();

        user.setFirstName(register.getFirstName());
        user.setLastName(register.getLastName());
        user.setEmail(email);
        user.setPassword(encoder.encode(register.getPassword()));

        user.setRole(UserEnum.USER);
        user.setAccountStatus(AccountStatusEnum.ACTIVE);
        user.setAddress(register.getAddress());
        user.setPhoneNumber(register.getPhoneNumber());
        Users savedUser = userRepo.save(user);
        emailService.sendRegistrationMail(savedUser.getFirstName(), savedUser.getEmail());

        UserRegisterResponseDTO response = new UserRegisterResponseDTO();

        BeanUtils.copyProperties(savedUser, response);

        String token = jwtService.generateToken(
                savedUser.getEmail(),
                savedUser.getRole().name());
        response.setToken(token);

        return response;
    }

    @Override
    public UserLoginResponseDTO loginUser(UserLoginRequestDTO loginRequest) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail().trim(),
                        loginRequest.getPassword()));

        Users user = userRepo.findByEmail(loginRequest.getEmail().trim().toLowerCase());

        if (user == null) {
            throw new RuntimeException("User not found.");
        }
        if (user.getAccountStatus() == AccountStatusEnum.INACTIVE) {
            throw new RuntimeException("Account is already deactivated.");
        }

        // Send 6-digit login verification OTP to user's email
        otpService.sendLoginOtp(user.getEmail(), user.getFirstName());

        UserLoginResponseDTO response = new UserLoginResponseDTO();
        response.setUserId(user.getUserId());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setOtpRequired(true);
        response.setMessage("Verification code sent to your email. Please verify to sign in.");

        return response;
    }

    @Override
    public UserLoginResponseDTO verifyLoginOtp(com.bill.request.dto.VerifyLoginOtpRequestDTO request) {
        if (request == null || request.getEmail() == null || request.getOtp() == null) {
            throw new RuntimeException("Email and verification code are required.");
        }

        String email = request.getEmail().trim().toLowerCase();

        // 1. Verify OTP
        otpService.verifyLoginOtp(email, request.getOtp());

        // 2. Fetch User and validate status
        Users user = userRepo.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found.");
        }
        if (user.getAccountStatus() == AccountStatusEnum.INACTIVE) {
            throw new RuntimeException("Account is deactivated.");
        }

        // 3. Issue JWT Token upon verified login
        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole().name());

        UserLoginResponseDTO response = new UserLoginResponseDTO();
        BeanUtils.copyProperties(user, response);
        response.setToken(token);
        response.setOtpRequired(false);
        response.setMessage("Login Successful");

        return response;
    }

    @Override
    public void resendLoginOtp(com.bill.request.dto.SendOtpRequestDTO request) {
        if (request == null || request.getEmail() == null || request.getEmail().isBlank()) {
            throw new RuntimeException("Email address is required.");
        }
        String email = request.getEmail().trim().toLowerCase();
        Users user = userRepo.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found.");
        }
        if (user.getAccountStatus() == AccountStatusEnum.INACTIVE) {
            throw new RuntimeException("Account is deactivated.");
        }
        otpService.sendLoginOtp(user.getEmail(), user.getFirstName());
    }

	@Override
	public UserResponseDTO getUserDetails() {
		
		Users user = getLoggedInActiveUser();
		
		
		UserResponseDTO response=new UserResponseDTO();
		BeanUtils.copyProperties(user, response);
		
		
		return response;
	}

	@Override
	public UserResponseDTO updateUserDetails(UserUpdateRequestDTO userUpdate) {

	   Users user=getLoggedInActiveUser();

	    if (userUpdate.getFirstName() != null) {
	        user.setFirstName(userUpdate.getFirstName());
	    }

	    if (userUpdate.getLastName() != null) {
	        user.setLastName(userUpdate.getLastName());
	    }

	    if (userUpdate.getAddress() != null) {
	        user.setAddress(userUpdate.getAddress());
	    }

	    if (userUpdate.getPhoneNumber() != 0) {
	        user.setPhoneNumber(userUpdate.getPhoneNumber());
	    }

	    Users savedUser = userRepo.save(user);
	    
	    emailService.sendProfileUpdatedMail(savedUser.getFirstName(), savedUser.getEmail());
	    
	    UserResponseDTO response = new UserResponseDTO();
	    BeanUtils.copyProperties(savedUser, response);

	    return response;
	}

	@Override
	public ChangePasswordResponseDTO updatePassword(ChangePasswordRequestDTO changePasswordRequest) {
		
		Users user=getLoggedInActiveUser();
		String newPassword = changePasswordRequest.getNewPassword();
		String newEncodedPassword = encoder.encode(newPassword);
		
		//Verifying Old password is correct or not
		if(!encoder.matches(changePasswordRequest.getOldPassword(),user.getPassword()))
		{
			throw new RuntimeException("Old password is incorrect");
		}
		
		//Verifying new password and confirm password are correct or not
		if(!changePasswordRequest.getNewPassword().equals(changePasswordRequest.getConfirmPassword()))
		{
			throw new RuntimeException("New password and confirm password do not match.");
		}
		//Verifying new password is same as old password
		if(encoder.matches(changePasswordRequest.getNewPassword(), user.getPassword()))
		{
			throw new RuntimeException("New password cannot be the same as the old password.");
		}
		user.setPassword(newEncodedPassword);
		Users savedUser = userRepo.save(user);
		ChangePasswordResponseDTO changeResponse=new ChangePasswordResponseDTO();
		
		BeanUtils.copyProperties(savedUser, changeResponse);
		
		emailService.sendPasswordChangedMail(savedUser.getFirstName(), savedUser.getEmail());
		
		changeResponse.setMessage("Password Changed Successfully");
		changeResponse.setChangedAt(LocalDateTime.now());
		return changeResponse;
	}

	@Override
	public String deleteAccount() {
		
		Users user=getLoggedInActiveUser();
		user.setAccountStatus(AccountStatusEnum.INACTIVE);
		userRepo.save(user);
		emailService.sendUserDeactivatedMail(user.getFirstName(), user.getEmail());
		return "Account deactivated successfully.";
		
	}
	
	
	
}