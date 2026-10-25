package com.bill.services;

import java.util.List;

import com.bill.enums.BillCategory;
import com.bill.enums.BillStatus;
import com.bill.request.dto.BillRequestDTO;
import com.bill.request.dto.UpdateBillRequestDTO;
import com.bill.response.dto.BillResponseDTO;

public interface BillService {
	
	public BillResponseDTO registerBill(BillRequestDTO addBill);
	
	public BillResponseDTO updateBill(int billId, UpdateBillRequestDTO update);
	
	public String deleteBill(int billId);
	
	public BillResponseDTO getBillById(int billId);
	
	public List<BillResponseDTO> getAllBills();
	
	public List<BillResponseDTO> getBillsByStatus(BillStatus status);
	
	public List<BillResponseDTO> getBillsByCategory(BillCategory category);
	
	public List<BillResponseDTO> getBillsByOverDueDate();
	

}
