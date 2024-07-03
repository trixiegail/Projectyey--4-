package com.dentalmanagement.DentalManagement.Service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dentalmanagement.DentalManagement.Entity.StudentEntity;
import com.dentalmanagement.DentalManagement.Repository.StudentRepository;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    // Authenticate a student by idNumber and studentPassword
    public boolean authenticate(String idNumber, String password) {
        // Find a student by idNumber and studentPassword
        StudentEntity student = studentRepository.findByIdNumberAndPassword(idNumber, password);
        return student != null;
    }

    // Create or insert student record in tblstudent
    public StudentEntity insertStudent(StudentEntity student) {
        return studentRepository.save(student);
    }

    // Read all records in tblstudent
    public List<StudentEntity> getAllStudents() {
        return studentRepository.findAll();
    }

    // Update a student
    public StudentEntity updateStudent(int id, StudentEntity newStudentDetails) {
        StudentEntity student = studentRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Student " + id + " does not exist"));

        // Update the record
        student.setIdNumber(newStudentDetails.getIdNumber());
        student.setFirstname(newStudentDetails.getFirstname());
        student.setLastname(newStudentDetails.getLastname());
        student.setDepartment(newStudentDetails.getDepartment());
        student.setProgram(newStudentDetails.getProgram());
        student.setYearLevel(newStudentDetails.getYearLevel());
        student.setBirthdate(newStudentDetails.getBirthdate());
        student.setEmail(newStudentDetails.getEmail());
        student.setPassword(newStudentDetails.getPassword());

        return studentRepository.save(student);
    }

    // Archive a user
    public StudentEntity archiveUser(int id, StudentEntity student) throws IllegalAccessException {
        StudentEntity studentToArchive = studentRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("User " + id + " does not exist"));
        try {
            if (studentToArchive != null) {
                return studentRepository.save(studentToArchive);
            } else {
                // Handle the case where the user is not found (optional)
                throw new IllegalAccessException("Student not found.");
            }
        } catch (NoSuchElementException ex) {
            // throw the exception if the student does not exist
            throw new NoSuchElementException("Student " + id + " does not exist");
        }
    }

    // Search students by first name, last name, or ID number
    public List<StudentEntity> searchStudents(String keyword) {
        // Call the repository method to perform the search
        return studentRepository.findByFirstnameContainingIgnoreCaseOrLastnameContainingIgnoreCaseOrIdNumberContaining(keyword, keyword, keyword);
    }

    // Search students by department
    public List<StudentEntity> searchStudentsByDepartment(String department) {
        // Call the repository method to perform the search by department
        return studentRepository.findByDepartment(department);
    }

    // Search students by year level
    public List<StudentEntity> searchStudentsByYearLevel(String yearLevel) {
        // Call the repository method to perform the search by year level
        return studentRepository.findByYearLevel(yearLevel);
    }
	public List<StudentEntity> searchStudentsByDepartmentAndYear(String department, String yearLevel) {
        return studentRepository.findByDepartmentAndYearLevel(department, yearLevel);
    }
}
