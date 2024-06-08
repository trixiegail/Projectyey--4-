package com.dentalmanagement.DentalManagement.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table (name = "tablestudent")
public class StudentEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@Column(name = "id_number")
	private String idNumber;
	
	@Column(name = "first_name")
	private String firstname;
	
	@Column(name = "last_name")
	private String lastname;
	
	@Column(name = "department")
	private String department;
	
	@Column(name = "program")
	private String program;
	
	@Column(name = "year_level")
	private String yearLevel;
	
	@Column(name = "student_birthdate")
	private String birthdate;
	
	@Column(name = "student_email")
	private String email;
	
	@Column(name = "student_password")
	private String password;
	
	@Column(name = "archived_accounts")
	private boolean archived;

	public StudentEntity() {
		super();
	}

	public StudentEntity(String idNumber, String firstname, String lastname, String department, String program,
			String yearLevel, String birthdate, String email, String password, boolean archived) {
		super();
		this.idNumber = idNumber;
		this.firstname = firstname;
		this.lastname = lastname;
		this.department = department;
		this.program = program;
		this.yearLevel = yearLevel;
		this.birthdate = birthdate;
		this.email = email;
		this.password = password;
		this.archived = archived;
	}

	public String getIdNumber() {
		return idNumber;
	}

	public void setIdNumber(String idNumber) {
		this.idNumber = idNumber;
	}

	public String getFirstname() {
		return firstname;
	}

	public void setFirstname(String firstname) {
		this.firstname = firstname;
	}

	public String getLastname() {
		return lastname;
	}

	public void setLastname(String lastname) {
		this.lastname = lastname;
	}

	public String getDepartment() {
		return department;
	}

	public void setDepartment(String department) {
		this.department = department;
	}

	public String getProgram() {
		return program;
	}

	public void setProgram(String program) {
		this.program = program;
	}

	public String getYearLevel() {
		return yearLevel;
	}

	public void setYearLevel(String yearLevel) {
		this.yearLevel = yearLevel;
	}

	public String getBirthdate() {
		return birthdate;
	}

	public void setBirthdate(String birthdate) {
		this.birthdate = birthdate;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public boolean isArchived() {
		return archived;
	}

	public void setArchived(boolean archived) {
		this.archived = archived;
	}
	public long getId() {
        return id;
    }
	
}
