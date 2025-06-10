const express = require('express');
const router = express.Router();
const Doctors = require('../models/doctors.model');
const { updateAllDoctorsSchedule, updateDoctorSchedule } = require('../services/scheduleService');

router.get('/doctors/:id/schedule', async (req, res) => {
  try {
    const doctor = await Doctors.findById(req.params.id, {schedule: 1});
    if (!doctor) {
      return res.status(404).json({ message: 'doctor not found' });
    }
    res.status(200).json(doctor.schedule || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/admin/doctors/update-schedules', async (req, res) => {
  try {
    const result = await updateAllDoctorsSchedule();
    res.status(200).json({ 
      message: 'all doctors schedules updated successfully',
      modifiedCount: result.modifiedCount 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/doctors/:id/update-schedule', async (req, res) => {
  try {
    const doctor = await updateDoctorSchedule(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'doctor not found' });
    }
    res.status(200).json({ 
      message: 'doctor schedule updated successfully',
      schedule: doctor.schedule 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/doctors/:id/schedule/:dateIndex/book', async (req, res) => {
  try {
    const { id, dateIndex } = req.params;
    const { timeSlotIndex } = req.body;
    
    if (timeSlotIndex === undefined) {
      return res.status(400).json({ message: 'time slot index is required' });
    }
    
    const doctor = await Doctors.findById(id);
    if (!doctor) {
      return res.status(404).json({ message: 'doctor not found' });
    }
    
    if (!doctor.schedule || !doctor.schedule[dateIndex]) {
      return res.status(404).json({ message: 'specified date not found' });
    }
    
    if (!doctor.schedule[dateIndex].timeSlots[timeSlotIndex]) {
      return res.status(404).json({ message: 'specified time slot not found' });
    }
    
    if (!doctor.schedule[dateIndex].timeSlots[timeSlotIndex].isAvailable) {
      return res.status(400).json({ message: 'this time slot is already booked' });
    }
    
    const updatePath = `schedule.${dateIndex}.timeSlots.${timeSlotIndex}.isAvailable`;
    const updatedDoctor = await Doctors.findByIdAndUpdate(
      id,
      { $set: { [updatePath]: false } },
      { new: true }
    );
    
    res.status(200).json({ 
      message: 'time slot successfully booked',
      updatedSlot: updatedDoctor.schedule[dateIndex].timeSlots[timeSlotIndex]
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// book a range of time slots
router.patch('/doctors/:id/schedule/:dateIndex/book-range', async (req, res) => {
  try {
    const { id, dateIndex } = req.params;
    const { startSlotIndex, endSlotIndex } = req.body;
    
    if (startSlotIndex === undefined || endSlotIndex === undefined) {
      return res.status(400).json({ message: 'start and end time slot indices are required' });
    }
    
    if (startSlotIndex > endSlotIndex) {
      return res.status(400).json({ message: 'start time must be before end time' });
    }
    
    const doctor = await Doctors.findById(id);
    if (!doctor) {
      return res.status(404).json({ message: 'doctor not found' });
    }
    
    if (!doctor.schedule || !doctor.schedule[dateIndex]) {
      return res.status(404).json({ message: 'specified date not found' });
    }
    
    // check if all slots exist
    for (let i = startSlotIndex; i <= endSlotIndex; i++) {
      if (!doctor.schedule[dateIndex].timeSlots[i]) {
        return res.status(404).json({ message: `time slot at index ${i} not found` });
      }
      
      if (!doctor.schedule[dateIndex].timeSlots[i].isAvailable) {
        return res.status(400).json({ 
          message: `time slot at index ${i} (${doctor.schedule[dateIndex].timeSlots[i].time}) is already booked` 
        });
      }
    }
    
    // create an array of all updates that need to be made
    const updates = {};
    for (let i = startSlotIndex; i <= endSlotIndex; i++) {
      updates[`schedule.${dateIndex}.timeSlots.${i}.isAvailable`] = false;
    }
    
    const updatedDoctor = await Doctors.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );
    
    // retrieve updated slots
    const updatedSlots = [];
    for (let i = startSlotIndex; i <= endSlotIndex; i++) {
      updatedSlots.push(updatedDoctor.schedule[dateIndex].timeSlots[i]);
    }
    
    // calculate total visit time
    const startTime = doctor.schedule[dateIndex].timeSlots[startSlotIndex].time;
    const endTime = doctor.schedule[dateIndex].timeSlots[endSlotIndex].time;
    
    // visit details
    const visitDetails = {
      startTime,
      endTime,
      range: `${startTime}-დან ${endTime}-მდე`,
      durationMinutes: (endSlotIndex - startSlotIndex) * 15
    };
    
    res.status(200).json({ 
      message: 'time range successfully booked',
      updatedSlots,
      visitDetails
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;