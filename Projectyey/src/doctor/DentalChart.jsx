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
        homeNo: '',
        officeNo: '',
        faxNo: '',
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
                    <select className="selectInput" name="sex" value={formData.sex} onChange={handleChange} style={styles.input}>
                        <option value="male">M</option>
                        <option value="female">F</option>
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
                    Home No.:
                    <input type="tel" name="homeNo" value={formData.homeNo} onChange={handleChange} style={styles.input} />
                </label>

                <label style={styles.label}>
                    Office No.:
                    <input type="tel" name="officeNo" value={formData.officeNo} onChange={handleChange} style={styles.input} />
                </label> 

                <label style={styles.label}>
                    Fax No.:
                    <input type="tel" name="faxNo" value={formData.faxNo} onChange={handleChange} style={styles.input} />
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
                    <label style={styles.label}>
                        1. Are you in good health?
                        <input type="radio" name="goodHealth" value="yes" checked={formData.goodHealth === 'yes'} onChange={handleChange} />
                        &ensp;Yes
                        <input type="radio" name="goodHealth" value="no" checked={formData.goodHealth === 'no'} onChange={handleChange} />
                        &ensp;No
                    </label> <br />

                    <label style={styles.label}>
                        2. Are you under medical treatment right now?
                        <input type="radio" name="medicalTreatment" value="yes" checked={formData.medicalTreatment === 'yes'} onChange={handleChange} />
                        &ensp;Yes
                        <input type="radio" name="medicalTreatment" value="no" checked={formData.medicalTreatment === 'no'} onChange={handleChange} />
                        &ensp;No
                    </label> <br />

                    <label style={styles.label}>
                        If yes, what is the condition being treated?
                        <input type="text" name="condition" value={formData.condition} onChange={handleChange} style={styles.input} />
                    </label> <br />

                    <label style={styles.label}>
                        3. Have you ever had serious illness or surgical operation?
                        <input type="radio" name="seriousIllness" value="yes" checked={formData.seriousIllness === 'yes'} onChange={handleChange} />
                        &ensp;Yes
                        <input type="radio" name="seriousIllness" value="no" checked={formData.seriousIllness === 'no'} onChange={handleChange} />
                        &ensp;No
                    </label> <br />

                    <label style={styles.label}>
                        If so, what illness or operation?
                        <input type="text" name="illnessOperation" value={formData.illnessOperation} onChange={handleChange} style={styles.input} />
                    </label> <br />

                    <label style={styles.label}>
                        4. Have you ever been hospitalized?
                        <input type="radio" name="hospitalized" value="yes" checked={formData.hospitalized === 'yes'} onChange={handleChange} />
                        &ensp;Yes
                        <input type="radio" name="hospitalized" value="no" checked={formData.hospitalized === 'no'} onChange={handleChange} />
                        &ensp;No
                    </label> <br />

                    <label style={styles.label}>
                        If so, when and why?
                        <input type="text" name="hospitalizationDetails" value={formData.hospitalizationDetails} onChange={handleChange} style={styles.input} />
                    </label> <br />

                    <label style={styles.label}>
                        5. Are you taking any prescription/non-prescription medication?
                        <input type="radio" name="medication" value="yes" checked={formData.medication === 'yes'} onChange={handleChange} />
                        &ensp;Yes
                        <input type="radio" name="medication" value="no" checked={formData.medication === 'no'} onChange={handleChange} />
                        &ensp;No
                    </label> <br />

                    <label style={styles.label}>
                        If so, please specify:
                        <input type="text" name="medicationDetails" value={formData.medicationDetails} onChange={handleChange} style={styles.input} />
                    </label> <br />

                    <label style={styles.label}>
                        6. Do you use tobacco products?
                        <input type="radio" name="tobacco" value="yes" checked={formData.tobacco === 'yes'} onChange={handleChange} />
                        &ensp;Yes
                        <input type="radio" name="tobacco" value="no" checked={formData.tobacco === 'no'} onChange={handleChange} />
                        &ensp;No
                    </label> <br />

                    <label style={styles.label}>
                        7. Do you use alcohol, cocaine, or other dangerous drugs?
                        <input type="radio" name="alcoholDrugs" value="yes" checked={formData.alcoholDrugs === 'yes'} onChange={handleChange} />
                        &ensp;Yes
                        <input type="radio" name="alcoholDrugs" value="no" checked={formData.alcoholDrugs === 'no'} onChange={handleChange} />
                        &ensp;No
                    </label> <br />

                    <label style={styles.label}>
                        8. Are you allergic to any of the following:
                        <div style={styles.checkboxContainer}>
                            <label style={styles.checkbox}>
                                <input
                                    type="checkbox"
                                    name="localAnesthetic"
                                    checked={formData.allergies.localAnesthetic}
                                    onChange={handleAllergyChange}
                                />
                                &ensp;Local Anesthetic (e.g., Lidocaine)
                            </label>
                            <label style={styles.checkbox}>
                                <input
                                    type="checkbox"
                                    name="antibiotics"
                                    checked={formData.allergies.antibiotics}
                                    onChange={handleAllergyChange}
                                />
                                &ensp;Antibiotics (e.g., Penicillin)
                            </label>
                            <label style={styles.checkbox}>
                                <input
                                    type="checkbox"
                                    name="sulfa"
                                    checked={formData.allergies.sulfa}
                                    onChange={handleAllergyChange}
                                />
                                &ensp;Sulfa drugs
                            </label>
                            <label style={styles.checkbox}>
                                <input
                                    type="checkbox"
                                    name="aspirin"
                                    checked={formData.allergies.aspirin}
                                    onChange={handleAllergyChange}
                                />
                                &ensp;Aspirin
                            </label>
                            <label style={styles.checkbox}>
                                <input
                                    type="checkbox"
                                    name="latex"
                                    checked={formData.allergies.latex}
                                    onChange={handleAllergyChange}
                                />
                                &ensp;Latex
                            </label>
                            <label style={styles.checkbox}>
                                <input
                                    type="checkbox"
                                    name="other"
                                    checked={formData.allergies.other}
                                    onChange={handleAllergyChange}
                                />
                                &ensp;Other:
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


                    <label style={styles.label}>
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
                        <input type="number" name="pregnancyWeeks" value={formData.pregnancyWeeks} onChange={handleChange} style={styles.input} />
                    </label> <br />

                    <label style={styles.label}>
                        12. Blood Pressure:
                        <input type="text" name="pregnancyMedications" value={formData.pregnancyMedications} onChange={handleChange} style={styles.input} />
                    </label> <br />
                


                <label style={styles.label}>
    Do you have or have you had any of the following? Check which apply:
    <div style={styles.checkboxContainer}>
        <div>
            <input
                type="checkbox"
                name="heartDisease"
                checked={formData.conditions.heartDisease}
                onChange={handleConditionChange}
            />
            Heart Disease
        </div>
        <div>
            <input
                type="checkbox"
                name="heartMurmur"
                checked={formData.conditions.heartMurmur}
                onChange={handleConditionChange}
            />
            Heart Murmur
        </div>
        <div>
            <input
                type="checkbox"
                name="hepatitisLiverDisease"
                checked={formData.conditions.hepatitisLiverDisease}
                onChange={handleConditionChange}
            />
            Hepatitis / Liver Disease
        </div>
        <div>
            <input
                type="checkbox"
                name="rheumaticFever"
                checked={formData.conditions.rheumaticFever}
                onChange={handleConditionChange}
            />
            Rheumatic Fever
        </div>
        <div>
            <input
                type="checkbox"
                name="hayFeverAllergies"
                checked={formData.conditions.hayFeverAllergies}
                onChange={handleConditionChange}
            />
            Hay Fever / Allergies
        </div>
        <div>
            <input
                type="checkbox"
                name="respiratoryProblems"
                checked={formData.conditions.respiratoryProblems}
                onChange={handleConditionChange}
            />
            Respiratory Problems
        </div>
        <div>
            <input
                type="checkbox"
                name="hepatitisJaundice"
                checked={formData.conditions.hepatitisJaundice}
                onChange={handleConditionChange}
            />
            Hepatitis / Jaundice
        </div>
        <div>
            <input
                type="checkbox"
                name="tuberculosis"
                checked={formData.conditions.tuberculosis}
                onChange={handleConditionChange}
            />
            Tuberculosis
        </div>
        <div>
            <input
                type="checkbox"
                name="swollenAnkles"
                checked={formData.conditions.swollenAnkles}
                onChange={handleConditionChange}
            />
            Swollen Ankles
        </div>
        <div>
            <input
                type="checkbox"
                name="kidneyDisease"
                checked={formData.conditions.kidneyDisease}
                onChange={handleConditionChange}
            />
            Kidney Disease
        </div>
        <div>
            <input
                type="checkbox"
                name="diabetes"
                checked={formData.conditions.diabetes}
                onChange={handleConditionChange}
            />
            Diabetes
        </div>
        <div>
            <input
                type="checkbox"
                name="chestPain"
                checked={formData.conditions.chestPain}
                onChange={handleConditionChange}
            />
            Chest Pain
        </div>
        <div>
            <input
                type="checkbox"
                name="stroke"
                checked={formData.conditions.stroke}
                onChange={handleConditionChange}
            />
            Stroke
        </div>
        <div>
            <input
                type="checkbox"
                name="cancerTumors"
                checked={formData.conditions.cancerTumors}
                onChange={handleConditionChange}
            />
            Cancer / Tumors
        </div>
        <div>
            <input
                type="checkbox"
                name="anemia"
                checked={formData.conditions.anemia}
                onChange={handleConditionChange}
            />
            Anemia
        </div>
        <div>
            <input
                type="checkbox"
                name="angina"
                checked={formData.conditions.angina}
                onChange={handleConditionChange}
            />
            Angina
        </div>
        <div>
            <input
                type="checkbox"
                name="asthma"
                checked={formData.conditions.asthma}
                onChange={handleConditionChange}
            />
            Asthma
        </div>
        <div>
            <input
                type="checkbox"
                name="emphysema"
                checked={formData.conditions.emphysema}
                onChange={handleConditionChange}
            />
            Emphysema
        </div>
        <div>
            <input
                type="checkbox"
                name="bleedingProblems"
                checked={formData.conditions.bleedingProblems}
                onChange={handleConditionChange}
            />
            Bleeding Problems
        </div>
        <div>
            <input
                type="checkbox"
                name="bleedingDiseases"
                checked={formData.conditions.bleedingDiseases}
                onChange={handleConditionChange}
            />
            Bleeding Diseases
        </div>
        <div>
            <input
                type="checkbox"
                name="headInjuries"
                checked={formData.conditions.headInjuries}
                onChange={handleConditionChange}
            />
            Head Injuries
        </div>
        <div>
            <input
                type="checkbox"
                name="arthritisRheumatism"
                checked={formData.conditions.arthritisRheumatism}
                onChange={handleConditionChange}
            />
            Arthritis / Rheumatism
        </div>
        <div>
            <input
                type="checkbox"
                name="other"
                checked={formData.conditions.other}
                onChange={handleConditionChange}
            />
            Other:
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
      alignItems: 'flex-start', // Changed from center to flex-start
      padding: '20px', // Added padding
    },
    form: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        width: '1000px',
        overflowY: 'auto', // Added to allow scrolling if needed
        maxHeight: '90vh', // Added to limit the height
    },
    title: {
        textAlign: 'center',
        marginBottom: '20px',
    },
    label: {
        // display: 'block',
        // marginBottom: '10px',
        display: 'flex',
        alignItems: 'center', // Align items vertically centered
        marginBottom: '10px', // Space between each label-input pair
    },
    input: {
        // width: '100%',
        flex: 1,
        padding: '5px',
        // marginTop: '5px',
        // borderRadius: '4px',
        // border: '1px solid #ccc',
        // boxSizing: 'border-box',
        border: 'none',
        borderBottom: '1px solid black',
        
    },
    fieldset: {
        margin: '10px 0',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
    },
    button: {
        backgroundColor: '#007BFF',
        color: 'white',
        padding: '10px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        width: '100%',
    },
    dateInput: {
      // width: '100%',
      flex: 1,
      color: 'black', // Text color
        backgroundColor: 'white', // Background color
        padding: '8px',
        // border: '1px solid #ccc',
        // borderRadius: '4px',
        // boxSizing: 'border-box',
        WebkitAppearance: 'none', // For Safari
        MozAppearance: 'none', // For Firefox
        appearance: 'none', // General reset
        borderBottom: '1px solid black',
  },
    chackboxLabel: {
        display: 'block', // Ensure label is block-level for new lines
        marginBottom: '10px', // Space between each label
    },
    checkboxContainer: {
        display: 'flex',
        flexDirection: 'column', // Stack checkboxes vertically
        marginTop: '5px', // Space above the checkboxes
    },
    checkbox: {
        marginBottom: '5px', // Space between each checkbox
        marginLeft: '10px',
    },
    radioContainer: {
      display: 'flex',
      flexDirection: 'column', // Stack radio buttons vertically
      marginTop: '5px', // Space above the radio buttons
  },
  radioGroup: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '5px', // Spaace between each radio group
  },
  radioInput: {
      marginLeft: '5px', // Space between label and radio button
  },

  
};


export default DentalChartForm;
