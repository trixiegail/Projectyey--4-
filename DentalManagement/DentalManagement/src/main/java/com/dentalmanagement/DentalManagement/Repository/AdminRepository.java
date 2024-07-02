package com.dentalmanagement.DentalManagement.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dentalmanagement.DentalManagement.Entity.AdminEntity;

public interface AdminRepository extends JpaRepository<AdminEntity, Integer> {

    AdminEntity findByAdminUser(String adminUser);
}
