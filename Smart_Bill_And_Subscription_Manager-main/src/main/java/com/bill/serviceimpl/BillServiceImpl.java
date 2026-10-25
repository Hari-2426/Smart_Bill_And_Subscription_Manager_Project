package com.bill.serviceimpl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.bill.dao.BillRepository;
import com.bill.dao.UsersRepository;
import com.bill.enums.AccountStatusEnum;
import com.bill.enums.BillCategory;
import com.bill.enums.BillStatus;
import com.bill.model.Bills;
import com.bill.model.Users;
import com.bill.request.dto.BillRequestDTO;
import com.bill.request.dto.UpdateBillRequestDTO;
import com.bill.response.dto.BillResponseDTO;
import com.bill.services.BillService;
import com.bill.services.MailService;

@Service
public class BillServiceImpl implements BillService {
	
	@Autowired
	private UsersRepository userRepo;
	
	
	@Autowired
	private BillRepository billRepo;
	
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
	public BillResponseDTO registerBill(BillRequestDTO addBill) {
		
		Users user=getLoggedInActiveUser();
		Bills bill=new Bills();
		bill.setBillUser(user);
		bill.setTitle(addBill.getTitle());
		bill.setDescription(addBill.getDescription());
		bill.setCategory(addBill.getCategory());
		bill.setRecurrence(addBill.getRecurrence());
		bill.setAmount(addBill.getAmount());
		LocalDate dueDate = addBill.getDueDate();
		if(dueDate.isBefore(LocalDate.now()))
		{
			throw new RuntimeException("Due date cannot be in the past.");
		}
		bill.setDueDate(addBill.getDueDate());
		bill.setStatus(BillStatus.PENDING);
		Bills savedBill = billRepo.save(bill);
		emailService.sendBillCreatedMail(user.getFirstName(),user.getEmail(), bill.getTitle(), bill.getAmount(),bill.getDueDate());
		BillResponseDTO billResponse=new BillResponseDTO();
		BeanUtils.copyProperties(savedBill, billResponse);
		
		return billResponse;
	}

	/**
	 *
	 */
	@SuppressWarnings("unused")
	@Override
	public BillResponseDTO updateBill(int billId,UpdateBillRequestDTO update) {
		Users user=getLoggedInActiveUser();
		Bills bill = billRepo.findById(billId).orElseThrow(()->new RuntimeException("Bill Not Found"));
		if (bill.getBillUser().getUserId() != user.getUserId())
		{
		    throw new RuntimeException("Access Denied");
		}
		
		if(bill==null)
		{
			throw new RuntimeException("Bill Not Found");
		}
		
		if(update.getTitle()!=null)
			bill.setTitle(update.getTitle());
		if(update.getDescription()!=null)
			bill.setDescription(update.getDescription());
		if(update.getCategory()!=null)
			bill.setCategory(update.getCategory());
		
		if (update.getAmount() != null && update.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
		    throw new RuntimeException("Amount must be greater than zero.");
		}
		if(update.getAmount()!=null)
			bill.setAmount(update.getAmount());
		
		if(update.getRecurrence()!=null)
			bill.setRecurrence(update.getRecurrence());
		
		
		if (update.getDueDate() != null && update.getDueDate().isBefore(LocalDate.now())) {
		    throw new RuntimeException("Due date cannot be in the past.");
		}
		if(update.getDueDate()!=null)
			bill.setDueDate(update.getDueDate());
		Bills savedUpdatedBill = billRepo.save(bill);
		BillResponseDTO billResponse=new BillResponseDTO();
		BeanUtils.copyProperties(savedUpdatedBill, billResponse);
		
		return billResponse;
	}

	
	@Override
	public String deleteBill(int billId) {
		
		
		Users user=getLoggedInActiveUser();
		Bills bill = billRepo.findById(billId).orElseThrow(() -> new RuntimeException("Bill not found"));
//		System.out.println("Logged-in User ID : " + user.getUserId());
//
//		System.out.println("Bill Owner ID : " + bill.getBillUser().getUserId());
		//Checking Ownership
		if(bill.getBillUser().getUserId()!=user.getUserId())
		{
			throw new RuntimeException("Access Denined");
		}
		if(bill.getStatus()==BillStatus.PAID)
		{
			throw new RuntimeException("Cannot delete paid bills");
		}
		
			billRepo.delete(bill);
			emailService.sendBillDeletedMail(user.getFirstName(), user.getEmail(), bill.getTitle());
		
		return "Bill Deleted Successfully";
	}

	@Override
	public List<BillResponseDTO> getAllBills() {
		
		Users user=getLoggedInActiveUser();
		
		List<Bills> bills= billRepo.findByBillUser(user);
		
		List<BillResponseDTO> billsResponse=new ArrayList<BillResponseDTO>();
		for(Bills bill:bills)
		{
			BillResponseDTO response=new BillResponseDTO();
			BeanUtils.copyProperties(bill, response);
			billsResponse.add(response);
		}
		
		return billsResponse;
	}

	@Override
	public BillResponseDTO getBillById(int billId) {
		Users user=getLoggedInActiveUser();
		Bills bill = billRepo.findById(billId).orElseThrow(()->new RuntimeException("Bill not found"));
		if(bill.getBillUser().getUserId()!=user.getUserId())
		{
			throw new RuntimeException("Access Denined");
		}
		BillResponseDTO billResponse = new BillResponseDTO();
		BeanUtils.copyProperties(bill, billResponse);
		return billResponse;
	}

	@Override
	public List<BillResponseDTO> getBillsByStatus(BillStatus status) {
		Users user=getLoggedInActiveUser();
		if(status==null)
		{
			throw new RuntimeException("Status can't be empty");
		}
		List<Bills> byBillUserAndStatus = billRepo.findByBillUserAndStatus(user, status);
		List<BillResponseDTO> billResponse=new ArrayList<BillResponseDTO>();
		for(Bills bill:byBillUserAndStatus)
		{
			BillResponseDTO response=new BillResponseDTO();
			BeanUtils.copyProperties(bill, response);
			billResponse.add(response);
		}
		return billResponse;
	}

	@Override
	public List<BillResponseDTO> getBillsByCategory(BillCategory category) {
		Users user=getLoggedInActiveUser();
		if(category==null)
		{
			throw new RuntimeException("Status can't be empty");
		}
		List<Bills> byBillUserAndCategory = billRepo.findByBillUserAndCategory(user, category);
		List<BillResponseDTO> billResponse=new ArrayList<BillResponseDTO>();
		for(Bills bill:byBillUserAndCategory)
		{
			BillResponseDTO response=new BillResponseDTO();
			BeanUtils.copyProperties(bill, response);
			billResponse.add(response);
		}
		return billResponse;
		
	}

	@Override
	public List<BillResponseDTO> getBillsByOverDueDate() {
		
		Users user=getLoggedInActiveUser();
		List<Bills> overDueBills = billRepo.findByBillUserAndDueDateBeforeAndStatus(user, LocalDate.now(), BillStatus.PENDING);
		List<BillResponseDTO> response = new ArrayList<>();

	    for (Bills bill : overDueBills) {

	        BillResponseDTO dto = new BillResponseDTO();
	        BeanUtils.copyProperties(bill, dto);
	        response.add(dto);
	    }
		return response;
	}
	
	
	
	

}
