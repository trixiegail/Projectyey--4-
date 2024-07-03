package com.dentalmanagement.DentalManagement.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.dentalmanagement.DentalManagement.Entity.ProgramEntity;

@Repository
public interface ProgramRepository extends JpaRepository<ProgramEntity, Long> {
    List<ProgramEntity> findByDepartmentId(Long departmentId);
}