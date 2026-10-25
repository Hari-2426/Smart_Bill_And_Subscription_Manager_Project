package com.bill.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import com.bill.enums.BillCategory;
import com.bill.enums.BillStatus;
import com.bill.request.dto.BillRequestDTO;
import com.bill.request.dto.UpdateBillRequestDTO;
import com.bill.response.dto.BillResponseDTO;
import com.bill.services.BillService;

@RestController
@RequestMapping("/bills")
public class BillsController {
	
	@Autowired
	private BillService billService;
	
	@PostMapping("/registerBill")
	public BillResponseDTO registerNewBill(@RequestBody BillRequestDTO addNewBill)
	{
		return billService.registerBill(addNewBill);
	}
	
	@PatchMapping("/updateBill/{billId}")
	public BillResponseDTO updateBill(
	        @PathVariable int billId,
	        @RequestBody UpdateBillRequestDTO updateBillRequest) {

	    return billService.updateBill(billId, updateBillRequest);
	}
	
	@DeleteMapping("/deleteBill/{billId}")
	public String deleteExistingBill(@PathVariable int billId)
	{
		return billService.deleteBill(billId);
	}

	
	@GetMapping("/overdue")
	public List<BillResponseDTO> getOverDueBills() {
	    return billService.getBillsByOverDueDate();
	}
	
	@GetMapping("/allBills")
	public List<BillResponseDTO> getAllBills()
	{
		return billService.getAllBills();
	}
	
	@GetMapping("/billId/{billId}")
	public BillResponseDTO getBillById(@PathVariable int billId)
	{
		return billService.getBillById(billId);
	}
	
	@GetMapping("/category/{category}")
	public List<BillResponseDTO> getBillsByCategory(@PathVariable BillCategory category)
	{
		return billService.getBillsByCategory(category);
	}
	
	
	@GetMapping("/billStatus/{status}")
	public List<BillResponseDTO> getBillsByStatus(@PathVariable BillStatus status)
	{
		return billService.getBillsByStatus(status);
	}
	
}
