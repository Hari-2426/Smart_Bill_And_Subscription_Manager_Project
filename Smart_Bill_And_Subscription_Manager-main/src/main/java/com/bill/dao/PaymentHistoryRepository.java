package com.bill.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.bill.enums.PaymentStatusEnum;
import com.bill.model.Bills;
import com.bill.model.PaymentHistory;
import com.bill.model.Users;

@Repository
public interface PaymentHistoryRepository extends JpaRepository<PaymentHistory, Integer> {
	
	List<PaymentHistory> findByBill_BillUser(Users user);
	List<PaymentHistory> findByBill(Bills bill);
	List<PaymentHistory> findByBill_BillUserAndPaymentStatus(Users user,PaymentStatusEnum paymentStatus);
	@Query("""
			SELECT
			MONTH(p.paymentDate),
			COALESCE(SUM(p.amountPaid),0)
			FROM PaymentHistory p
			GROUP BY MONTH(p.paymentDate)
			ORDER BY MONTH(p.paymentDate)
			""")
			List<Object[]> getTransactionTimeline();


}
