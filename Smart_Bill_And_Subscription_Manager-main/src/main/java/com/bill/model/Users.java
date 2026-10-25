package com.bill.model;

import java.time.LocalDateTime;

import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import com.bill.enums.AccountStatusEnum;
import com.bill.enums.UserEnum;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Entity
@Table(name="billusers")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Users {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int userId;
	
	@Column(nullable = false)
	private String firstName;
	@Column(nullable = false)
	private String lastName;
	
	@Email
	@NotNull
	private String email;
	
	private String password;
	
	@Column(length = 20)
	@Enumerated(EnumType.STRING)
	private UserEnum role = UserEnum.USER;

	@Enumerated(EnumType.STRING)
	private AccountStatusEnum accountStatus;
	
	@CreationTimestamp
	@Column(updatable = false)
	private LocalDateTime createdAt;
	
	@OneToMany(mappedBy = "billUser",cascade = CascadeType.ALL)
	
	private List<Bills> bills;
	
	private String address;
	
	private long phoneNumber;

	public Users(String firstName, String lastName, @Email @NotNull String email, String password, UserEnum role,
			AccountStatusEnum accountStatus, LocalDateTime createdAt, String address, long phoneNumber, List<Bills> bills) {
		super();
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.password = password;
		this.role = role;
		this.accountStatus = accountStatus;
		this.createdAt = createdAt;
		this.address = address;
		this.phoneNumber = phoneNumber;
		this.bills = bills;
	}
	
	

}
