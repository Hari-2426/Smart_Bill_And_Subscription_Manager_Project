package com.bill.services;

import java.util.List;

import com.bill.enums.PaymentStatusEnum;
import com.bill.request.dto.PaymentRequestDTO;
import com.bill.response.dto.PaymentResponseDTO;

public interface PaymentHistoryInterface {
	
	public PaymentResponseDTO payBill(PaymentRequestDTO paymentRequest);
	public List<PaymentResponseDTO> getMyPaymentHistory();
	public PaymentResponseDTO getPaymentByPaymentId(int paymentId);
	public List<PaymentResponseDTO> getPaymentsByStatus(PaymentStatusEnum status);
	List<PaymentResponseDTO> getPaymentsByBillId(int billId);
	
}
