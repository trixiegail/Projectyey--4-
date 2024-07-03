package com.dentalmanagement.DentalManagement.Controller;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dentalmanagement.DentalManagement.DTO.UserDTO;
import com.dentalmanagement.DentalManagement.Entity.DepartmentEntity;
import com.dentalmanagement.DentalManagement.Entity.DoctorEntity;
import com.dentalmanagement.DentalManagement.Entity.NurseEntity;
import com.dentalmanagement.DentalManagement.Entity.OtherUserRole;
import com.dentalmanagement.DentalManagement.Entity.StaffEntity;
import com.dentalmanagement.DentalManagement.Service.DepartmentService;
import com.dentalmanagement.DentalManagement.Service.DoctorService;
import com.dentalmanagement.DentalManagement.Service.NurseService;
import com.dentalmanagement.DentalManagement.Service.ProgramService;
import com.dentalmanagement.DentalManagement.Service.StaffService;
import com.dentalmanagement.DentalManagement.Service.StudentService;

//UserController.java
@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:5173/")
public class UserController {

    private final NurseService nurseService;
    private final DoctorService doctorService;
    private final StaffService staffService;
    private final DepartmentService departmentService;
   // private final ProgramService programService;
  //  private final StudentService studentService;

    @Autowired
    public UserController(NurseService nurseService, DoctorService doctorService, StaffService staffService, 
                          DepartmentService departmentService, ProgramService programService, StudentService studentService) {
        this.nurseService = nurseService;
        this.doctorService = doctorService;
        this.staffService = staffService;
        this.departmentService = departmentService;
       // this.programService = programService;
       // this.studentService = studentService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createUser(@RequestBody UserDTO request) {
        // Determine user type based on request data
        OtherUserRole userType = request.getRole();

        // Create user based on user type
        switch (userType) {
            case NURSE:
                nurseService.createUser(request);
                break;
            
            case DOCTOR:
                doctorService.createUser(request);
                break;
                
            case STAFF:
                staffService.createUser(request);
                break;
                
            default:
                // Handle invalid user type
                return ResponseEntity.badRequest().body("Invalid user type");
        }

        return ResponseEntity.ok("User created successfully");
    }
    
    // Get all doctors
    @GetMapping("/doctors")
    public ResponseEntity<List<DoctorEntity>> getAllDoctorAccounts() {
        List<DoctorEntity> doctorAccounts = doctorService.getAllDoctors();
        return ResponseEntity.ok(doctorAccounts);
    }

    // Get all nurses
    @GetMapping("/nurses")
    public ResponseEntity<List<NurseEntity>> getAllNurseAccounts() {
        List<NurseEntity> nurseAccounts = nurseService.getAllNurses();
        return ResponseEntity.ok(nurseAccounts);
    }
    
    // Get all staffs
    @GetMapping("/staffs")
    public ResponseEntity<List<StaffEntity>> getAllStaffAccounts(){
        List<StaffEntity> staffAccounts = staffService.getAllStaffs();
        return ResponseEntity.ok(staffAccounts);
    }
    
    // Search for staff
    @GetMapping("/staffs/search")
    public List<StaffEntity> searchStaff(@RequestParam String keyword) {
        return staffService.searchStaff(keyword);
    }

    // Update a staff account
    @PutMapping("/staffs/{id}")
    public ResponseEntity<?> updateStaff(@PathVariable int id, @RequestBody NurseEntity newStaffDetails) {
        try {
            StaffEntity updatedStaff = staffService.updateStaff(id, newStaffDetails);
            return ResponseEntity.ok(updatedStaff);
        } catch (NoSuchElementException e) {
            return ResponseEntity.badRequest().body("User with ID " + id + " does not exist");
        }
    }
    @PutMapping("/nurse/{id}")
    public ResponseEntity<?> updateNurse(@PathVariable int id, @RequestBody NurseEntity newNurseDetails) {
        try {
            NurseEntity updatedNurse = nurseService.updateNurse(id, newNurseDetails);
            return ResponseEntity.ok(updatedNurse);
        } catch (NoSuchElementException e) {
            return ResponseEntity.badRequest().body("Nurse with ID " + id + " does not exist");
        }
    }
    @DeleteMapping("/nurse/{id}")
    public ResponseEntity<?> deleteNurse(@PathVariable int id) {
        try {
            nurseService.archiveAccount(id);
            return ResponseEntity.ok("Nurse with ID " + id + " archived successfully");
        } catch (NoSuchElementException e) {
            return ResponseEntity.badRequest().body("Nurse with ID " + id + " does not exist");
        }
    }
    @PutMapping("/doctors/{id}")
    public ResponseEntity<?> updateDoctor(@PathVariable int id, @RequestBody DoctorEntity newDoctorDetails) {
        try {
            DoctorEntity updatedDoctor = doctorService.updateDoctor(id, newDoctorDetails);
            return ResponseEntity.ok(updatedDoctor);
        } catch (NoSuchElementException e) {
            return ResponseEntity.badRequest().body("Doctor with ID " + id + " does not exist");
        }
    }
    @DeleteMapping("/doctors/{id}")
    public ResponseEntity<?> deleteDoctor(@PathVariable int id) {
        try {
            doctorService.archiveAccount(id);
            return ResponseEntity.ok("Doctor with ID " + id + " archived successfully");
        } catch (NoSuchElementException e) {
            return ResponseEntity.badRequest().body("Doctor with ID " + id + " does not exist");
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDepartment(@PathVariable long id) {
        try {
            departmentService.deleteDepartment(id);
            return ResponseEntity.ok("Department with ID " + id + " deleted successfully");
        } catch (NoSuchElementException e) {
            return ResponseEntity.badRequest().body("Department with ID " + id + " does not exist");
        }
    }
     @PutMapping("/{id}")
    public ResponseEntity<?> updateDepartment(@PathVariable long id, @RequestBody DepartmentEntity newDepartmentDetails) {
        try {
            DepartmentEntity updatedDepartment = departmentService.updateDepartment(id, newDepartmentDetails);
            return ResponseEntity.ok(updatedDepartment);
        } catch (NoSuchElementException e) {
            return ResponseEntity.badRequest().body("Department with ID " + id + " does not exist");
        }
    }
    

    // Delete (archive) a staff account
    @DeleteMapping("/staffs/{id}")
    public ResponseEntity<?> deleteStaff(@PathVariable int id) {
        try {
            staffService.archiveAccount(id);
            return ResponseEntity.ok("Staff account archived successfully");
        } catch (NoSuchElementException e) {
            return ResponseEntity.badRequest().body("User with ID " + id + " does not exist");
        }
    }

}
