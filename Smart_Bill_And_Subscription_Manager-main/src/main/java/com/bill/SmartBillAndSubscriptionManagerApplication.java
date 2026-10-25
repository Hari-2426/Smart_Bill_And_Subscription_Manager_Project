package com.bill;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
@EnableMethodSecurity
@EnableScheduling
@EnableAsync
public class SmartBillAndSubscriptionManagerApplication {

	public static void main(String[] args) {
		
		// System.out.println(new BCryptPasswordEncoder().encode("NANDAN@2005"));
		SpringApplication.run(SmartBillAndSubscriptionManagerApplication.class, args);
	}

}
