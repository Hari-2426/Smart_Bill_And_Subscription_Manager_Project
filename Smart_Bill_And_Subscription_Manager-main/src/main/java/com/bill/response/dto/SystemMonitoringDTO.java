package com.bill.response.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SystemMonitoringDTO {

    private String systemStatus;
    private long totalUsers;
    private long activeUsers;
    private long deactivatedUsers;
    private long totalBills;
    private long totalPayments;
    private long totalAdmins;
    private long activeAdmins;

    // Server & Runtime Stats
    private long uptimeSeconds;
    private long jvmTotalMemoryMb;
    private long jvmUsedMemoryMb;
    private long jvmFreeMemoryMb;
    private int availableProcessors;
    private String javaVersion;
    private String springVersion;

    // Subsystems
    private String databaseStatus;
    private String mailServiceStatus;
    private long timestamp;
}
