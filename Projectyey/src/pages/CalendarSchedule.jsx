import React, { useState, useEffect } from 'react';
import './CalendarSchedule.css';
import { Modal, Switch, Button, Row, Col, InputNumber, message } from 'antd';
import NavNurseDentist from '../components/NavNurseDentist';
import { format, startOfMonth, endOfMonth, addMonths, eachDayOfInterval } from 'date-fns';

const CalendarSchedule = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [morningAvailable, setMorningAvailable] = useState(false);
  const [afternoonAvailable, setAfternoonAvailable] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [timeModalVisible, setTimeModalVisible] = useState(false);
  const [availabilityModalVisible, setAvailabilityModalVisible] = useState(false);
  const [timeAvailability, setTimeAvailability] = useState({});
  const [activities, setActivities] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduleData, setScheduleData] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentEditSchedule, setCurrentEditSchedule] = useState(null);

  useEffect(() => {
    // Fetch schedule data when the component mounts
    fetchScheduleData();
    
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchScheduleData = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/schedule');
      if (response.ok) {
        const data = await response.json();
        setScheduleData(data);
      } else {
        message.error('Failed to fetch schedule data.');
      }
    } catch (error) {
      message.error('Error fetching schedule data: ' + error.message);
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setMorningAvailable(false);
    setAfternoonAvailable(false);
    setAvailabilityModalVisible(true);
    setActivities({});
    setTimeAvailability({});
  };

  const handleMorningToggle = (checked) => {
    setMorningAvailable(checked);
  };

  const handleAfternoonToggle = (checked) => {
    setAfternoonAvailable(checked);
  };

  const toggleTimeModal = () => {
    setTimeModalVisible(!timeModalVisible);
  };

  const handleTimeToggle = (hour) => (checked) => {
    setTimeAvailability(prevAvailability => ({
      ...prevAvailability,
      [hour]: checked
    }));
  };

  const handleActivityChange = (hour) => (value) => {
    setActivities(prevActivities => ({
      ...prevActivities,
      [hour]: value
    }));
  };

  const handleSaveSchedule = async () => {
    if (selectedDate) {
      const formattedSelectedDate = format(selectedDate, 'yyyy-MM-dd');
      const newScheduleData = Object.keys(timeAvailability)
        .filter(hour => timeAvailability[hour]) // Filter out unchecked hours
        .map(hour => ({
          date: formattedSelectedDate,
          time: `${hour % 12 || 12}:00 ${hour >= 12 ? 'PM' : 'AM'}`,
          students: activities[hour] || 0,
          slotsLeft: 10 - (activities[hour] || 0)  // Assuming 10 slots max per hour
        }));
      
      setScheduleData([...scheduleData, ...newScheduleData]);

      // Save to the database
      await saveScheduleToDatabase(newScheduleData);
    }
    setTimeModalVisible(false);
  };

  const saveScheduleToDatabase = async (newScheduleData) => {
    try {
      const response = await fetch('http://localhost:8080/api/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newScheduleData)
      });

      if (response.ok) {
        message.success('Schedule saved successfully!');
      } else {
        message.error('Failed to save schedule.');
      }
    } catch (error) {
      message.error('Error saving schedule: ' + error.message);
    }
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, -1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, 1));
  };

  const startDate = startOfMonth(currentMonth);
  const endDate = endOfMonth(currentMonth);
  const datesInMonth = eachDayOfInterval({ start: startDate, end: endDate });

  const formattedDate = (date) => format(date, 'yyyy-MM-dd');

  const renderTimeSlots = () => {
    const hours = Array.from({ length: 9 }, (_, index) => index + 8);
    return (
      <>
        {hours.map(hour => (
          <Row key={hour} style={{ marginBottom: 2 }}>
            <Col span={12}>
              <span>{hour === 12 ? 12 : hour % 12}:00 {(hour >= 12 ? 'PM' : 'AM')}</span>
            </Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              <Switch
                checked={timeAvailability[hour]}
                onChange={handleTimeToggle(hour)}
              />
              {timeAvailability[hour] && (
                <InputNumber
                  min={0}
                  max={10}
                  defaultValue={activities[hour] || 0}
                  onChange={handleActivityChange(hour)}
                  style={{ marginLeft: 5 }}
                />
              )}
            </Col>
          </Row>
        ))}
      </>
    );
  };

  const handleEditClick = (schedule) => {
    setCurrentEditSchedule(schedule);
    setEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    const updatedScheduleData = scheduleData.map(item => {
      if (item.date === currentEditSchedule.date && item.time === currentEditSchedule.time) {
        return currentEditSchedule;
      }
      return item;
    });
    setScheduleData(updatedScheduleData);
    setEditModalVisible(false);

    // Update the database
    await saveScheduleToDatabase(updatedScheduleData);
  };

  const renderEditModal = () => (
    <Modal
      title="Edit Schedule"
      open={editModalVisible}
      onCancel={() => setEditModalVisible(false)}
      footer={[
        <Button key="cancel" onClick={() => setEditModalVisible(false)}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={handleSaveEdit}>
          Save
        </Button>
      ]}
    >
      <Row style={{ marginBottom: 2 }}>
        <Col span={12}>
          <span>Time: {currentEditSchedule ? currentEditSchedule.time : ''}</span>
        </Col>
        <Col span={12} style={{ textAlign: 'right' }}>
          <InputNumber
            min={0}
            max={10}
            value={currentEditSchedule ? currentEditSchedule.students : 0}
            onChange={(value) => setCurrentEditSchedule({
              ...currentEditSchedule,
              students: value
            })}
            style={{ marginLeft: 5 }}
          />
        </Col>
      </Row>
    </Modal>
  );

  const renderScheduleDetails = () => {
    const filteredScheduleData = scheduleData.filter(item => item.date === formattedDate(selectedDate));
    return filteredScheduleData.map((item, index) => (
      <div key={index} className="schedule-item">
        <span>{item.time}</span>
        <span>{item.students !== undefined ? `${item.students} students` : `${item.slotsLeft} slots left`}</span>
        <Button onClick={() => handleEditClick(item)}>Add</Button>
      </div>
    ));
  };

  return (
    <div className="calendar-container">
      <NavNurseDentist />
      <br/>
      <div className="calendar">
        <div className="calendar-header">
          <Button onClick={goToPreviousMonth}>{'<'}</Button>
          <h3>{format(currentMonth, 'MMMM yyyy')}</h3>
          <Button onClick={goToNextMonth}>{'>'}</Button>
        </div>
        <div className="calendar-days-header">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="calendar-day-label">{day}</div>
          ))}
        </div>
        <div className="calendar-grid">
          {datesInMonth.map((date) => (
            <div
              key={date.toISOString()}
              className={`calendar-day ${selectedDate && date.toISOString() === selectedDate.toISOString() ? 'selected' : ''}`}
              onClick={() => handleDateClick(date)}
            >
              <div className="calendar-date">{format(date, 'dd')}</div>
            </div>
          ))}
        </div>
        <Modal
          title={`Availability for ${selectedDate ? formattedDate(selectedDate) : ''}`}
          open={availabilityModalVisible}
          onCancel={() => setAvailabilityModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setAvailabilityModalVisible(false)}>
              Close
            </Button>,
            <Button key="save" type="primary" onClick={toggleTimeModal}>
              Set Time
            </Button>
          ]}
        >
          <div>
            <h4>Morning</h4>
            <Switch
              checked={morningAvailable}
              onChange={handleMorningToggle}
            />
          </div>
          <div>
            <h4>Afternoon</h4>
            <Switch
              checked={afternoonAvailable}
              onChange={handleAfternoonToggle}
            />
          </div>
        </Modal>
        <Modal
          title="Set Availability by Time"
          open={timeModalVisible}
          onCancel={toggleTimeModal}
          footer={[
            <Button key="cancel" onClick={toggleTimeModal}>
              Close
            </Button>,
            <Button key="save" type="primary" onClick={handleSaveSchedule}>
              Save
            </Button>
          ]}
        >
          {renderTimeSlots()}
        </Modal>
        <div className="schedule-details">
          <h4>Schedule Details</h4>
          {selectedDate && renderScheduleDetails()}
        </div>
      </div>
      {renderEditModal()}
    </div>
  );
};

export default CalendarSchedule;
