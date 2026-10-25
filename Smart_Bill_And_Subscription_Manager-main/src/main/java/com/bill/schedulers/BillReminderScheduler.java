package com.bill.schedulers;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.bill.dao.BillRepository;
import com.bill.model.Bills;
import com.bill.services.MailService;

import jakarta.transaction.Transactional;

@Component
public class BillReminderScheduler {

    @Autowired
    private BillRepository billRepo;

    @Autowired
    private MailService mailService;

    @Transactional
    @Scheduled(cron = "0 0 9 * * ?")
    public void sendBillReminders() {

        System.out.println("Checking Bill Reminders...");

        checkBills(7);

        checkBills(3);

        checkBills(1);

    }

    private void checkBills(int daysLeft) {

        LocalDate reminderDate = LocalDate.now().plusDays(daysLeft);

        List<Bills> bills = billRepo.findByDueDate(reminderDate);

        for (Bills bill : bills) {

            mailService.sendBillReminderMail(

                    bill.getBillUser().getFirstName(),

                    bill.getBillUser().getEmail(),

                    bill.getTitle(),

                    bill.getAmount(),

                    bill.getDueDate().toString(),

                    daysLeft

            );

            System.out.println(
                    "Reminder Sent : "
                            + bill.getTitle()
                            + " -> "
                            + bill.getBillUser().getEmail());

        }

    }

}