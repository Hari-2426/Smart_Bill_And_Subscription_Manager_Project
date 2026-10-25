package com.bill.dao;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bill.enums.BillCategory;
import com.bill.enums.BillStatus;
import com.bill.model.Bills;
import com.bill.model.Users;

@Repository
public interface BillRepository extends JpaRepository<Bills, Integer> {
	
	List<Bills> findByBillUser(Users user);
	List<Bills> findByBillUserAndStatus(Users user, BillStatus status);

	List<Bills> findByBillUserAndCategory(Users user, BillCategory category);

	List<Bills> findByBillUserAndDueDateBeforeAndStatus(Users user,LocalDate date,BillStatus status);
	
	List<Bills> findByDueDate(LocalDate dueDate);

}