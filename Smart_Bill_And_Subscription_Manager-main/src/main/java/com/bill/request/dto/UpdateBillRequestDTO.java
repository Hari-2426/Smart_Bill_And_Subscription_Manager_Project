package com.bill.request.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.bill.enums.BillCategory;
import com.bill.enums.RecurrenceType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateBillRequestDTO {
	
	private String title;
	private String description;
	private BillCategory category;
	private BigDecimal amount;
	private RecurrenceType recurrence;
	private LocalDate dueDate;

}
