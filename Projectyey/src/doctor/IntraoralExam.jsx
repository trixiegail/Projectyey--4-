import React, { useState } from 'react';
import './style.css';
import Nav from '../components/NavNurseDentist';
import './teethchart.css';

const teethUpper = [
  { id: 11, label: '11' }, { id: 12, label: '12' }, { id: 13, label: '13' },
  { id: 14, label: '14' }, { id: 15, label: '15' }, { id: 16, label: '16' },
  { id: 17, label: '17' }, { id: 18, label: '18' }, { id: 21, label: '21' },
  { id: 22, label: '22' }, { id: 23, label: '23' }, { id: 24, label: '24' },
  { id: 25, label: '25' }, { id: 26, label: '26' }, { id: 27, label: '27' },
  { id: 28, label: '28' },
];

const teethLower = [
  { id: 31, label: '31' }, { id: 32, label: '32' }, { id: 33, label: '33' },
  { id: 34, label: '34' }, { id: 35, label: '35' }, { id: 36, label: '36' },
  { id: 37, label: '37' }, { id: 38, label: '38' }, { id: 41, label: '41' },
  { id: 42, label: '42' }, { id: 43, label: '43' }, { id: 44, label: '44' },
  { id: 45, label: '45' }, { id: 46, label: '46' }, { id: 47, label: '47' },
  { id: 48, label: '48' },
];

const IntraoralExamination = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'male',
    date: '',
    toothStatus: '',
    customCondition: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toothNumber, setToothNumber] = useState('');
  const [customCondition, setCustomCondition] = useState('');

  // New state to store the status of each tooth
  const [toothStatuses, setToothStatuses] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalStatus = formData.toothStatus === 'other' ? customCondition : formData.toothStatus;
    console.log('Form submitted:', { ...formData, toothStatus: finalStatus });
  };

  const handleToothClick = (toothId) => {
    setToothNumber(toothId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const tableStyle = {
    borderCollapse: "collapse",
    width: "100%",
  };

  const cellStyle = {
    border: "1px solid black",
    padding: "5px",
  };

  
  

  const handleSave = () => {
    const finalStatus = formData.toothStatus === 'other' ? customCondition : formData.toothStatus;
    setToothStatuses((prevStatuses) => ({
      ...prevStatuses,
      [toothNumber]: finalStatus,
    }));
    closeModal();
  };

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const modalStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  };

  const modalButtonStyle = {
    backgroundColor: '#88343b',
    color: 'white',
    padding: '10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  const handlePrint = () => {
    window.print();
  };
  

  return (
    <>
      <Nav />
      <div style={styles.container}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <h1 style={styles.title}> 
            <strong>DENTAL CHART</strong>
          </h1>

          <h2>
          <strong>Patient Information Record</strong>
        </h2>
        <br />

        <label style={styles.label}>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          Age:
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            style={styles.input}
          />
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
          Date (mm/dd/yy):
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            style={styles.dateInput}
          />
        </label>


          <div className="teeth-chart-container">
  <div className="teeth-chart" style={{ ...styles.title, marginBottom: '-50px', marginTop:'-60px' }}>
    <img className="no-print" src="src/image/teeth.png" alt="Teeth Chart" />
    <div className="teeth-buttons">
      {/* Upper Teeth Buttons */}
      {teethUpper.map((tooth, index) => (
        <button
          key={tooth.id}
          className={`tooth-button tooth-upper-${tooth.id} no-print`}
          onClick={() => handleToothClick(tooth.id)}
        >
          {tooth.label}
        </button>
      ))}
      
      {/* Lower Teeth Buttons */}
      {teethLower.map((tooth, index) => (
        <button
          key={tooth.id}
          className={`tooth-button tooth-lower-${tooth.id} no-print`}
          onClick={() => handleToothClick(tooth.id)}
        >
          {tooth.label}
        </button>
      ))}
    </div>
  </div>

  {/* Status boxes for upper teeth */}
  <div className="status-container">
    <h3>Upper Teeth Status</h3>
    <div className="status-boxes">
      {teethUpper.slice(0, 8).map((tooth) => (
        <div key={tooth.id} className="tooth-status-box" >
          {tooth.id}: {toothStatuses[tooth.id] || ' '}
          
        </div>
        
      ))}
    </div>
    <div className="status-boxes">
      {teethUpper.slice(8).map((tooth) => (
        <div key={tooth.id} className="tooth-status-box">
          {tooth.id}: {toothStatuses[tooth.id] || ' '}
        </div>
      ))}
    </div>
  </div>

  {/* Status boxes for lower teeth */}
  <div className="status-container">
    <h3>Lower Teeth Status</h3>
    <div className="status-boxes">
      {teethLower.slice(0, 8).map((tooth) => (
        <div key={tooth.id} className="tooth-status-box">
          {tooth.id}: {toothStatuses[tooth.id] || ' '}
        </div>
      ))}
    </div>
    <div className="status-boxes">
      {teethLower.slice(8).map((tooth) => (
        <div key={tooth.id} className="tooth-status-box">
          {tooth.id}: {toothStatuses[tooth.id] || ' '}
        </div>
      ))}
    </div>
  </div>
</div>

  {/* Insert a page break here if needed */}
  <div className="print-page-break">
          <h3>Dental Examination Details</h3>
          <table style={tableStyle}>
            {/* Table content */}
          </table>
        </div>

        {/* Teeth Count Summary */}
        <div className="print-page-break">
          <h3>Teeth Count Summary</h3>
          <table style={tableStyle}>
            {/* Table content */}
          </table>
        </div>


          {/* Modal for selecting tooth status */}
          {isModalOpen && (
            <div style={modalOverlayStyle}>
              <div style={modalStyle}>
                <h2>Tooth Number <strong>{toothNumber}</strong></h2><br />

                <label style={styles.label}>
                  Tooth Status:
                  <select
                    name="toothStatus"
                    value={formData.toothStatus}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({ ...formData, toothStatus: value });
                      if (value === 'other') {
                        setCustomCondition('');
                      }
                    }}
                    style={{ ...styles.input, backgroundColor: 'white' }}
                  >
                    <option value="" disabled>Select Status</option>
                    <option value="/">/</option>
                    <option value="D">D</option>
                    <option value="F">F</option>
                    <option value="M">M</option>
                    <option value="Dx">Dx</option>
                    <option value="Un">Un</option>
                    <option value="S">S</option>
                    <option value="JC">JC</option>
                    <option value="P">P</option>
                    <option value="Rf">Rf</option>
                    <option value="Imp">Imp</option>
                    <option value="other">Other</option>
                  </select>
                </label><br />

                {formData.toothStatus === 'other' && (
                  <label style={styles.label}>
                    Custom Status:
                    <input
                      type="text"
                      value={customCondition}
                      onChange={(e) => setCustomCondition(e.target.value)}
                      style={styles.input}
                    />
                  </label>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button onClick={closeModal} style={modalButtonStyle}>Close</button>
                  <button onClick={handleSave} style={modalButtonStyle}
                    disabled={formData.toothStatus === 'other' && !customCondition.trim()}>
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

<div className='margintop'>
        <table style={tableStyle}>
        <thead>
          <tr>
            <th style={cellStyle}>Permanent</th>
            <th style={cellStyle}>Temporary</th>
            <th style={cellStyle}>Condition</th>
            <th style={cellStyle}></th>
            <th style={cellStyle}>Treatment</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={cellStyle}>/</td>
            <td style={cellStyle}>/</td>
            <td style={cellStyle}>Present Teeth (Sound/Sealed)</td>
            <td style={cellStyle}>FV </td>
            <td style={cellStyle}>Fluoride Varnish</td>
          </tr>
          <tr>
            <td style={cellStyle}>D</td>
            <td style={cellStyle}>d</td>
            <td style={cellStyle}>Decayed (Caries Indicated for Filling)</td>
            <td style={cellStyle}>FG </td>
            <td style={cellStyle}>Fluoride Gel</td>
          </tr>
          <tr>
            <td style={cellStyle}>F</td>
            <td style={cellStyle}>f</td>
            <td style={cellStyle}>Filled</td>
            <td style={cellStyle}>PFs</td>
            <td style={cellStyle}>Pit and Fissure Sealant</td>
          </tr>
          <tr>
            <td style={cellStyle}>M</td>
            <td style={cellStyle}>m</td>
            <td style={cellStyle}>Missing due to Caries</td>
            <td style={cellStyle}>Co/Resin/Am/Art</td>
            <td style={cellStyle}>Composite, Amalgam, Art</td>
          </tr>
          <tr>
            <td style={cellStyle}>Dx</td>
            <td style={cellStyle}>dx</td>
            <td style={cellStyle}>Indicated for Extraction</td>
            <td style={cellStyle}>X</td>
            <td style={cellStyle}>Extraction</td>
          </tr>
          <tr>
            <td style={cellStyle}>Un</td>
            <td style={cellStyle}>urn</td>
            <td style={cellStyle}>Unerupted</td>
            <td style={cellStyle}>TF</td>
            <td style={cellStyle}>Temporary Filling</td>
          </tr>
          <tr>
            <td style={cellStyle}>S</td>
            <td style={cellStyle}>s</td>
            <td style={cellStyle}>Supernumerary Tooth</td>
            <td style={cellStyle}>Porc C</td>
            <td style={cellStyle}>Porcelain Crown</td>
          </tr>
          <tr>
            <td style={cellStyle}>JC</td>
            <td style={cellStyle}>C</td>
            <td style={cellStyle}>Jacket Crown</td>
            <td style={cellStyle}>MC </td>
            <td style={cellStyle}>Metal Crown</td>
          </tr>
          <tr>
            <td style={cellStyle}>P</td>
            <td style={cellStyle}></td>
            <td style={cellStyle}>Pontic</td>
            <td style={cellStyle}>PFM</td>
            <td style={cellStyle}>Porcelain Fused to Metal Crown</td>
          </tr>
          <tr>
            <td style={cellStyle}>Rf</td>
            <td style={cellStyle}></td>
            <td style={cellStyle}>Root Fragment</td>
            <td style={cellStyle}>Ab</td>
            <td style={cellStyle}>Abutment</td>
          </tr>
          <tr>
            <td style={cellStyle}>Imp</td>
            <td style={cellStyle}></td>
            <td style={cellStyle}>Implant</td>
            <td style={cellStyle}>AC</td>
            <td style={cellStyle}>Acrylic Crown</td>
          </tr>
        </tbody>
      </table>

      <br />

      <h3>Dental Examination Details</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={cellStyle}>Details</th>
            <th style={cellStyle}>Check (√) if present, (x) if absent</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={cellStyle}>Date of Oral Examination</td>
            <td style={cellStyle}></td>
          </tr>
          <tr>
            <td style={cellStyle}>Dental Caries</td>
            <td style={cellStyle}></td>
            
          </tr>
          <tr>
            <td style={cellStyle}>Gingivitis</td>
            <td style={cellStyle}></td>
          </tr>
          <tr>
            <td style={cellStyle}>Periodontal Disease</td>
            <td style={cellStyle}></td>
          </tr>
          <tr>
            <td style={cellStyle}>Debris</td>
            <td style={cellStyle}></td>
          </tr>
          <tr>
            <td style={cellStyle}>Calculus Deposits</td>
            <td style={cellStyle}></td>
          </tr>
          <tr>
            <td style={cellStyle}>Abnormal Growth</td>
            <td style={cellStyle}></td>
          </tr>
          <tr>
            <td style={cellStyle}>Cleft / Palate</td>
            <td style={cellStyle}></td>
          </tr>
          <tr>
            <td style={cellStyle}>Others (supernumerary/mesiodens, malocclusions, etc.)</td>
            <td style={cellStyle}></td>
          </tr>
        </tbody>
      </table>

      <br />

      <h3>Teeth Count Summary</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={cellStyle}>Type</th>
            <th style={cellStyle}>Number</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={cellStyle}>No. of Permanent Teeth Present</td>
            <td style={cellStyle}></td>
          </tr>
          <tr>
            <td style={cellStyle}>No. of Permanent Sound Teeth</td>
            <td style={cellStyle}></td>
          </tr>
          <tr>
            <td style={cellStyle}>No. of Decayed Teeth (D)</td>
            <td style={cellStyle}></td>
          </tr>
          <tr>
            <td style={cellStyle}>No. of Missing Teeth (M)</td>
            <td style={cellStyle}></td>
          </tr>
          <tr>
            <td style={cellStyle}>No. of Filled Teeth (F)</td>
            <td style={cellStyle}></td>
          </tr>
          <tr>
            <td style={cellStyle}>Total DMF Teeth</td>
            <td style={cellStyle}></td>
          </tr>
          <tr>
            <td style={cellStyle}>No. of Temporary Teeth Present</td>
            <td style={cellStyle}></td>
          </tr>
          <tr>
            <td style={cellStyle}>No. of Temporary Sound Teeth</td>
            <td style={cellStyle}></td>
          </tr>
          <tr>
            <td style={cellStyle}>No. of Decayed Temporary Teeth (D)</td>
            <td style={cellStyle}></td>
          </tr>
          <tr>
            <td style={cellStyle}>No. of Missing Temporary Teeth (M)</td>
            <td style={cellStyle}></td>
          </tr>
          <tr>
            <td style={cellStyle}>No. of Filled Temporary Teeth (F)</td>
            <td style={cellStyle}></td>
          </tr>
          <tr>
            <td style={cellStyle}>Total Temporary DMF Teeth</td>
            <td style={cellStyle}></td>
          </tr>
          <tr>
            <td style={cellStyle}>Total Number of Teeth</td>
            <td style={cellStyle}></td>
          </tr>
        </tbody>
      </table>
    </div>

          
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
  <button className="no-print" type="submit" style={{ ...styles.button, width: '200px', color:'white' }}>
    Submit
  </button>

  <button className="no-print" type="button" onClick={handlePrint} style={{ ...styles.button, width: '200px', color:'white' }}>
    Print
  </button>
</div>


        </form>
        
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  <img
    style={{ width: '500px', height: 'auto', marginBottom:'20px' }}
    src="src/image/teethNumber.png"
    alt="teethNumber"
  />
  <img
    style={{ width: '460px', height: 'auto' , marginBottom:'20px'}}
    src="src/image/teethQuadrants.png"
    alt="teethQuadrants"
  />
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
    // overflowY: 'auto',
    // maxHeight: '90vh',
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
  button: {
    backgroundColor: '#88343b',
    color: 'white',
    padding: '10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    width: '100%',
    color: 'black',
  },
  dateInput: {
    flex: 1,
    color: 'black',
    backgroundColor: 'white',
    padding: '8px',
    borderBottom: '1px solid black',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    appearance: 'none',
    color: 'black',
  },

  
};


export default IntraoralExamination;
