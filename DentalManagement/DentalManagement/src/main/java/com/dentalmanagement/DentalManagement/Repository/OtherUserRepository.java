package com.dentalmanagement.DentalManagement.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.dentalmanagement.DentalManagement.Entity.OtherUserEntity;
import com.dentalmanagement.DentalManagement.Entity.OtherUserRole;

@Repository
public interface OtherUserRepository extends JpaRepository<OtherUserEntity, Integer> {
    OtherUserEntity findByIdNumberAndPassword(String idNumber, String password);
    
    @Query("SELECT u FROM OtherUserEntity u WHERE u.role = :role")
    List<OtherUserEntity> findByRole(OtherUserRole role);
}