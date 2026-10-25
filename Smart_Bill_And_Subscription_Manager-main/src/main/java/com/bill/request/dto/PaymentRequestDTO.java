package com.bill.request.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentRequestDTO {
	
	
	private int billId;
	private BigDecimal amountPaid;
	private String remarks;
	

}
