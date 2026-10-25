package com.bill.serviceimpl;



import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.bill.dao.BillRepository;
import com.bill.dao.PaymentHistoryRepository;
import com.bill.dao.UsersRepository;
import com.bill.enums.AccountStatusEnum;
import com.bill.enums.BillStatus;
import com.bill.enums.PaymentStatusEnum;
import com.bill.model.Bills;
import com.bill.model.PaymentHistory;
import com.bill.model.Users;
import com.bill.request.dto.PaymentRequestDTO;
import com.bill.response.dto.PaymentResponseDTO;
import com.bill.services.MailService;
import com.bill.services.PaymentHistoryInterface;

@Service
public class PaymentHistoryImpl implements PaymentHistoryInterface {
	
	
	@Autowired
	private UsersRepository userRepo;
	
	@Autowired
	private BillRepository billRepo;
	
	@Autowired
	private PaymentHistoryRepository paymentRepo;
	
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
	 public PaymentResponseDTO payBill(PaymentRequestDTO paymentRequest) {

	     Users user = getLoggedInActiveUser();

	     Bills bill = billRepo.findById(paymentRequest.getBillId())
	             .orElseThrow(() -> new RuntimeException("Bill not found"));

	     
	     if (bill.getBillUser().getUserId() != user.getUserId()) {
	         throw new RuntimeException("Access Denied");
	     }

	    
	     if (bill.getStatus() == BillStatus.PAID) {
	         throw new RuntimeException("Bill is already paid");
	     }

	    
	     if (bill.getAmount().compareTo(paymentRequest.getAmountPaid()) != 0) {
	         throw new RuntimeException("Invalid payment amount");
	     }

	    
	     PaymentHistory payment = new PaymentHistory();

	     payment.setBill(bill);
	     payment.setAmountPaid(paymentRequest.getAmountPaid());
	     payment.setPaymentStatus(PaymentStatusEnum.COMPLETED);

	     if (paymentRequest.getRemarks() != null && !paymentRequest.getRemarks().trim().isEmpty()) {
	         payment.setRemarks(paymentRequest.getRemarks());
	     }

	     PaymentHistory savedPayment = paymentRepo.save(payment);

	     
	     bill.setStatus(BillStatus.PAID);
	     billRepo.save(bill);
	   
	     emailService.sendPaymentSuccessMail(user.getFirstName(), user.getEmail(), bill.getTitle(), bill.getAmount());
	     
	     PaymentResponseDTO response = new PaymentResponseDTO();

	     response.setPaymentId(savedPayment.getPaymentId());
	     response.setBillId(bill.getBillId());
	     response.setTitle(bill.getTitle());
	     response.setAmountPaid(savedPayment.getAmountPaid());
	     response.setPaymentDate(savedPayment.getPaymentDate());
	     response.setPaymentStatus(savedPayment.getPaymentStatus());
	     response.setRemarks(savedPayment.getRemarks());

	     return response;
	 }
	 @Override
	 public List<PaymentResponseDTO> getMyPaymentHistory() {

	     Users user = getLoggedInActiveUser();

	     List<PaymentHistory> payments = paymentRepo.findByBill_BillUser(user);

	     List<PaymentResponseDTO> response = new ArrayList<>();

	     for (PaymentHistory payment : payments) {

	         PaymentResponseDTO dto = new PaymentResponseDTO();

	         dto.setPaymentId(payment.getPaymentId());
	         dto.setBillId(payment.getBill().getBillId());
	         dto.setTitle(payment.getBill().getTitle());
	         dto.setAmountPaid(payment.getAmountPaid());
	         dto.setPaymentDate(payment.getPaymentDate());
	         dto.setPaymentStatus(payment.getPaymentStatus());
	         dto.setRemarks(payment.getRemarks());

	         response.add(dto);
	     }

	     return response;
	 }

	 @Override
	 public PaymentResponseDTO getPaymentByPaymentId(int paymentId) {
		 
		 Users user=getLoggedInActiveUser();
		 PaymentHistory payment = paymentRepo.findById(paymentId).orElseThrow(()->new RuntimeException("Payment Not Found"));
		 if(user.getUserId()!=payment.getBill().getBillUser().getUserId())
		 {
			 throw new RuntimeException("Access Denined");
		 }
		 

			
		 PaymentResponseDTO paymentResponse=new PaymentResponseDTO();
		 BeanUtils.copyProperties(payment, paymentResponse);
		 paymentResponse.setBillId(payment.getBill().getBillId());
		 paymentResponse.setTitle(payment.getBill().getTitle());
		 
		 return paymentResponse;
	 }

	 @Override
	 public List<PaymentResponseDTO> getPaymentsByStatus(PaymentStatusEnum status) {
		Users user=getLoggedInActiveUser();
		List<PaymentHistory> payments = paymentRepo.findByBill_BillUserAndPaymentStatus(user, status);
		if (payments.isEmpty()) {
		    throw new RuntimeException("No payments found with status: " + status);
		}
		List<PaymentResponseDTO> paymentResponse=new ArrayList<PaymentResponseDTO>();
		for(PaymentHistory payment:payments)
		{
			PaymentResponseDTO response=new PaymentResponseDTO();
			BeanUtils.copyProperties(payment, response);
			response.setBillId(payment.getBill().getBillId());
			response.setTitle(payment.getBill().getTitle());
			paymentResponse.add(response);
		}
		return paymentResponse;
	 }
	 @Override
	 public List<PaymentResponseDTO> getPaymentsByBillId(int billId) {

	     Users user = getLoggedInActiveUser();

	     Bills bill = billRepo.findById(billId)
	             .orElseThrow(() -> new RuntimeException("Bill not found"));

	     // Ownership Check
	     if (bill.getBillUser().getUserId() != user.getUserId()) {
	         throw new RuntimeException("Access Denied");
	     }

	     List<PaymentHistory> payments = paymentRepo.findByBill(bill);

	     List<PaymentResponseDTO> responseList = new ArrayList<>();

	     for (PaymentHistory payment : payments) {

	         PaymentResponseDTO response = new PaymentResponseDTO();

	         BeanUtils.copyProperties(payment, response);

	         response.setBillId(bill.getBillId());
	         response.setTitle(bill.getTitle());

	         responseList.add(response);
	     }

	     return responseList;
	 }

}
