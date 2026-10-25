package com.bill.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.bill.enums.PaymentStatusEnum;

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
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "payments_history")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int paymentId;

    @Column(nullable = false)
    private BigDecimal amountPaid;

    @Column(nullable = false,updatable = false)
    @CreationTimestamp
    private LocalDateTime paymentDate;
       
    @Enumerated(EnumType.STRING)
	@Column(nullable = false)
    private PaymentStatusEnum paymentStatus;

    private String remarks;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bill_id", nullable = false)
    private Bills bill;

	public PaymentHistory(BigDecimal amountPaid, LocalDateTime paymentDate,
			PaymentStatusEnum paymentStatus, String remarks, Bills bill) {
		super();
		this.amountPaid = amountPaid;
		this.paymentDate = paymentDate;
		
		this.paymentStatus = paymentStatus;
		this.remarks = remarks;
		this.bill = bill;
	}
    
    

}