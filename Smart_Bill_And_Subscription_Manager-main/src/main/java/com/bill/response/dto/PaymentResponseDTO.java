package com.bill.response.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.bill.enums.PaymentStatusEnum;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentResponseDTO {
	
		private int billId;
		
		private String title;
	
		private int paymentId;
	
		private BigDecimal amountPaid;

	    private LocalDateTime paymentDate;
	  
	    private PaymentStatusEnum paymentStatus;

	    private String remarks;
	    
	    

}
