package com.dentalmanagement.DentalManagement.Service;

import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.dentalmanagement.DentalManagement.Entity.DepartmentEntity;
import com.dentalmanagement.DentalManagement.Entity.ProgramEntity;
import com.dentalmanagement.DentalManagement.Repository.DepartmentRepository;
import com.dentalmanagement.DentalManagement.Repository.ProgramRepository;

@Service
public class ProgramService {
    @Autowired
    ProgramRepository progrepo;
    
    @Autowired
    DepartmentRepository deptrepo;
    
    // Add a program with department association
    public ProgramEntity insertProgram(ProgramEntity program, long departmentId) {
        DepartmentEntity dept = deptrepo.findById(departmentId)
                .orElseThrow(() -> new NoSuchElementException("Department not found"));
        program.setDepartment(dept);
        return progrepo.save(program);
    }
    
    // Get all programs
    public List<ProgramEntity> getAllProgram() {
        return progrepo.findAll();
    }
    
    // Get program by ID
    public ProgramEntity getProgramById(Long id) {
        return progrepo.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Program not found"));
    }
    
    // Update a program
    public ProgramEntity updateProgram(long id, ProgramEntity newProgramDetails, Long departmentId) {
        ProgramEntity prog = progrepo.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Program not found"));
        
        if (departmentId != null) {
            DepartmentEntity department = deptrepo.findById(departmentId)
                .orElseThrow(() -> new NoSuchElementException("Department not found"));
            prog.setDepartment(department);
        }
        
        if (newProgramDetails.getProgram() != null) {
            prog.setProgram(newProgramDetails.getProgram());
        }
        
        if (newProgramDetails.getProgramCode() != null) {
            prog.setProgramCode(newProgramDetails.getProgramCode());
        }
        
        return progrepo.save(prog);
    }
    
    // Delete a program
    public void deleteProgram(long id) {
        if (!progrepo.existsById(id)) {
            throw new NoSuchElementException("Program not found");
        }
        progrepo.deleteById(id);
    }
    
    // Find programs by department ID
    public List<ProgramEntity> findProgramsByDepartmentId(Long departmentId) {
        return progrepo.findByDepartmentId(departmentId);
    }
}