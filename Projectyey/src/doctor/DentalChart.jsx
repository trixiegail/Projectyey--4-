import React, { useState } from 'react';
import './style.css';
import Nav from '../components/NavNurseDentist';

const DentalChartForm = () => {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        birthdate: '',
        sex: 'male',
        religion: '',
        age: '',
        nationality: '',
        homeAddress: '',
        mobileNo: '',
        email: '',
        dentalInsurance: '',
        effectiveDate: '',
        chiefComplaint: '',
        physicianName: '',
        specialty: '',
        physicianOfficeAddress: '',
        physicianOfficeNumber: '',
        goodHealth: '',
        medicalTreatment: '',
        condition: '',
        seriousIllness: '',
        illnessOperation: '',
        hospitalized: '',
        hospitalizationDetails: '',
        medication: '',
        medicationDetails: '',
        tobacco: '',
        alcoholDrugs: '',
        allergies: {
            localAnesthetic: false,
            antibiotics: false,
            sulfa: false,
            aspirin: false,
            latex: false,
            other: false,
            otherDetails: ''
        },
        bleedingTime: '',
        pregnant: '',
        nursing:'',
        birthControlPills:'',
        pregnancyWeeks: '',
        pregnancyMedications: '',
        conditions:{
        heartDisease: false,
        heartMurmur: false,
        hepatitisLiverDisease: false,
        rheumaticFever: false,
        hayFeverAllergies: false,
        respiratoryProblems: false,
        hepatitisJaundice: false,
        tuberculosis: false,
        swollenAnkles: false,
        kidneyDisease: false,
        diabetes: false,
        chestPain: false,
        stroke: false,
        cancerTumors: false,
        anemia: false,
        angina: false,
        asthma: false,
        emphysema: false,
        bleedingProblems: false,
        bleedingDiseases: false,
        headInjuries: false,
        arthritisRheumatism: false,
        other: false,
        otherDetails: '',
        },
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAllergyChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            allergies: {
                ...prevState.allergies,
                [name]: checked
            }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        // Handle form submission (e.g., send to API)
    };

    const handleConditionChange = (event) => {
      const { name, checked } = event.target;
      setFormData((prevData) => ({
          ...prevData,
          conditions: {
              ...prevData.conditions,
              [name]: checked,
          },
      }));
  };
  
    

    return (
      <><Nav />
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <h1 style={styles.title}><strong>DENTAL CHART</strong></h1>

                <h2><strong>Patient Information Record</strong></h2><br/>

                <label style={styles.label}>
                    ID Number:
                    <input type="text" name="id" value={formData.id} onChange={handleChange} style={styles.input} placeholder='00-0000-000' />
                </label> 

                <label style={styles.label}>
                    Name:
                    <input type="text" name="name" value={formData.name} onChange={handleChange} style={styles.input} />
                </label>

                <label style={styles.label}>
                    Birthdate (mm/dd/yy):
                    <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} style={styles.dateInput} />
                </label>  

                <label style={styles.label}>
                    Age:
                    <input type="number" name="age" value={formData.age} onChange={handleChange} style={styles.input} />
                </label> 

                <label style={styles.label}>
                    Gender:
                    <select 
                        className="selectInput" 
                        name="sex" 
                        value={formData.sex} 
                        onChange={handleChange} 
                        style={{ ...styles.input, backgroundColor: 'white' }} 
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </label>


                <label style={styles.label}>
                    Religion:
                    <input type="text" name="religion" value={formData.religion} onChange={handleChange} style={styles.input} />
                </label> 

                <label style={styles.label}>
                    Nationality:
                    <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} style={styles.input} />
                </label> 


                <label style={styles.label}>
                    Home Address:
                    <input type="text" name="homeAddress" value={formData.homeAddress} onChange={handleChange} style={styles.input} />
                </label> 

                <label style={styles.label}>
                    Mobile No.:
                    <input type="tel" name="mobileNo" value={formData.mobileNo} onChange={handleChange} style={styles.input} />
                </label> 

                <label style={styles.label}>
                    Email Address:
                    <input type="email" name="email" value={formData.email} onChange={handleChange} style={styles.input} />
                </label> 

                <label style={styles.label}>
                    Dental Insurance:
                    <input type="text" name="dentalInsurance" value={formData.dentalInsurance} onChange={handleChange} style={styles.input} />
                </label> 

                <label style={styles.label}>
                    Effective Date:
                    <input type="date" name="effectiveDate" value={formData.effectiveDate} onChange={handleChange} style={styles.input} />
                </label> <br /><br />

                <strong>Chief Complaint:</strong><br/>
                <label style={styles.label}><br/>
                    What is the reason for dental consultation?
                    <input type="text" name="chiefComplaint" value={formData.chiefComplaint} onChange={handleChange} style={styles.input} />
                </label> <br /><br />

                <h2><strong>Medical History</strong></h2>

                <label style={styles.label}>
                    Name of Physician:
                    <input type="text" name="physicianName" value={formData.physicianName} onChange={handleChange} style={styles.input} />
                </label> 

                <label style={styles.label}>
                    Specialty (if applicable):
                    <input type="text" name="specialty" value={formData.specialty} onChange={handleChange} style={styles.input} />
                </label> 

                <label style={styles.label}>
                    Office Address:
                    <input type="text" name="physicianOfficeAddress" value={formData.physicianOfficeAddress} onChange={handleChange} style={styles.input} />
                </label> 

                <label style={styles.label}>
                    Office Number:
                    <input type="tel" name="physicianOfficeNumber" value={formData.physicianOfficeNumber} onChange={handleChange} style={styles.input} />
                </label> <br />

                <fieldset style={styles.fieldset}>
                    <legend>Questions</legend>
                    <label style={styles.label} className="custom-radio">
                        1. Are you in good health?
                        <input type="radio" name="goodHealth" value="yes" checked={formData.goodHealth === 'yes'} onChange={handleChange} />
                        &ensp;Yes
                        <input type="radio" name="goodHealth" value="no" checked={formData.goodHealth === 'no'} onChange={handleChange} />
                        &ensp;No
                    </label> <br />

                    <label style={styles.label} className="custom-radio">
                        2. Are you under medical treatment right now?
                        <input type="radio" name="medicalTreatment" value="yes" checked={formData.medicalTreatment === 'yes'} onChange={handleChange} />
                        &ensp;Yes
                        <input type="radio" name="medicalTreatment" value="no" checked={formData.medicalTreatment === 'no'} onChange={handleChange} />
                        &ensp;No
                    </label> <br />

                    <label style={styles.label} className="custom-radio">
                        If yes, what is the condition being treated?
                        <input type="text" name="condition" value={formData.condition} onChange={handleChange} style={styles.input} />
                    </label> <br />

                    <label style={styles.label} className="custom-radio">
                        3. Have you ever had serious illness or surgical operation?
                        <input type="radio" name="seriousIllness" value="yes" checked={formData.seriousIllness === 'yes'} onChange={handleChange} />
                        &ensp;Yes
                        <input type="radio" name="seriousIllness" value="no" checked={formData.seriousIllness === 'no'} onChange={handleChange} />
                        &ensp;No
                    </label> <br />

                    <label style={styles.label} className="custom-radio">
                        If so, what illness or operation?
                        <input type="text" name="illnessOperation" value={formData.illnessOperation} onChange={handleChange} style={styles.input} />
                    </label> <br />

                    <label style={styles.label} className="custom-radio">
                        4. Have you ever been hospitalized?
                        <input type="radio" name="hospitalized" value="yes" checked={formData.hospitalized === 'yes'} onChange={handleChange} />
                        &ensp;Yes
                        <input type="radio" name="hospitalized" value="no" checked={formData.hospitalized === 'no'} onChange={handleChange} />
                        &ensp;No
                    </label> <br />

                    <label style={styles.label} className="custom-radio">
                        If so, when and why?
                        <input type="text" name="hospitalizationDetails" value={formData.hospitalizationDetails} onChange={handleChange} style={styles.input} />
                    </label> <br />

                    <label style={styles.label} className="custom-radio">
                        5. Are you taking any prescription/non-prescription medication?
                        <input type="radio" name="medication" value="yes" checked={formData.medication === 'yes'} onChange={handleChange} />
                        &ensp;Yes
                        <input type="radio" name="medication" value="no" checked={formData.medication === 'no'} onChange={handleChange} />
                        &ensp;No
                    </label> <br />

                    <label style={styles.label} className="custom-radio">
                        If so, please specify:
                        <input type="text" name="medicationDetails" value={formData.medicationDetails} onChange={handleChange} style={styles.input} />
                    </label> <br />

                    <label style={styles.label} className="custom-radio">
                        6. Do you use tobacco products?
                        <input type="radio" name="tobacco" value="yes" checked={formData.tobacco === 'yes'} onChange={handleChange} />
                        &ensp;Yes
                        <input type="radio" name="tobacco" value="no" checked={formData.tobacco === 'no'} onChange={handleChange} />
                        &ensp;No
                    </label> <br />

                    <label style={styles.label} className="custom-radio">
                        7. Do you use alcohol, cocaine, or other dangerous drugs?
                        <input type="radio" name="alcoholDrugs" value="yes" checked={formData.alcoholDrugs === 'yes'} onChange={handleChange} />
                        &ensp;Yes
                        <input type="radio" name="alcoholDrugs" value="no" checked={formData.alcoholDrugs === 'no'} onChange={handleChange} />
                        &ensp;No
                    </label> <br />

                    <label style={styles.label}>
                        8. Are you allergic to any of the following:
                        <div style={styles.checkboxContainer}>
                            <label style={styles.checkbox} className="custom-checkbox">
                                <input
                                    type="checkbox"
                                    name="localAnesthetic"
                                    checked={formData.allergies.localAnesthetic}
                                    onChange={handleAllergyChange}
                                />
                                &emsp;&emsp;&emsp;Local Anesthetic (e.g., Lidocaine)
                            </label>
                            <label style={styles.checkbox} className="custom-checkbox">
                                <input
                                    type="checkbox"
                                    name="antibiotics"
                                    checked={formData.allergies.antibiotics}
                                    onChange={handleAllergyChange}
                                />
                                &emsp;&emsp;&emsp;Antibiotics (e.g., Penicillin)
                            </label>
                            <label style={styles.checkbox} className="custom-checkbox">
                                <input
                                    type="checkbox"
                                    name="sulfa"
                                    checked={formData.allergies.sulfa}
                                    onChange={handleAllergyChange}
                                />
                                &emsp;&emsp;&emsp;Sulfa drugs
                            </label>
                            <label style={styles.checkbox} className="custom-checkbox">
                                <input
                                    type="checkbox"
                                    name="aspirin"
                                    checked={formData.allergies.aspirin}
                                    onChange={handleAllergyChange}
                                />
                                &emsp;&emsp;&emsp;Aspirin
                            </label>
                            <label style={styles.checkbox} className="custom-checkbox">
                                <input
                                    type="checkbox"
                                    name="latex"
                                    checked={formData.allergies.latex}
                                    onChange={handleAllergyChange}
                                />
                                &emsp;&emsp;&emsp;Latex
                            </label>
                            <label style={styles.checkbox} className="custom-checkbox">
                                <input
                                    type="checkbox"
                                    name="other"
                                    checked={formData.allergies.other}
                                    onChange={handleAllergyChange}
                                />
                                &emsp;&emsp;&emsp;Other:
                                <input
                                    type="text"
                                    name="otherDetails"
                                    value={formData.allergies.otherDetails}
                                    onChange={handleChange}
                                    style={styles.input}
                                />
                            </label>
                        </div>
                    </label>


                    <label style={styles.label} className="custom-radio">
                      10. For women only:
                      <div style={styles.radioContainer}>
                          <div style={styles.radioGroup}>
                          &emsp;&emsp;Are you pregnant?
                              <input
                                  type="radio"
                                  name="pregnant"
                                  value="yes"
                                  checked={formData.pregnant === 'yes'}
                                  onChange={handleChange}
                                  style={styles.radioInput}
                              />
                              Yes
                              <input
                                  type="radio"
                                  name="pregnant"
                                  value="no"
                                  checked={formData.pregnant === 'no'}
                                  onChange={handleChange}
                                  style={styles.radioInput}
                              />
                              No
                          </div>

                          <div style={styles.radioGroup}>
                          &emsp;&emsp;Are you nursing?
                              <input
                                  type="radio"
                                  name="nursing"
                                  value="yes"
                                  checked={formData.nursing === 'yes'}
                                  onChange={handleChange}
                                  style={styles.radioInput}
                              />
                              Yes
                              <input
                                  type="radio"
                                  name="nursing"
                                  value="no"
                                  checked={formData.nursing === 'no'}
                                  onChange={handleChange}
                                  style={styles.radioInput}
                              />
                              No
                          </div>

                          <div style={styles.radioGroup}>
                          &emsp;&emsp;Are you taking birth control pills?
                              <input
                                  type="radio"
                                  name="birthControl"
                                  value="yes"
                                  checked={formData.birthControl === 'yes'}
                                  onChange={handleChange}
                                  style={styles.radioInput}
                              />
                              Yes
                              <input
                                  type="radio"
                                  name="birthControl"
                                  value="no"
                                  checked={formData.birthControl === 'no'}
                                  onChange={handleChange}
                                  style={styles.radioInput}
                              />
                              No
                          </div>
                      </div>
                  </label>


                    <label style={styles.label}>
                          11. Blood Type:
                        <input type="text" name="pregnancyWeeks" value={formData.pregnancyWeeks} onChange={handleChange} style={styles.input} />
                    </label> <br />

                    <label style={styles.label}>
                        12. Blood Pressure:
                        <input type="text" name="pregnancyMedications" value={formData.pregnancyMedications} onChange={handleChange} style={styles.input} />
                    </label> <br />
                


                <label style={styles.label}>
                    Do you have or have you had any of the following? Check which apply: &emsp;
                    <div style={styles.checkboxContainer}>
                        <div className="custom-checkbox">
                            <input
                                type="checkbox"
                                name="heartDisease"
                                checked={formData.conditions.heartDisease}
                                onChange={handleConditionChange}
                            />
                           &emsp;&emsp;&emsp; Heart Disease
                        </div>
                        <div className="custom-checkbox">
                            <input
                                type="checkbox"
                                name="heartMurmur"
                                checked={formData.conditions.heartMurmur}
                                onChange={handleConditionChange}
                            />
                            &emsp;&emsp;&emsp;Heart Murmur
                        </div>
                        <div className="custom-checkbox">
                            <input
                                type="checkbox"
                                name="hepatitisLiverDisease"
                                checked={formData.conditions.hepatitisLiverDisease}
                                onChange={handleConditionChange}
                            />
                            &emsp;&emsp;&emsp;Hepatitis / Liver Disease
                        </div>
                        <div className="custom-checkbox">
                            <input
                                type="checkbox"
                                name="rheumaticFever"
                                checked={formData.conditions.rheumaticFever}
                                onChange={handleConditionChange}
                            />
                            &emsp;&emsp;&emsp;Rheumatic Fever
                        </div>
                        <div className="custom-checkbox">
                            <input
                                type="checkbox"
                                name="hayFeverAllergies"
                                checked={formData.conditions.hayFeverAllergies}
                                onChange={handleConditionChange}
                            />
                            &emsp;&emsp;&emsp;Hay Fever / Allergies
                        </div>
                        <div className="custom-checkbox">
                            <input
                                type="checkbox"
                                name="respiratoryProblems"
                                checked={formData.conditions.respiratoryProblems}
                                onChange={handleConditionChange}
                            />
                            &emsp;&emsp;&emsp;Respiratory Problems
                        </div>
                        <div className="custom-checkbox">
                            <input
                                type="checkbox"
                                name="hepatitisJaundice"
                                checked={formData.conditions.hepatitisJaundice}
                                onChange={handleConditionChange}
                            />
                            &emsp;&emsp;&emsp;Hepatitis / Jaundice
                        </div>
                        <div className="custom-checkbox">
                            <input
                                type="checkbox"
                                name="tuberculosis"
                                checked={formData.conditions.tuberculosis}
                                onChange={handleConditionChange}
                            />
                            &emsp;&emsp;&emsp;Tuberculosis
                        </div>
                        <div className="custom-checkbox">
                            <input
                                type="checkbox"
                                name="swollenAnkles"
                                checked={formData.conditions.swollenAnkles}
                                onChange={handleConditionChange}
                            />
                            &emsp;&emsp;&emsp;Swollen Ankles
                        </div>
                        <div className="custom-checkbox">
                            <input
                                type="checkbox"
                                name="kidneyDisease"
                                checked={formData.conditions.kidneyDisease}
                                onChange={handleConditionChange}
                            />
                            &emsp;&emsp;&emsp;Kidney Disease
                        </div>
                        <div className="custom-checkbox">
                            <input
                                type="checkbox"
                                name="diabetes"
                                checked={formData.conditions.diabetes}
                                onChange={handleConditionChange}
                            />
                            &emsp;&emsp;&emsp;Diabetes
                        </div>
                        <div className="custom-checkbox">
                            <input
                                type="checkbox"
                                name="chestPain"
                                checked={formData.conditions.chestPain}
                                onChange={handleConditionChange}
                            />
                            &emsp;&emsp;&emsp;Chest Pain
                        </div>
                        <div className="custom-checkbox">
                            <input
                                type="checkbox"
                                name="stroke"
                                checked={formData.conditions.stroke}
                                onChange={handleConditionChange}
                            />
                            &emsp;&emsp;&emsp;Stroke
                        </div>
                        <div className="custom-checkbox">
                            <input
                                type="checkbox"
                                name="cancerTumors"
                                checked={formData.conditions.cancerTumors}
                                onChange={handleConditionChange}
                            />
                            &emsp;&emsp;&emsp;Cancer / Tumors
                        </div>
                        <div className="custom-checkbox">
                            <input
                                type="checkbox"
                                name="anemia"
                                checked={formData.conditions.anemia}
                                onChange={handleConditionChange}
                            />
                            &emsp;&emsp;&emsp;Anemia
                        </div>
                        <div className="custom-checkbox">
                            <input
                                type="checkbox"
                                name="angina"
                                checked={formData.conditions.angina}
                                onChange={handleConditionChange}
                            />
                            &emsp;&emsp;&emsp;Angina
                        </div>
                        <div className="custom-checkbox">
                            <input
                                type="checkbox"
                                name="asthma"
                                checked={formData.conditions.asthma}
                                onChange={handleConditionChange}
                            />
                            &emsp;&emsp;&emsp;Asthma
                        </div>
                        <div className="custom-checkbox">
                            <input
                                type="checkbox"
                                name="emphysema"
                                checked={formData.conditions.emphysema}
                                onChange={handleConditionChange}
                            />
                            &emsp;&emsp;&emsp;Emphysema
                        </div>
                        <div className="custom-checkbox">
                            <input
                                type="checkbox"
                                name="bleedingProblems"
                                checked={formData.conditions.bleedingProblems}
                                onChange={handleConditionChange}
                            />
                            &emsp;&emsp;&emsp;Bleeding Problems
                        </div>
                        <div className="custom-checkbox">
                            <input
                                type="checkbox"
                                name="bleedingDiseases"
                                checked={formData.conditions.bleedingDiseases}
                                onChange={handleConditionChange}
                            />
                            &emsp;&emsp;&emsp;Bleeding Diseases
                        </div>
                        <div className="custom-checkbox">
                            <input
                                type="checkbox"
                                name="headInjuries"
                                checked={formData.conditions.headInjuries}
                                onChange={handleConditionChange}
                            />
                            &emsp;&emsp;&emsp;Head Injuries
                        </div>
                        <div className="custom-checkbox">
                            <input
                                type="checkbox"
                                name="arthritisRheumatism"
                                checked={formData.conditions.arthritisRheumatism}
                                onChange={handleConditionChange}
                            />
                            &emsp;&emsp;&emsp;Arthritis / Rheumatism
                        </div>
                        <div className="custom-checkbox"    >
                            <input
                                type="checkbox"
                                name="other"
                                checked={formData.conditions.other}
                                onChange={handleConditionChange}
                            />
                            &emsp;&emsp;&emsp;Other:
                            <input type="text" name="otherDetails" value={formData.conditions.otherDetails} onChange={handleChange} style={styles.input} />
                        
                        </div>
                    </div>
                </label>
                </fieldset>


                
                <button type="submit" style={styles.button}>Submit</button>
            </form>
        </div>

        </>
    );
    
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '20px',
    },
    form: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        width: '1000px',
        overflowY: 'auto',
        maxHeight: '90vh',
        color: 'black', 
    },
    title: {
        textAlign: 'center',
        marginBottom: '20px',
        color: 'black',
    },
    label: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px',
        color: 'black', 
    },
    input: {
        flex: 1,
        padding: '5px',
        border: 'none',
        borderBottom: '1px solid black',
        color: 'black', 
    },
    fieldset: {
        margin: '10px 0',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        color: 'black', 
    },
    button: {
        backgroundColor: '#88343b',
        color: 'white',
        padding: '10px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        width: '100%',
    },
    dateInput: {
        flex: 1,
        color: 'black',
        backgroundColor: 'white',
        padding: '8px',
        WebkitAppearance: 'none',
        MozAppearance: 'none',
        appearance: 'none',
        borderBottom: '1px solid black',
    },
    checkboxContainer: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: '5px',
        color: 'black', 
    },
    checkbox: {
        marginBottom: '5px',
        marginLeft: '50px',
        color: 'black', 
    },
    radioContainer: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: '5px',
        color: 'black', 
    },
    radioGroup: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '5px',
        color: 'black',
    },
    radioInput: {
        marginLeft: '5px',
    },
};


export default DentalChartForm;
