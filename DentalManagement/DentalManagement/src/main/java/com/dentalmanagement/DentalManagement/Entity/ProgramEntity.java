package com.dentalmanagement.DentalManagement.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "tableprogram")
public class ProgramEntity {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	@Column(name = "program")
	private String program;
	
	@Column(name = "program_code")
	private String programCode;

	public ProgramEntity() {
		super();
	}

	public ProgramEntity(String program, String programCode) {
		super();
		this.program = program;
		this.programCode = programCode;
	}

	public String getProgram() {
		return program;
	}

	public void setProgram(String program) {
		this.program = program;
	}

	public String getProgramCode() {
		return programCode;
	}

	public void setProgramCode(String programCode) {
		this.programCode = programCode;
	}
	public long getId() {
        return id;
    }
}
