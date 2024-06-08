package com.dentalmanagement.DentalManagement.Service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import com.dentalmanagement.DentalManagement.Entity.ProgramEntity;
import com.dentalmanagement.DentalManagement.Repository.ProgramRepository;

@Service
public class ProgramService {

	@Autowired
	ProgramRepository progrepo;
	
	//add a program
	public ProgramEntity insertProgram(ProgramEntity program) {
		return progrepo.save(program);
	}
	
	//get all program
	public List<ProgramEntity> getAllProgram(){
		return progrepo.findAll();
	}
	
	//update a program
	public ProgramEntity updateProgram(long id, ProgramEntity newProgramDetails) {
    try {
        ProgramEntity prog = progrepo.findById(id).orElseThrow(() -> new NoSuchElementException("Program does not exist"));
        
        // Update the program entity with the new details
        prog.setProgram(newProgramDetails.getProgram());
        prog.setProgramCode(newProgramDetails.getProgramCode());
        
        // Save the updated program entity
        return progrepo.save(prog);
    } catch (NoSuchElementException ex) {
        throw ex;
    }
}

	
	//delete a program
	public String deleteProgram(@PathVariable long id) {
		String msg = "";
		
		if(progrepo.findById((long) id) != null) {
			progrepo.deleteById(id);
			msg = "Program is successfully deleted";
		}
		return msg;
	}
}
