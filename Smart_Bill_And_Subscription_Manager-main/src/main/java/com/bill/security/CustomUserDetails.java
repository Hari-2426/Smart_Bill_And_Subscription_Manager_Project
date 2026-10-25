package com.bill.security;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.bill.enums.AccountStatusEnum;
import com.bill.model.Users;




@SuppressWarnings("serial")
public class CustomUserDetails implements UserDetails {
	
private Users user;
	
	public CustomUserDetails(Users user) {
		this.user=user;
	}


	@Override
	public String getPassword() {
		// TODO Auto-generated method stub
		return user.getPassword();
	}

	@Override
	public String getUsername() {
		// TODO Auto-generated method stub
		return user.getEmail();
	}
	
	
//Store in DB Like this if you don't prepend ROLE_
//	ROLE_USER
//	ROLE_ADMIN
//	ROLE_SUPER_ADMIN
	@Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
		return Collections.singletonList(new SimpleGrantedAuthority("ROLE_"+user.getRole()));
	}
	
	@Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return user.getAccountStatus() == AccountStatusEnum.ACTIVE;
    }

    public Users getUser() {
        return user;
    }

}
