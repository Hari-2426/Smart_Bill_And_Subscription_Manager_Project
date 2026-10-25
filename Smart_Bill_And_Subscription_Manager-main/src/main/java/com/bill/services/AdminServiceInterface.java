package com.bill.services;

import java.util.List;

import com.bill.enums.AccountStatusEnum;
import com.bill.request.dto.AdminLoginRequestDTO;
import com.bill.request.dto.AdminRegisterRequestDTO;
import com.bill.response.dto.AdminLoginResponseDTO;
import com.bill.response.dto.AdminResponseDTO;
import com.bill.response.dto.MonthlyTransactionDTO;
import com.bill.response.dto.UserResponseDTO;

public interface AdminServiceInterface {
	
	public AdminLoginResponseDTO loginAdmin(AdminLoginRequestDTO loginRequest);
	
	public AdminResponseDTO registerAdmin(AdminRegisterRequestDTO registerRequest);
	
	public List<UserResponseDTO> getAllUsers();

	public UserResponseDTO getUserById(int userId);

	public String activateUser(int userId);

	public String deactivateUser(int userId);
	
	public List<AdminResponseDTO> getAllAdmins();

	public AdminResponseDTO getAdminById(int adminId);

	public String activateAdmin(int adminId);

	public String deactivateAdmin(int adminId);

	public List<AdminResponseDTO> getAdminsByStatus(AccountStatusEnum status);
	public List<MonthlyTransactionDTO> getTransactionTimeline();
	public com.bill.response.dto.SystemMonitoringDTO getSystemMonitoring();
	public com.bill.response.dto.AdminDashboardDTO getAdminDashboardAnalytics();

}
