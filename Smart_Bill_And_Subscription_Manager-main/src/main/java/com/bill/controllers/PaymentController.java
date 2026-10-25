package com.bill.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bill.enums.PaymentStatusEnum;
import com.bill.request.dto.PaymentRequestDTO;
import com.bill.response.dto.PaymentResponseDTO;
import com.bill.services.PaymentHistoryInterface;

@RestController
@RequestMapping("/payments")
public class PaymentController {
	
	@Autowired
	private PaymentHistoryInterface paymentHistoryService;
	
	
	@PostMapping("/paybill")
	public PaymentResponseDTO payBill(@RequestBody PaymentRequestDTO requestPayment)
	{
		return paymentHistoryService.payBill(requestPayment);
	}

	@GetMapping("/history")
	public List<PaymentResponseDTO> getMyPaymentHistory() {
	    return paymentHistoryService.getMyPaymentHistory();
	}
	@GetMapping("/bill/{billId}")
	public List<PaymentResponseDTO> getPaymentsByBillId(@PathVariable int billId) {

	    return paymentHistoryService.getPaymentsByBillId(billId);
	}
	@GetMapping("/{paymentId}")
	public PaymentResponseDTO getPaymentByPaymentId(@PathVariable int paymentId) {
	    return paymentHistoryService.getPaymentByPaymentId(paymentId);
	}
	@GetMapping("/status/{status}")
	public List<PaymentResponseDTO> getPaymentsByStatus(@PathVariable PaymentStatusEnum status) {

	    return paymentHistoryService.getPaymentsByStatus(status);
	}
}
