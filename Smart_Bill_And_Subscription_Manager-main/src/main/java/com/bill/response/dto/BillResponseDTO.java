package com.bill.response.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.bill.enums.BillCategory;
import com.bill.enums.BillStatus;
import com.bill.enums.RecurrenceType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BillResponseDTO {
	
	private int billId;
	
	private String title;
	
	private String description;
	
	private BillCategory category;
	
	private BigDecimal amount;
	
	
	private BillStatus status;
	
	private RecurrenceType recurrence;
	
	private LocalDate dueDate;
	
	private LocalDateTime createdAt;
	
	private LocalDateTime updatedAt;

}