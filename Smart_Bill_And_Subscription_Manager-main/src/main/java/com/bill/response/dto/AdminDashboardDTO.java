package com.bill.response.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdminDashboardDTO {

    // User Metrics
    private long totalUsers;
    private long activeUsers;
    private long deactivatedUsers;
    private long newUsersThisMonth;

    // Admin Metrics
    private long totalAdmins;
    private long superAdmins;
    private long standardAdmins;
    private long activeAdmins;

    // Billing & Payment Totals
    private long totalBills;
    private long totalPayments;
    private BigDecimal totalSettledVolume;

    // Monthly Trends
    private List<MonthlyTransactionDTO> monthlyTimeline;

    // User Activity Summaries
    private List<UserActivitySummaryDTO> userActivities;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class UserActivitySummaryDTO {
        private int userId;
        private String fullName;
        private String email;
        private String accountStatus;
        private int totalBillsCount;
        private BigDecimal totalBillsAmount;
        private int paidPaymentsCount;
        private BigDecimal totalPaidAmount;
        private String registeredDate;
    }
}
