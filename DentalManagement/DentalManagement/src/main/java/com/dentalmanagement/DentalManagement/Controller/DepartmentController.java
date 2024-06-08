package com.dentalmanagement.DentalManagement.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dentalmanagement.DentalManagement.Entity.DepartmentEntity;
import com.dentalmanagement.DentalManagement.Service.DepartmentService;

@RestController
@RequestMapping("/department")
@CrossOrigin(origins = "http://localhost:5173/")
public class DepartmentController {
	
	@Autowired
	DepartmentService deptserv;
	
	//add a department
	@PostMapping("/insertDepartment")
	public DepartmentEntity insertDepartment(@RequestBody DepartmentEntity dept) {
		return deptserv.insertDepartment(dept);
	}
	
	//get all department
	@GetMapping("/getAllDepartment")
	public List<DepartmentEntity> getAllDepartments(){
		return deptserv.getAllDepartment();
	}
	
	//update a department
	@PutMapping("/updatedepartment/{id}")

	public DepartmentEntity updateDepartment(@PathVariable long id, @RequestBody DepartmentEntity newDepartmentDetails) {
    return deptserv.updateDepartment(id, newDepartmentDetails);
}

	
	//delete a department
	@DeleteMapping("/deleteDepartment/{id}")
	public String deleteDepartment(@PathVariable long id) {
		return deptserv.deleteDepartment(id);
	}
}
