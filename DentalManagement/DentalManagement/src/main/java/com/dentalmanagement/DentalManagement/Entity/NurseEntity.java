package com.dentalmanagement.DentalManagement.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "tablenurse")
public class NurseEntity {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "id_number")
    private String idNumber;

    @Column(name = "first_name")
    private String firstname;

    @Column(name = "last_name")
    private String lastname;

    @Column(name = "birthdate")
    private String birthdate;

    @Column(name = "email")
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "archived_accounts")
    private boolean archived;

    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private OtherUserRole role;
    
    
	public NurseEntity() {
		this.role = OtherUserRole.NURSE;
	}


	public NurseEntity(String idNumber, String firstname, String lastname, String birthdate, String email,
			String password, boolean archived, OtherUserRole role) {
		super();
		this.idNumber = idNumber;
		this.firstname = firstname;
		this.lastname = lastname;
		this.birthdate = birthdate;
		this.email = email;
		this.password = password;
		this.archived = archived;
		this.role = role;
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


	public OtherUserRole getRole() {
		return role;
	}


	public void setRole(OtherUserRole role) {
		this.role = role;
	}
	public long getId() {
        return id;
    }
}
