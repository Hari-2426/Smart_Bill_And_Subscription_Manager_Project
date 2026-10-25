package com.bill.serviceimpl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import java.time.LocalDate;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.bill.dao.AdminRepository;
import com.bill.dao.BillRepository;
import com.bill.dao.PaymentHistoryRepository;
import com.bill.dao.UsersRepository;
import com.bill.enums.AccountStatusEnum;
import com.bill.enums.UserEnum;
import com.bill.model.Admins;
import com.bill.model.Bills;
import com.bill.model.PaymentHistory;
import com.bill.model.Users;
import com.bill.request.dto.AdminLoginRequestDTO;
import com.bill.request.dto.AdminRegisterRequestDTO;
import com.bill.response.dto.AdminDashboardDTO;
import com.bill.response.dto.AdminLoginResponseDTO;
import com.bill.response.dto.AdminResponseDTO;
import com.bill.response.dto.MonthlyTransactionDTO;
import com.bill.response.dto.SystemMonitoringDTO;
import com.bill.response.dto.UserResponseDTO;
import com.bill.security.JwtService;
import com.bill.services.AdminServiceInterface;
import com.bill.services.MailService;

@Service
public class AdminServiceImpl implements AdminServiceInterface {

	@Autowired
	private AdminRepository adminRepo;
	
	@Autowired
	private UsersRepository userRepo;

	@Autowired
	private BillRepository billRepo;
	
	@Autowired
	private JwtService jwtService;
	
	@Autowired
	private AuthenticationManager authenticationManager;
	
	@Autowired
	private PasswordEncoder encoder;
	
	@Autowired
	private MailService emailService;
	
	@Autowired
	private PaymentHistoryRepository paymentRepo;
	
	@Override
	public AdminLoginResponseDTO loginAdmin(AdminLoginRequestDTO loginRequest) {

	    authenticationManager.authenticate(
	            new UsernamePasswordAuthenticationToken(
	                    loginRequest.getEmail(),
	                    loginRequest.getPassword()));

	    Admins admin = adminRepo.findByEmail(loginRequest.getEmail());

	    if (admin == null) {
	        throw new RuntimeException("Admin not found.");
	    }

	    if (admin.getAccountStatus() == AccountStatusEnum.INACTIVE) {
	        throw new RuntimeException("Admin account is deactivated.");
	    }

	    String token = jwtService.generateToken(
	            admin.getEmail(),
	            admin.getRole().name());

	    AdminLoginResponseDTO response = new AdminLoginResponseDTO();

	    BeanUtils.copyProperties(admin, response);

	    response.setToken(token);

	    if (admin.getRole() == UserEnum.SUPER_ADMIN) {
	        response.setMessage("SUPER_ADMIN Login Successful");
	    } else if (admin.getRole() == UserEnum.ADMIN) {
	        response.setMessage("ADMIN Login Successful");
	    }

	    return response;
	}

	@Override
	public AdminResponseDTO registerAdmin(AdminRegisterRequestDTO registerRequest) {
		if (adminRepo.findByEmail(registerRequest.getEmail()) != null) {
			throw new RuntimeException("An administrator with email " + registerRequest.getEmail() + " already exists.");
		}
		
		Admins admin=new Admins();
		admin.setFirstName(registerRequest.getFirstName());
		admin.setLastName(registerRequest.getLastName());
		admin.setEmail(registerRequest.getEmail());
		admin.setPassword(encoder.encode(registerRequest.getPassword()));
		admin.setAccountStatus(AccountStatusEnum.ACTIVE);
		admin.setRole(UserEnum.ADMIN);
		Admins saveAdmin = adminRepo.save(admin);
		emailService.sendAdminRegisteredMail(admin.getFirstName(), admin.getEmail());
		AdminResponseDTO adminResponse=new AdminResponseDTO();
		BeanUtils.copyProperties(saveAdmin, adminResponse);
		
		return adminResponse;
	}

	@Override
	public List<UserResponseDTO> getAllUsers() {

	    List<Users> users = userRepo.findAll();

	    List<UserResponseDTO> response = new ArrayList<>();

	    for (Users user : users) {

	        UserResponseDTO dto = new UserResponseDTO();

	        BeanUtils.copyProperties(user, dto);

	        response.add(dto);
	    }

	    return response;
	}
	@Override
	public UserResponseDTO getUserById(int userId) {

	    Users user = userRepo.findById(userId)
	            .orElseThrow(() -> new RuntimeException("User not found"));

	    UserResponseDTO response = new UserResponseDTO();

	    BeanUtils.copyProperties(user, response);

	    return response;
	}
	@Override
	public String activateUser(int userId) {

	    Users user = userRepo.findById(userId)
	            .orElseThrow(() -> new RuntimeException("User not found"));

	    if (user.getAccountStatus() == AccountStatusEnum.ACTIVE) {
	        throw new RuntimeException("User is already active.");
	    }

	    user.setAccountStatus(AccountStatusEnum.ACTIVE);

	    userRepo.save(user);
	    emailService.sendUserActivatedMail(user.getFirstName(), user.getEmail());
	    return "User activated successfully.";
	}
	@Override
	public String deactivateUser(int userId) {

	    Users user = userRepo.findById(userId)
	            .orElseThrow(() -> new RuntimeException("User not found"));

	    if (user.getAccountStatus() == AccountStatusEnum.INACTIVE) {
	        throw new RuntimeException("User is already inactive.");
	    }

	    user.setAccountStatus(AccountStatusEnum.INACTIVE);

	    userRepo.save(user);
	    emailService.sendUserDeactivatedMail(user.getFirstName(), user.getEmail());
	    return "User deactivated successfully.";
	}

	@Override
	public List<AdminResponseDTO> getAllAdmins() {
		List<Admins> admins = adminRepo.findAll();
		
		List<AdminResponseDTO> adminResponse=new ArrayList<AdminResponseDTO>();
		for(Admins admin:admins)
		{
			AdminResponseDTO response=new AdminResponseDTO();
			BeanUtils.copyProperties(admin, response);
			adminResponse.add(response);
		}
		return adminResponse;
	}
	@Override
	public AdminResponseDTO getAdminById(int adminId) {

	    Admins admin = adminRepo.findById(adminId)
	            .orElseThrow(() -> new RuntimeException("Admin not found"));

	    if (admin.getRole() == UserEnum.SUPER_ADMIN) {
	        throw new RuntimeException("Cannot access SUPER_ADMIN details.");
	    }

	    AdminResponseDTO response = new AdminResponseDTO();
	    BeanUtils.copyProperties(admin, response);

	    return response;
	}
	@Override
	public String activateAdmin(int adminId) {

	    Admins admin = adminRepo.findById(adminId)
	            .orElseThrow(() -> new RuntimeException("Admin not found"));

	    if (admin.getRole() == UserEnum.SUPER_ADMIN) {
	        throw new RuntimeException("SUPER_ADMIN cannot be modified.");
	    }

	    if (admin.getAccountStatus() == AccountStatusEnum.ACTIVE) {
	        throw new RuntimeException("Admin is already active.");
	    }

	    admin.setAccountStatus(AccountStatusEnum.ACTIVE);

	    adminRepo.save(admin);
	    emailService.sendAdminActivatedMail(admin.getFirstName(), admin.getEmail());

	    return "Admin activated successfully.";
	}
	@Override
	public String deactivateAdmin(int adminId) {

	    Admins admin = adminRepo.findById(adminId)
	            .orElseThrow(() -> new RuntimeException("Admin not found"));

	    if (admin.getRole() == UserEnum.SUPER_ADMIN) {
	        throw new RuntimeException("SUPER_ADMIN cannot be deactivated.");
	    }

	    if (admin.getAccountStatus() == AccountStatusEnum.INACTIVE) {
	        throw new RuntimeException("Admin is already inactive.");
	    }

	    admin.setAccountStatus(AccountStatusEnum.INACTIVE);

	    adminRepo.save(admin);
	    emailService.sendAdminDeactivatedMail(admin.getFirstName(), admin.getEmail());

	    return "Admin deactivated successfully.";
	}
	@Override
	public List<AdminResponseDTO> getAdminsByStatus(AccountStatusEnum status) {

	    List<Admins> admins =
	            adminRepo.findByRoleAndAccountStatus(UserEnum.ADMIN, status);

	    List<AdminResponseDTO> responseList = new ArrayList<>();

	    for (Admins admin : admins) {

	        AdminResponseDTO response = new AdminResponseDTO();

	        BeanUtils.copyProperties(admin, response);

	        responseList.add(response);
	    }

	    return responseList;
	}

	@Override
	public List<MonthlyTransactionDTO> getTransactionTimeline() {

	    List<Object[]> result = paymentRepo.getTransactionTimeline();

	    String[] months = {
	            "",
	            "January",
	            "February",
	            "March",
	            "April",
	            "May",
	            "June",
	            "July",
	            "August",
	            "September",
	            "October",
	            "November",
	            "December"
	    };

	    List<MonthlyTransactionDTO> response = new ArrayList<>();

	    for (Object[] row : result) {

	        int monthNumber = ((Number) row[0]).intValue();

	        BigDecimal paymentVolume = (BigDecimal) row[1];

	        response.add(
	                new MonthlyTransactionDTO(
	                        months[monthNumber],
	                        paymentVolume
	                )
	        );
	    }

	    return response;
	}

	@Override
	public SystemMonitoringDTO getSystemMonitoring() {
		long totalUsers = userRepo.count();
		long activeUsers = userRepo.findByAccountStatus(AccountStatusEnum.ACTIVE).size();
		long deactivatedUsers = Math.max(0, totalUsers - activeUsers);
		long totalBills = billRepo.count();
		long totalPayments = paymentRepo.count();
		long totalAdmins = adminRepo.count();
		long activeAdmins = adminRepo.findByRoleAndAccountStatus(UserEnum.ADMIN, AccountStatusEnum.ACTIVE).size();

		Runtime runtime = Runtime.getRuntime();
		long totalMem = runtime.totalMemory() / (1024 * 1024);
		long freeMem = runtime.freeMemory() / (1024 * 1024);
		long usedMem = totalMem - freeMem;
		long uptimeSec = java.lang.management.ManagementFactory.getRuntimeMXBean().getUptime() / 1000;

		return SystemMonitoringDTO.builder()
				.systemStatus("OPERATIONAL")
				.totalUsers(totalUsers)
				.activeUsers(activeUsers)
				.deactivatedUsers(deactivatedUsers)
				.totalBills(totalBills)
				.totalPayments(totalPayments)
				.totalAdmins(totalAdmins)
				.activeAdmins(activeAdmins)
				.uptimeSeconds(uptimeSec)
				.jvmTotalMemoryMb(totalMem)
				.jvmUsedMemoryMb(usedMem)
				.jvmFreeMemoryMb(freeMem)
				.availableProcessors(runtime.availableProcessors())
				.javaVersion(System.getProperty("java.version"))
				.springVersion(org.springframework.core.SpringVersion.getVersion())
				.databaseStatus("CONNECTED (Neon PostgreSQL)")
				.mailServiceStatus("ACTIVE (smtp.gmail.com:587)")
				.timestamp(System.currentTimeMillis())
				.build();
	}

	@Override
	public AdminDashboardDTO getAdminDashboardAnalytics() {
		List<Users> allUsers = userRepo.findAll();
		long totalUsers = allUsers.size();
		long activeUsers = allUsers.stream().filter(u -> u.getAccountStatus() == AccountStatusEnum.ACTIVE).count();
		long deactivatedUsers = Math.max(0, totalUsers - activeUsers);

		LocalDate now = LocalDate.now();
		long newUsersThisMonth = allUsers.stream()
				.filter(u -> u.getCreatedAt() != null && u.getCreatedAt().getMonthValue() == now.getMonthValue() && u.getCreatedAt().getYear() == now.getYear())
				.count();

		List<Admins> allAdmins = adminRepo.findAll();
		long totalAdmins = allAdmins.size();
		long superAdmins = allAdmins.stream().filter(a -> a.getRole() == UserEnum.SUPER_ADMIN).count();
		long standardAdmins = allAdmins.stream().filter(a -> a.getRole() == UserEnum.ADMIN).count();
		long activeAdmins = allAdmins.stream().filter(a -> a.getAccountStatus() == AccountStatusEnum.ACTIVE).count();

		long totalBills = billRepo.count();
		long totalPayments = paymentRepo.count();

		List<MonthlyTransactionDTO> timeline = getTransactionTimeline();
		BigDecimal totalSettledVolume = BigDecimal.ZERO;
		for (MonthlyTransactionDTO item : timeline) {
			if (item.getTransactionCount() != null) {
				totalSettledVolume = totalSettledVolume.add(item.getTransactionCount());
			}
		}

		List<AdminDashboardDTO.UserActivitySummaryDTO> userActivities = new ArrayList<>();
		for (Users u : allUsers) {
			List<Bills> userBills = billRepo.findByBillUser(u);
			BigDecimal totalBillsAmount = BigDecimal.ZERO;
			for (Bills b : userBills) {
				if (b.getAmount() != null) {
					totalBillsAmount = totalBillsAmount.add(b.getAmount());
				}
			}

			List<PaymentHistory> userPayments = paymentRepo.findByBill_BillUser(u);
			BigDecimal totalPaidAmount = BigDecimal.ZERO;
			for (PaymentHistory p : userPayments) {
				if (p.getAmountPaid() != null) {
					totalPaidAmount = totalPaidAmount.add(p.getAmountPaid());
				}
			}

			String regDate = u.getCreatedAt() != null ? u.getCreatedAt().toLocalDate().toString() : "N/A";

			userActivities.add(AdminDashboardDTO.UserActivitySummaryDTO.builder()
					.userId(u.getUserId())
					.fullName(u.getFirstName() + " " + u.getLastName())
					.email(u.getEmail())
					.accountStatus(u.getAccountStatus() != null ? u.getAccountStatus().name() : "ACTIVE")
					.totalBillsCount(userBills.size())
					.totalBillsAmount(totalBillsAmount)
					.paidPaymentsCount(userPayments.size())
					.totalPaidAmount(totalPaidAmount)
					.registeredDate(regDate)
					.build());
		}

		return AdminDashboardDTO.builder()
				.totalUsers(totalUsers)
				.activeUsers(activeUsers)
				.deactivatedUsers(deactivatedUsers)
				.newUsersThisMonth(newUsersThisMonth)
				.totalAdmins(totalAdmins)
				.superAdmins(superAdmins)
				.standardAdmins(standardAdmins)
				.activeAdmins(activeAdmins)
				.totalBills(totalBills)
				.totalPayments(totalPayments)
				.totalSettledVolume(totalSettledVolume)
				.monthlyTimeline(timeline)
				.userActivities(userActivities)
				.build();
	}
}
