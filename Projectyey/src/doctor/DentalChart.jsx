import React, { useState } from 'react';
import './style.css';
import Nav from '../components/NavNurseDentist';

const DentalChartForm = () => {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        birthdate: '',
        gender: 'male',
        age: '',
        nationality: '',
        mobileNo: '',
        email: '',
        dentalInsurance: '',
        effectiveDate: '',
        chiefComplaint: '',
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
                        name="gender" 
                        value={formData.gender} 
                        onChange={handleChange} 
                        style={{ ...styles.input, backgroundColor: 'white' }} 
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </label>

                <label style={styles.label}>
                    Nationality:
                    <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} style={styles.input} />
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
