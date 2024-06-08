package com.dentalmanagement.DentalManagement.Service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dentalmanagement.DentalManagement.Entity.DepartmentEntity;
import com.dentalmanagement.DentalManagement.Repository.DepartmentRepository;

@Service
public class DepartmentService {
	
	@Autowired
	DepartmentRepository deptrepo;
	
	//add a department
	public DepartmentEntity insertDepartment(DepartmentEntity dept) {
		return deptrepo.save(dept);
	}
	
	//get all department
	public List<DepartmentEntity> getAllDepartment(){
		return deptrepo.findAll();
	}
	
	//update a department
	public DepartmentEntity updateDepartment(Long id, DepartmentEntity newDepartmentDetails) {
		if (id == null) {
			throw new IllegalArgumentException("Department ID cannot be null");
		}
	
		DepartmentEntity dept = null;
		
		try {
			dept = deptrepo.findById(id).orElseThrow(() -> new NoSuchElementException("Department with ID " + id + " not found"));
			
			dept.setDepartment(newDepartmentDetails.getDepartment());
			dept.setDeptCode(newDepartmentDetails.getDeptCode());
			
			// Save the updated department entity
			dept = deptrepo.save(dept);
		} catch (NoSuchElementException ex) {
			throw new NoSuchElementException("Department with ID " + id + " not found");
		}
		
		return dept;
	}
	
	
	//delete a department
	public String deleteDepartment(long id) {
		String msg = "";
		
		if(deptrepo.findById((long) id) != null) {
			deptrepo.deleteById((long) id);
			msg = "Student " + id + " is successfully deleted";
		}
		return msg;
	}

}
