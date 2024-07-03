package com.dentalmanagement.DentalManagement.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dentalmanagement.DentalManagement.Entity.NurseEntity;


public interface NurseRepository extends JpaRepository<NurseEntity, Integer>{
	NurseEntity findByIdNumberAndPassword(String idNumber, String password);
}
