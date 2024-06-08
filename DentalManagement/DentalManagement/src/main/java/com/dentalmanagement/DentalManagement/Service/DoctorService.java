package com.dentalmanagement.DentalManagement.Service;

import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dentalmanagement.DentalManagement.DTO.UserDTO;
import com.dentalmanagement.DentalManagement.Entity.DoctorEntity;
import com.dentalmanagement.DentalManagement.Entity.OtherUserRole;
import com.dentalmanagement.DentalManagement.Repository.DoctorRepository;

@Service
public class DoctorService {
	@Autowired
	private DoctorRepository docrepo;
	
	public DoctorEntity authenticateDoctor(String idNumber, String password) {
		return docrepo.findByIdNumberAndPassword(idNumber, password);
	}
	
	public DoctorEntity createUser(UserDTO request) {
		DoctorEntity doctor = new DoctorEntity();
		
		doctor.setIdNumber(request.getIdNumber());
        doctor.setFirstname(request.getFirstname());
        doctor.setLastname(request.getLastname());
        doctor.setBirthdate(request.getBirthdate());
        doctor.setEmail(request.getEmail());
        doctor.setPassword(request.getPassword());
    	doctor.setRole(OtherUserRole.DOCTOR);
    	
		return docrepo.save(doctor);
	}
	
	//get all doctors
    public List<DoctorEntity> getAllDoctors() {
        return docrepo.findAll();
    }
    
    //update doctors
    public DoctorEntity updateDoctor(int id, DoctorEntity newDoctorDetails) {
    	DoctorEntity doctor = docrepo.findById(id)
    			.orElseThrow(() -> new NoSuchElementException("User " + id + " does not exist"));
    	
    	doctor.setIdNumber(newDoctorDetails.getIdNumber());
    	doctor.setFirstname(newDoctorDetails.getFirstname());
    	doctor.setLastname(newDoctorDetails.getLastname());
    	doctor.setBirthdate(newDoctorDetails.getBirthdate());
    	doctor.setEmail(newDoctorDetails.getEmail());
    	doctor.setPassword(newDoctorDetails.getPassword());

    	return docrepo.save(doctor);
    }
    
    public DoctorEntity archiveAccount(int id) {
    	DoctorEntity archiveDoctor = docrepo.findById(id)
    			.orElseThrow(() -> new NoSuchElementException("User " + id + " does not exist"));
    	
    	archiveDoctor.setArchived(true);
    	return docrepo.save(archiveDoctor);
    }
}
