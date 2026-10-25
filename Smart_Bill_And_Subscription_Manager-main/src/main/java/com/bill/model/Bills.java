package com.bill.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.bill.enums.BillCategory;
import com.bill.enums.BillStatus;
import com.bill.enums.RecurrenceType;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="bills")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Bills {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int billId;
	
	private String title;
	
	private String description;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private BillCategory category;
	
	@Column(nullable = false)
	private BigDecimal amount;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private BillStatus status;
	
	
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private RecurrenceType recurrence;
	
	@Column(nullable = false)
	private LocalDate dueDate;
	
	@CreationTimestamp
	@Column(updatable = false)
	private LocalDateTime createdAt;
	@UpdateTimestamp
	@Column(updatable = false)
	private LocalDateTime updatedAt;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id",nullable = false)
	private Users billUser;
	
	@OneToMany(mappedBy = "bill", cascade = CascadeType.ALL)
	private List<PaymentHistory> paymentHistory;

	public Bills(String title, String description, BillCategory category, BigDecimal amount, BillStatus status, RecurrenceType recurrence,
			LocalDate dueDate, LocalDateTime createdAt, LocalDateTime updatedAt, Users billUser,
			List<PaymentHistory> paymentHistory) {
		super();
		this.title = title;
		this.description = description;
		this.category = category;
		this.amount = amount;
		this.status = status;
		this.recurrence = recurrence;
		this.dueDate = dueDate;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.billUser = billUser;
		this.paymentHistory = paymentHistory;
	}
	

}
