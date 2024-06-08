package com.dentalmanagement.DentalManagement.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dentalmanagement.DentalManagement.Entity.StaffEntity;

public interface StaffRepository extends JpaRepository<StaffEntity, Integer>{
	StaffEntity findByIdNumberAndPassword(String idNumber, String password);
	List<StaffEntity> findByFirstnameContainingOrLastnameContaining(String firstname, String lastname);
}
