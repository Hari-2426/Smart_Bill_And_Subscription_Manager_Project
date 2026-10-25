package com.bill.model;

import java.util.Date;

import org.hibernate.annotations.CreationTimestamp;

import com.bill.enums.AccountStatusEnum;
import com.bill.enums.UserEnum;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="admins")
public class Admins {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int adminId;
	
	@Column(nullable = false)
	private String firstName;
	@Column(nullable = false)
	private String lastName;
	
	@Email
	@Column(unique = true)
	@NotNull
	private String email;
	
	private String password;
	
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private UserEnum role;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private AccountStatusEnum accountStatus;
	
	@CreationTimestamp
	@Column(updatable = false)
	private Date createdAt;

	public Admins(String firstName, String lastName, @Email @NotNull String email, String password, UserEnum role,
			AccountStatusEnum accountStatus, Date createdAt) {
		super();
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.password = password;
		this.role = role;
		this.accountStatus = accountStatus;
		this.createdAt = createdAt;
	}

}
