package com.bill.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.bill.dao.AdminRepository;
import com.bill.dao.UsersRepository;
import com.bill.model.Admins;
import com.bill.model.Users;

@Service
public class ApplicationUserDetailsService implements UserDetailsService {

    private final UsersRepository userRepo;
    private final AdminRepository adminRepo;

    public ApplicationUserDetailsService(UsersRepository userRepo,
                                         AdminRepository adminRepo) {
        this.userRepo = userRepo;
        this.adminRepo = adminRepo;
    }

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        Admins admin = adminRepo.findByEmail(email);

        if (admin != null) {
            return new CustomAdminDetails(admin);
        }

        Users user = userRepo.findByEmail(email);

        if (user != null) {
            return new CustomUserDetails(user);
        }

        throw new UsernameNotFoundException(
                "No user found with email : " + email);
    }
}