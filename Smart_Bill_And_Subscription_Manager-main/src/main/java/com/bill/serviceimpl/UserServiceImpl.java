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
    public UserRegisterResponseDTO registerNewUser(UserRegisterRequestDTO register) {

        Users existingUser = userRepo.findByEmail(register.getEmail());

        if (existingUser != null) {
            throw new RuntimeException("Email already registered.");
        }

        Users user = new Users();

        user.setFirstName(register.getFirstName());
        user.setLastName(register.getLastName());
        user.setEmail(register.getEmail());
        user.setPassword(encoder.encode(register.getPassword()));

        user.setRole(UserEnum.USER);
        user.setAccountStatus(AccountStatusEnum.ACTIVE);
        user.setAddress(register.getAddress());
        user.setPhoneNumber(register.getPhoneNumber());
        Users savedUser = userRepo.save(user);
        emailService.sendRegistrationMail(savedUser.getFirstName(), savedUser.getEmail());

        UserRegisterResponseDTO response = new UserRegisterResponseDTO();

        BeanUtils.copyProperties(savedUser, response);

        return response;
    }

    @Override
    public UserLoginResponseDTO loginUser(UserLoginRequestDTO loginRequest) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()));

        Users user = userRepo.findByEmail(loginRequest.getEmail());

        if (user == null) {
            throw new RuntimeException("User not found.");
        }
        if(user.getAccountStatus()==AccountStatusEnum.INACTIVE)
		{
			throw new RuntimeException("Account is already deactivated.");
		}

        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole().name());

        UserLoginResponseDTO response = new UserLoginResponseDTO();

        BeanUtils.copyProperties(user, response);

        response.setToken(token);
        response.setMessage("Login Successful");

        return response;
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