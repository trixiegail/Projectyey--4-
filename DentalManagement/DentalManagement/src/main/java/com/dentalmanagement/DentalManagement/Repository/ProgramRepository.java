package com.dentalmanagement.DentalManagement.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dentalmanagement.DentalManagement.Entity.ProgramEntity;

public interface ProgramRepository extends JpaRepository<ProgramEntity, Long>{

}
