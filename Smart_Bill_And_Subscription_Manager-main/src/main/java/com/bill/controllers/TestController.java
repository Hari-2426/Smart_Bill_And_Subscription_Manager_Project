package com.bill.controllers;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
	
	@GetMapping("/test/hello")
	public String helloUser()
	{
		return "Hello User welcome to Smart Bill";
	}
	
	@GetMapping("/health")
	public Map<String, String> healthCheck()
	{
		return Map.of("status", "UP", "message", "SmartBill Backend is active and healthy");
	}

}
