package com.bill.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bill.enums.AccountStatusEnum;
import com.bill.enums.UserEnum;
import com.bill.model.Admins;

@Repository
public interface AdminRepository extends JpaRepository<Admins, Integer>{
	
	public Admins findByEmail(String email);

	public List<Admins> findByRoleAndAccountStatus(UserEnum admin, AccountStatusEnum status);

}
