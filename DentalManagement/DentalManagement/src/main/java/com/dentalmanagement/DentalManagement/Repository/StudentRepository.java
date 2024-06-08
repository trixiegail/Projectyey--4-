package com.dentalmanagement.DentalManagement.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.dentalmanagement.DentalManagement.Entity.StudentEntity;

public interface StudentRepository extends JpaRepository<StudentEntity, Integer> {

    // Find a student by ID number and password
    StudentEntity findByIdNumberAndPassword(String idNumber, String password);
    
    // Find students by archived status
    List<StudentEntity> findByArchived(boolean archived);
    
    // Search for students by first name, last name, or ID number
    List<StudentEntity> findByFirstnameContainingIgnoreCaseOrLastnameContainingIgnoreCaseOrIdNumberContaining(String firstName, String lastName, String idNumber);
    
    // Filter students by department
    List<StudentEntity> findByDepartment(String department);
    
    // Filter students by year level
    List<StudentEntity> findByYearLevel(String yearLevel);
    
    // Filter students by department and year level
    List<StudentEntity> findByDepartmentAndYearLevel(String department, String yearLevel);
}
