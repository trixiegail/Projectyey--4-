import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Checkbox,
    FormControlLabel,
    MenuItem,
    Paper,
    List,
    ListItem,
    ListItemText,
    Divider,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { Add, Delete, Visibility } from '@mui/icons-material';

const FormManagement = () => {
    const [forms, setForms] = useState([]);
    const [formName, setFormName] = useState('');
    const [fields, setFields] = useState([{ fieldName: '', fieldType: 'text', label: '', required: false }]);
    const [selectedForm, setSelectedForm] = useState(null);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [showAllForms, setShowAllForms] = useState(false); // State to control visibility of form list

    useEffect(() => {
        fetchForms();
    }, []);

    const fetchForms = async () => {
      try {
          const response = await axios.get('http://localhost:8080/api/forms');
          console.log('Fetched forms:', response.data); // Log the fetched data to verify it's correct
          if (Array.isArray(response.data)) {
              setForms(response.data); // Set the state with all forms from the response
          } else {
              console.error('Expected an array but got:', response.data);
              setForms([]); // Reset the forms if the response is not an array
          }
      } catch (error) {
          console.error('Error fetching forms:', error);
          setForms([]); // Reset the forms in case of an error
      }
  };
  
  

    const handleFieldChange = (index, event) => {
        const newFields = fields.slice();
        newFields[index][event.target.name] = event.target.value;
        setFields(newFields);
    };

    const addField = () => {
        setFields([...fields, { fieldName: '', fieldType: 'text', label: '', required: false }]);
    };

    const removeField = (index) => {
        const newFields = fields.slice();
        newFields.splice(index, 1);
        setFields(newFields);
    };

    const createForm = async () => {
        const form = { name: formName, fields: fields };
        await axios.post('http://localhost:8080/api/forms', form);
        fetchForms();
        setFormName('');
        setFields([{ fieldName: '', fieldType: 'text', label: '', required: false }]);
    };

    const handleViewForm = (form) => {
        setSelectedForm(form);
        setViewDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setViewDialogOpen(false);
        setSelectedForm(null);
    };

    const toggleShowAllForms = () => {
        setShowAllForms(!showAllForms); // Toggle the visibility state
    };

    const deleteForm = async (id) => {
      try {
          await axios.delete(`http://localhost:8080/api/forms/${id}`);
          fetchForms(); // Refresh the list after deletion
      } catch (error) {
          console.error('Error deleting form:', error);
      }
  };

  const deleteAllForms = async () => {
      try {
          await axios.delete('http://localhost:8080/api/forms');
          setForms([]); // Clear the state after deleting all forms
      } catch (error) {
          console.error('Error deleting all forms:', error);
      }
  };

    return (
        <Container maxWidth="md" style={{ marginTop: '2rem' }}>
            <Typography variant="h4" align="center" gutterBottom>
                Form Management
            </Typography>
            <Paper elevation={3} style={{ padding: '2rem' }}>
                <Box mb={2}>
                    <TextField
                        fullWidth
                        label="Form Name"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        variant="outlined"
                        margin="normal"
                    />
                </Box>
                <Typography variant="h6">Fields</Typography>
                {fields.map((field, index) => (
                    <Box key={index} display="flex" alignItems="center" mb={2}>
                        <TextField
                            label="Field Name"
                            name="fieldName"
                            value={field.fieldName}
                            onChange={(e) => handleFieldChange(index, e)}
                            variant="outlined"
                            margin="normal"
                            style={{ marginRight: '1rem', flex: 1 }}
                        />
                        <TextField
                            label="Label"
                            name="label"
                            value={field.label}
                            onChange={(e) => handleFieldChange(index, e)}
                            variant="outlined"
                            margin="normal"
                            style={{ marginRight: '1rem', flex: 1 }}
                        />
                        <TextField
                            select
                            label="Field Type"
                            name="fieldType"
                            value={field.fieldType}
                            onChange={(e) => handleFieldChange(index, e)}
                            variant="outlined"
                            margin="normal"
                            style={{ marginRight: '1rem', flex: 1 }}
                        >
                            <MenuItem value="text">Text</MenuItem>
                            <MenuItem value="number">Number</MenuItem>
                            <MenuItem value="date">Date</MenuItem>
                        </TextField>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="required"
                                    checked={field.required}
                                    onChange={(e) =>
                                        handleFieldChange(index, {
                                            target: { name: 'required', value: e.target.checked }
                                        })
                                    }
                                />
                            }
                            label="Required"
                            style={{ marginRight: '1rem' }}
                        />
                        <IconButton onClick={() => removeField(index)} color="secondary">
                            <Delete />
                        </IconButton>
                    </Box>
                ))}
                <Box mb={2}>
                    <Button onClick={addField} startIcon={<Add />} color="primary" variant="outlined">
                        Add Field
                    </Button>
                </Box>
                <Box>
                    <Button onClick={createForm} color="primary" variant="contained">
                        Create Form
                    </Button>
                </Box>
            </Paper>
            <Box mt={4} display="flex" justifyContent="center">
                <Button onClick={toggleShowAllForms} color="primary" variant="contained">
                    {showAllForms ? 'Hide All My Forms' : 'View All My Forms'}
                </Button>
            </Box>
            {showAllForms && (
                <div>
                    <Typography variant="h5" align="center" style={{ marginTop: '2rem' }}>
                        Existing Forms
                    </Typography>
                    <Box display="flex" justifyContent="center" mb={2}>
                        <Button onClick={deleteAllForms} color="secondary" variant="contained">
                            Delete All Forms
                        </Button>
                    </Box>
                    <List>
                        {forms.length > 0 ? (
                            forms.map((form) => (
                                <React.Fragment key={form.id}>
                                    <ListItem>
                                        <ListItemText
                                            primary={form.name || 'Unnamed Form'}
                                            secondary={`ID: ${form.id}`}
                                        />
                                        <IconButton onClick={() => deleteForm(form.id)} color="secondary">
                                            <Delete />
                                        </IconButton>
                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            ))
                        ) : (
                            <Typography variant="body1" align="center">
                                No forms available.
                            </Typography>
                        )}
                    </List>
                </div>
            )}

            {/* Dialog for viewing a single form */}
            <Dialog open={viewDialogOpen} onClose={handleCloseDialog} fullWidth>
                <DialogTitle>View Form</DialogTitle>
                <DialogContent>
                    {selectedForm ? (
                        <>
                            <Typography variant="h6">Form Name: {selectedForm.name}</Typography>
                            <List>
                                {selectedForm.fields.map((field) => (
                                    <ListItem key={field.id}>
                                        <ListItemText
                                            primary={`${field.label} (${field.fieldType})`}
                                            secondary={field.required ? 'Required' : 'Optional'}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </>
                    ) : (
                        <Typography>No form selected.</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default FormManagement;
