import React from 'react';
 
const PrintView = ({ studentInfo, selectedRecord }) => {
  return (
    <div id="printView" style={styles.printView}>
      <div style={styles.header}>
        <h1 style={styles.title}>Student Medical Report</h1>
      </div>
      <div style={styles.container}>
        <div style={styles.section}>
          <h2 style={styles.subtitle}>Student Information</h2>
          <div style={styles.row}>
            <span style={styles.label}>Full Name:</span> {studentInfo.fullName}
          </div>
          <div style={styles.row}>
            <span style={styles.label}>ID Number:</span> {studentInfo.id}
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Department:</span> {studentInfo.department}
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Course:</span> {studentInfo.course}
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Year:</span> {studentInfo.year}
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Date of Birth:</span> {studentInfo.dateOfBirth}
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Phone Number:</span> {studentInfo.phoneNumber}
          </div>
        </div>
        <div style={styles.section}>
          <h2 style={styles.subtitle}>Checkup Results</h2>
          <div style={styles.row}>
            <span style={styles.label}>Blood Pressure:</span> {selectedRecord?.bloodPressure || 'N/A'}
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Heart Rate:</span> {selectedRecord?.heartRate || 'N/A'}
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Respiratory Rate:</span> {selectedRecord?.respiratoryRate || 'N/A'}
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Temperature:</span> {selectedRecord?.temperature || 'N/A'}
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Oral Health Status:</span> {selectedRecord?.oralHealthStatus || 'N/A'}
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Presence of Cavities:</span> {selectedRecord?.cavities || 'N/A'}
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Gum Health:</span> {selectedRecord?.gumHealth || 'N/A'}
          </div>
          <div style={styles.row}>
            <span style={styles.label}>General Health Condition:</span> {selectedRecord?.generalHealth || 'N/A'}
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Any Specific Health Concerns:</span> {selectedRecord?.healthConcerns || 'N/A'}
          </div>
        </div>
      </div>
      <div style={styles.footer}>
        <p style={styles.footerText}>Date Issued: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
};
 
const styles = {
  printView: {
    padding: '30px',
    fontFamily: 'Times New Roman, serif',
    border: '2px solid black',
    background: '#f9f9f9',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box'
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    borderBottom: '2px solid black',
    paddingBottom: '10px'
  },
  container: {
    marginTop: '20px'
  },
  section: {
    marginBottom: '20px'
  },
  subtitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    borderBottom: '1px solid black',
    paddingBottom: '5px'
  },
  row: {
    marginBottom: '10px'
  },
  label: {
    fontWeight: 'bold'
  },
  footer: {
    marginTop: '30px',
    textAlign: 'center'
  },
  footerText: {
    fontSize: '14px'
  }
};
 
export default PrintView;