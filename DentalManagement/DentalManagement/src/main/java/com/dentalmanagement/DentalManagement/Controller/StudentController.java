package com.dentalmanagement.DentalManagement.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dentalmanagement.DentalManagement.Entity.StudentEntity;
import com.dentalmanagement.DentalManagement.Service.StudentService;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:5173/")
public class StudentController {
    @Autowired
    StudentService studservice;
    
    // Endpoint for student authentication
    @PostMapping("/authenticate")
    public boolean authenticateStudent(@RequestBody StudentEntity student) {
        return studservice.authenticate(student.getIdNumber(), student.getPassword());
    }
    
    // Create a student record
    @PostMapping("/insertStudent")
    public StudentEntity insertStudent(@RequestBody StudentEntity student) {
        return studservice.insertStudent(student);
    }
    
    // Read all student records in tblstudent
    @GetMapping("/students")
    public List<StudentEntity> getAllStudents(){
        return studservice.getAllStudents();
    }
    
    // Update a student record
    @PutMapping("/updateStudent/{id}")
    public StudentEntity updateStudent(@PathVariable int id, @RequestBody StudentEntity newStudentDetails) {
        return studservice.updateStudent(id, newStudentDetails);
    }

    // Archive a student record
    @PostMapping("/archive/{id}")
    public ResponseEntity<StudentEntity> archiveUser(@PathVariable int id, @RequestBody StudentEntity student) throws IllegalAccessException {
        StudentEntity archivedUser = studservice.archiveUser(id, student);
        return ResponseEntity.ok(archivedUser);
    }

    // Search for students by keyword
    @GetMapping("/students/search")
    public ResponseEntity<List<StudentEntity>> searchStudents(@RequestParam String keyword) {
        List<StudentEntity> students = studservice.searchStudents(keyword);
        return ResponseEntity.ok(students);
    }

    // Search for students by department
	@GetMapping("/students/searchByDepartmentAndYear")
	public ResponseEntity<List<StudentEntity>> searchStudentsByDepartmentAndYear(
		@RequestParam String department,
		@RequestParam String yearLevel
	) {
		List<StudentEntity> students = studservice.searchStudentsByDepartmentAndYear(department, yearLevel);
		return ResponseEntity.ok(students);
	}
	@GetMapping("/students/searchByDepartment")
	public ResponseEntity<List<StudentEntity>> searchStudentsByDepartment(@RequestParam String department) {
    	List<StudentEntity> students = studservice.searchStudentsByDepartment(department);
    	return ResponseEntity.ok(students);
	}	
	

    // Search for students by year level
    @GetMapping("/students/searchByYearLevel")
    public ResponseEntity<List<StudentEntity>> searchStudentsByYearLevel(@RequestParam String yearLevel) {
        List<StudentEntity> students = studservice.searchStudentsByYearLevel(yearLevel);
        return ResponseEntity.ok(students);
    }
}
