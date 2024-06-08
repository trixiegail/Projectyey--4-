package com.dentalmanagement.DentalManagement.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dentalmanagement.DentalManagement.Entity.DoctorEntity;

public interface DoctorRepository extends JpaRepository<DoctorEntity, Integer>{
	DoctorEntity findByIdNumberAndPassword(String idNumber, String password);
}
