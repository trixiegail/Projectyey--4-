package com.dentalmanagement.DentalManagement.Controller;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dentalmanagement.DentalManagement.Entity.OtherUserEntity;
import com.dentalmanagement.DentalManagement.Service.OtherUserService;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:5173/")
public class OtherUserController {

    @Autowired
    private OtherUserService otherUserService;

    @PostMapping("/authenticateUser")
    public ResponseEntity<OtherUserEntity> authenticateUser(@RequestBody OtherUserEntity user) {
        OtherUserEntity authenticatedUser = otherUserService.authenticateUser(user.getIdNumber(), user.getPassword());
        if (authenticatedUser != null) {
            return ResponseEntity.ok(authenticatedUser);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/create")
    public ResponseEntity<OtherUserEntity> createUser(@RequestBody OtherUserEntity user) {
        OtherUserEntity createdUser = otherUserService.insertUser(user);
        return ResponseEntity.ok(createdUser);
    }

    @GetMapping("/all")
    public ResponseEntity<List<OtherUserEntity>> getAllUsers() {
        List<OtherUserEntity> users = otherUserService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // Get all nurses
    @GetMapping("/nurses")
    public ResponseEntity<List<OtherUserEntity>> getAllNurseAccounts() {
        List<OtherUserEntity> nurseAccounts = otherUserService.findNurseAccounts();
        return ResponseEntity.ok(nurseAccounts);
    }

    // Get all doctors
    @GetMapping("/doctors")
    public ResponseEntity<List<OtherUserEntity>> getAllDoctorAccounts() {
        List<OtherUserEntity> doctorAccounts = otherUserService.findDoctorAccounts();
        return ResponseEntity.ok(doctorAccounts);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<OtherUserEntity> updateUser(@PathVariable int id, @RequestBody OtherUserEntity newUserDetails) {
        try {
            // Assume `currentUser` is fetched from security context/session in real use case
            OtherUserEntity currentUser = new OtherUserEntity(); // This should be replaced by actual current user
            OtherUserEntity updatedUser = otherUserService.updateUser(id, newUserDetails, currentUser);
            return ResponseEntity.ok(updatedUser);
        } catch (NoSuchElementException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (IllegalAccessException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PutMapping("/archive/{id}")
    public ResponseEntity<OtherUserEntity> archiveAccount(@PathVariable int id, @RequestBody OtherUserEntity currentUser) {
        try {
            OtherUserEntity archivedUser = otherUserService.archiveAccount(id, currentUser);
            return ResponseEntity.ok(archivedUser);
        } catch (NoSuchElementException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (IllegalAccessException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable int id) {
        try {
            // Assume `currentUser` is fetched from security context/session in real use case
            OtherUserEntity currentUser = new OtherUserEntity(); // This should be replaced by actual current user
            boolean isDeleted = otherUserService.deleteUser(id, currentUser);
            if (isDeleted) {
                return ResponseEntity.ok("User deleted successfully");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete user");
            }
        } catch (NoSuchElementException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (IllegalAccessException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
