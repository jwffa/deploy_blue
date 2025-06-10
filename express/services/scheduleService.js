const Doctors = require('../models/doctors.model');

function generateTimeSlots() {
  const slots = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      slots.push({
        time: `${formattedHour}:${formattedMinute}`,
        isAvailable: true
      });
    }
  }
  return slots;
}

const georgianDays = ['კვირა', 'ორშაბათი', 'სამშაბათი', 'ოთხშაბათი', 'ხუთშაბათი', 'პარასკევი', 'შაბათი'];

const georgianMonths = [
  'იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი',
  'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი'
];

function generateSchedule() {
  const schedule = [];
  const today = new Date();
  
  for (let i = 0; i < 15; i++) {
    const currentDate = new Date();
    currentDate.setDate(today.getDate() + i);
    
    const day = georgianDays[currentDate.getDay()];
    const month = georgianMonths[currentDate.getMonth()];
    
    schedule.push({
      date: currentDate,
      day: day,
      month: month,
      timeSlots: generateTimeSlots()
    });
  }
  
  return schedule;
}

// update schedule for all doctors
async function updateAllDoctorsSchedule() {
  try {
    const newSchedule = generateSchedule();
    const result = await Doctors.updateMany({}, { $set: { schedule: newSchedule } });
    console.log(`updated schedule for ${result.modifiedCount} doctors!`);
    console.log("new schedule:", newSchedule);
    return result;
  } catch (error) {
    console.error('an error occurred while updating the schedule:', error);
    throw error;
  }
}

async function updateDoctorSchedule(doctorId) {
  try {
    const newSchedule = generateSchedule();
    const result = await Doctors.findByIdAndUpdate(
      doctorId, 
      { $set: { schedule: newSchedule } },
      { new: true }
    );
    return result;
  } catch (error) {
    console.error(`an error occurred while updating the schedule for doctor (ID: ${doctorId}):`, error);
    throw error;
  }
}





module.exports = {
  updateAllDoctorsSchedule,
  updateDoctorSchedule,
  generateSchedule
};