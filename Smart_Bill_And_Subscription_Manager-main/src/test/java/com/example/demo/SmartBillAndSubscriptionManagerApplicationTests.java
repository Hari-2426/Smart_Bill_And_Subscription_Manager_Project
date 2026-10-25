package com.example.demo;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

class SmartBillAndSubscriptionManagerApplicationTests {

	@Test
	void printEncryptedPassword() {
		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
		String encoded = encoder.encode("NANDAN@2005");
		System.out.println("ENCRYPTED_PASSWORD_OUTPUT: " + encoded);
	}

	@Test
	void checkAdmins() {
		try (java.sql.Connection conn = java.sql.DriverManager.getConnection(
				"jdbc:postgresql://ep-misty-frost-b5r29qg6-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require",
				"neondb_owner", "npg_4RaPCz1OXofg");
			 java.sql.Statement stmt = conn.createStatement();
			 java.sql.ResultSet rs = stmt.executeQuery("SELECT admin_id, email, password, first_name, last_name, role, account_status FROM admins")) {
			while (rs.next()) {
				String storedPass = rs.getString("password");
				BCryptPasswordEncoder enc = new BCryptPasswordEncoder();
				boolean matchesDirect = enc.matches("NANDAN@2005", storedPass);
				boolean matchesTrimmed = enc.matches("NANDAN@2005", storedPass.trim());
				System.out.println("ADMIN_FOUND: id=" + rs.getInt("admin_id") + 
						", email=" + rs.getString("email") + 
						", matchesDirect=" + matchesDirect + 
						", matchesTrimmed=" + matchesTrimmed);
				if (!matchesDirect && matchesTrimmed) {
					// Clean up the hash in the DB by updating it with the trimmed value
					try (java.sql.PreparedStatement ps = conn.prepareStatement("UPDATE admins SET password = ? WHERE admin_id = ?")) {
						ps.setString(1, storedPass.trim());
						ps.setInt(2, rs.getInt("admin_id"));
						ps.executeUpdate();
						System.out.println("TRIMMED_HASH_UPDATED_IN_DB_SUCCESSFULLY");
					}
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
