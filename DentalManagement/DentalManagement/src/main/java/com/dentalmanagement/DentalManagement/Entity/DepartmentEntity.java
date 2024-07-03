package com.dentalmanagement.DentalManagement.Entity;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "tabledepartment")
public class DepartmentEntity {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	@Column(name = "department")
	private String department;
	
	@Column(name = "department_code")
	private String deptCode;
	
	// One-to-Many relationship
    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProgramEntity> programs;
    
	public DepartmentEntity() {
		super();
	}

	public DepartmentEntity(String department, String deptCode) {
		super();
		this.department = department;
		this.deptCode = deptCode;
	}

	public String getDepartment() {
		return department;
	}

	public void setDepartment(String department) {
		this.department = department;
	}

	public String getDeptCode() {
		return deptCode;
	}

	public void setDeptCode(String deptCode) {
		this.deptCode = deptCode;
	}
	
	public List<ProgramEntity> getPrograms() {
        return programs;
    }

    public void setPrograms(List<ProgramEntity> programs) {
        this.programs = programs;
    }

	public Long getId() {
		return null;
	}
}
