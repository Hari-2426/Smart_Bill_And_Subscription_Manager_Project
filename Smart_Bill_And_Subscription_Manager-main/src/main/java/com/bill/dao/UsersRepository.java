package com.bill.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bill.enums.AccountStatusEnum;
import com.bill.model.Users;

@Repository
public interface UsersRepository extends JpaRepository<Users, Integer>{
	
	public Users findByEmail(String email);
	List<Users> findByAccountStatus(AccountStatusEnum accountStatus);

}
