package com.bill.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bill.enums.AccountStatusEnum;
import com.bill.request.dto.AdminLoginRequestDTO;
import com.bill.request.dto.AdminRegisterRequestDTO;
import com.bill.response.dto.AdminLoginResponseDTO;
import com.bill.response.dto.AdminResponseDTO;
import com.bill.response.dto.MonthlyTransactionDTO;
import com.bill.response.dto.UserResponseDTO;
import com.bill.services.AdminServiceInterface;

@RestController
@RequestMapping("/admins")
public class AdminsController {
	
	
	@Autowired
	private AdminServiceInterface adminService;
	
	@PostMapping("/login")
	public AdminLoginResponseDTO loginAdmin(@RequestBody AdminLoginRequestDTO loginRequest)
	{
		return adminService.loginAdmin(loginRequest);
	}
	
	@PostMapping("/register")
	public AdminResponseDTO registerAdmin(@RequestBody AdminRegisterRequestDTO registerNewAdmin)
	{
		return adminService.registerAdmin(registerNewAdmin);
	}
	
	@GetMapping("/users")
	public List<UserResponseDTO> getAllUsers() {
	    return adminService.getAllUsers();
	}
	
	@GetMapping("/users/{userId}")
	public UserResponseDTO getUserById(@PathVariable int userId) {
	    return adminService.getUserById(userId);
	}
	
	@PatchMapping("/users/activate/{userId}")
	public String activateUser(@PathVariable int userId) {
	    return adminService.activateUser(userId);
	}
	
	@PatchMapping("/users/deactivate/{userId}")
	public String deactivateUser(@PathVariable int userId) {
	    return adminService.deactivateUser(userId);
	}
	
	@PreAuthorize("hasRole('SUPER_ADMIN')")
	@GetMapping("getAllAdmins")
	public List<AdminResponseDTO> getAllAdmins()
	{
		return adminService.getAllAdmins();
	}
	
	
	@GetMapping("/{adminId}")
	public AdminResponseDTO getAdminById(@PathVariable int adminId) {
	    return adminService.getAdminById(adminId);
	}
	
	@PatchMapping("/admin/deactivate/{adminId}")
	public String deactivatString(@PathVariable int adminId) {
	    return adminService.deactivateAdmin(adminId);
	}
	
	@PatchMapping("/admin/activate/{adminId}")
	public String activateAdmin(@PathVariable int adminId) {
	    return adminService.activateAdmin(adminId);
	}
	
	
	@GetMapping("/status/{status}")
	public List<AdminResponseDTO> getAdminsByStatus(
	        @PathVariable AccountStatusEnum status) {

	    return adminService.getAdminsByStatus(status);
	}
	@GetMapping("/test")
	public String testAdmin()
	{
		return "Login working";
	}
	
	@GetMapping("/dashboard/timeline")
	public List<MonthlyTransactionDTO> getTransactionTimeline() {
	    return adminService.getTransactionTimeline();
	}
	
	@GetMapping("/dashboard/monitoring")
	public com.bill.response.dto.SystemMonitoringDTO getSystemMonitoring() {
	    return adminService.getSystemMonitoring();
	}

	@GetMapping("/dashboard/analytics")
	public com.bill.response.dto.AdminDashboardDTO getAdminDashboardAnalytics() {
	    return adminService.getAdminDashboardAnalytics();
	}

}
