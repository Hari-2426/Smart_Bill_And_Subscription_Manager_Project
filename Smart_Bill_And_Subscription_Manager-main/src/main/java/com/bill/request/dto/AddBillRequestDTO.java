package com.bill.request.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.bill.enums.BillCategory;

import com.bill.enums.RecurrenceType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddBillRequestDTO {
	
	@NotBlank
	private String title;
	private String description;
	private BillCategory category;
	@Positive
	private BigDecimal amount;
	private RecurrenceType recurrence;
	private LocalDate dueDate;
	

}
