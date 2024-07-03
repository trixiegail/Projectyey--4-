package com.dentalmanagement.DentalManagement.Controller;

import java.util.List;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.dentalmanagement.DentalManagement.Entity.ProgramEntity;
import com.dentalmanagement.DentalManagement.Service.ProgramService;

@RestController
@RequestMapping("/program")
@CrossOrigin(origins = "http://localhost:5173/")
public class ProgramController {
    @Autowired
    ProgramService progserv;
    
    // Add a program
    @PostMapping("/insertProgram")
    public ResponseEntity<ProgramEntity> insertProgram(
            @RequestParam Long departmentId,
            @RequestBody ProgramEntity program) {
        ProgramEntity insertedProgram = progserv.insertProgram(program, departmentId);
        return new ResponseEntity<>(insertedProgram, HttpStatus.CREATED);
    }
    
    // Get all programs
    @GetMapping("/getAllPrograms")
    public ResponseEntity<List<ProgramEntity>> getAllPrograms() {
        List<ProgramEntity> programs = progserv.getAllProgram();
        return new ResponseEntity<>(programs, HttpStatus.OK);
    }
    
    // Get a specific program by ID
    @GetMapping("/{id}")
    public ResponseEntity<ProgramEntity> getProgramById(@PathVariable Long id) {
        ProgramEntity program = progserv.getProgramById(id);
        return new ResponseEntity<>(program, HttpStatus.OK);
    }
    
    // Update a program
    @PutMapping("/updateProgram/{id}")
    public ResponseEntity<ProgramEntity> updateProgram(
            @PathVariable long id,
            @RequestParam(required = false) Long departmentId,
            @RequestBody ProgramEntity newProgramDetails) {
        ProgramEntity updatedProgram = progserv.updateProgram(id, newProgramDetails, departmentId);
        return new ResponseEntity<>(updatedProgram, HttpStatus.OK);
    }
    
    // Delete a program
    @DeleteMapping("/deleteProgram/{id}")
    public ResponseEntity<Void> deleteProgram(@PathVariable long id) {
        progserv.deleteProgram(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    
    // Get programs by department
    @GetMapping("/getProgramsByDepartment/{departmentId}")
    public ResponseEntity<List<ProgramEntity>> getProgramsByDepartment(@PathVariable Long departmentId) {
        List<ProgramEntity> programs = progserv.findProgramsByDepartmentId(departmentId);
        return new ResponseEntity<>(programs, HttpStatus.OK);
    }
}