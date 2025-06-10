import { useState, useEffect } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { apiUrl } from '../../src/config';

const DoctorSchedule = ({id}) => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectionStart, setSelectionStart] = useState(null);
  const [selectionEnd, setSelectionEnd] = useState(null);
  const [selectedRange, setSelectedRange] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [price, setPrice] = useState(null);
  const [maxDurationExceeded, setMaxDurationExceeded] = useState(false);
  
  // maximum duration in minutes (1 hour)
  const maxDurationMinute = 60;
  
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${apiUrl}/doctors/${id}/schedule`);
        
        if (!response.ok) {
            throw new Error('failed to load schedule');
        }
        
        const data = await response.json();
        setSchedule(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'განრიგის ჩატვირთვა ვერ მოხერხდა');
        setLoading(false);
        console.error('error fetching schedule:', err);
      }
    };
    fetchSchedule();    
  }, [id]);

  // function that calculates the difference between times in minutes
  const calculateTimeDifference = (startTime, endTime) => {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    return endMinutes - startMinutes;
  };

  // function that checks if a time slot is within the selected interval
  const isInSelectedRange = (dayIndex, slotTime) => {
    if (!selectionStart || !selectionEnd) return false;
    
    if (selectionStart.dayIndex !== dayIndex || selectionEnd.dayIndex !== dayIndex) return false;
    
    const startTime = selectionStart.time;
    const endTime = selectionEnd.time;
    
    // compare time strings
    return slotTime >= startTime && slotTime <= endTime;
  };

  // check if selected duration exceeds the maximum allowed limit
  const checkMaxDurationLimit = (startTime, endTime) => {
    const durationMinutes = calculateTimeDifference(startTime, endTime);
    return durationMinutes <= maxDurationMinute;
  };

  const handleTimeSlotClick = (dayIndex, slotIndex, slotTime) => {
    // if first time is selected
    if (!selectionStart) {
      setSelectionStart({ dayIndex, slotIndex, time: slotTime });
      setMaxDurationExceeded(false);
      return;
    }
    
    // if second time is selected
    if (selectionStart && !selectionEnd) {
      // check that second time is on the same day and greater than first time
      if (dayIndex === selectionStart.dayIndex && slotTime > selectionStart.time) {
        // check maximum duration limit
        if (!checkMaxDurationLimit(selectionStart.time, slotTime)) {
          setMaxDurationExceeded(true);
          return;
        }
        
        setMaxDurationExceeded(false);
        setSelectionEnd({ dayIndex, slotIndex, time: slotTime });
        
        // calculate the difference
        const durationMinutes = calculateTimeDifference(selectionStart.time, slotTime);
        setSelectedDuration(durationMinutes);
        setSelectedRange(`${selectionStart.time}-დან ${slotTime}-მდე`);
        
        // calculate price
        const calculatedPrice = (durationMinutes / 15) * 10;
        setPrice(calculatedPrice);
      } else if (dayIndex === selectionStart.dayIndex && slotTime <= selectionStart.time) {
        // if second time is less than first, cancel first selection and make this the first
        setSelectionStart({ dayIndex, slotIndex, time: slotTime });
        setSelectionEnd(null);
        setSelectedRange(null);
        setSelectedDuration(null);
        setPrice(null);
        setMaxDurationExceeded(false);
      } else {
        // another day selected
        setSelectionStart({ dayIndex, slotIndex, time: slotTime });
        setSelectionEnd(null);
        setSelectedRange(null);
        setSelectedDuration(null);
        setPrice(null);
        setMaxDurationExceeded(false);
      }
      return;
    }
    
    // if both times are selected, clear and start over
    setSelectionStart({ dayIndex, slotIndex, time: slotTime });
    setSelectionEnd(null);
    setSelectedRange(null);
    setSelectedDuration(null);
    setPrice(null);
    setMaxDurationExceeded(false);
  };

  const handleBookAppointment = async () => {
    if (!selectionStart || !selectionEnd) {
      alert('გთხოვთ აირჩიოთ დროის ინტერვალი');
      return;
    }
    
    try {
      // here all intermediate slots will be booked
      const dayIndex = selectionStart.dayIndex;
      const startSlotIndex = selectionStart.slotIndex;
      const endSlotIndex = selectionEnd.slotIndex;
      
      const response = await fetch(
        `${apiUrl}/api/doctors/${id}/schedule/${dayIndex}/book-range`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            startSlotIndex: startSlotIndex,
            endSlotIndex: endSlotIndex 
          }),
        }
      );

      if (!response.ok) {
        throw new Error('ვიზიტის დაჯავშნა ვერ მოხერხდა');
      }
    
      // update locally
      const updatedSchedule = [...schedule];
      for (let i = startSlotIndex; i <= endSlotIndex; i++) {
        updatedSchedule[dayIndex].timeSlots[i].isAvailable = false;
      }
      
      setSchedule(updatedSchedule);
      setSelectionStart(null);
      setSelectionEnd(null);
      setSelectedRange(null);
      setSelectedDuration(null);
      setPrice(null);
      
      alert(`ვიზიტი წარმატებით დაიჯავშნა! ${selectedRange}, ხანგრძლივობა: ${selectedDuration} წუთი.`);
    } catch (err) {
      alert(err.message || 'ვიზიტის დაჯავშნა ვერ მოხერხდა');
      console.error('error booking appointment:', err);
    }
  };

  // group days into sets of three
  const groupedDays = [];
  for (let i = 0; i < schedule.length; i += 3) {
    groupedDays.push(schedule.slice(i, i + 3));
  }

  // slick parameters
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  // formatting date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.getDate();
  };

  if (loading) return <div className="flex justify-center items-center h-64 text-lg">იტვირთება განრიგი...</div>;
  if (error) return <div className="flex justify-center items-center h-64 text-lg text-red-600">{error}</div>;
  if (!schedule || schedule.length === 0) return <div className="flex justify-center items-center h-64 text-lg">განრიგი არ არის ხელმისაწვდომი</div>;

  return (
    <div className="max-w-[480px]">
      <p className='font-poppins text-[#0b2849] text-2xl font-bold mb-5'>დაჯავშნა</p>
      
      {maxDurationExceeded && (
        <div className="mb-4 p-3 bg-red-100 rounded-lg">
          <p className="font-poppins text-sm text-red-700">
            დროის ინტერვალი აღემატება მაქსიმალურ დასაშვებ ხანგრძლივობას (1 საათი).
            გთხოვთ, აირჩიოთ უფრო მოკლე ინტერვალი.
          </p>
        </div>
      )}
      
      {selectedRange && (
        <div className="mb-4 p-3 bg-green-100 rounded-lg">
          <p className="font-poppins text-sm text-[#0b2849]">არჩეული დროის ინტერვალი: {selectedRange}</p>
          <p className="font-poppins text-sm text-[#0b2849] mt-1">ხანგრძლივობა: {selectedDuration} წუთი</p>
          {price !== null ? <p className='font-poppins text-sm text-[#0b2849] mt-1'>კონსულტაციის ფასი: <strong>{price} ლარი</strong></p> : null}
          <button 
            onClick={handleBookAppointment}
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded cursor-pointer"
          >
            დაჯავშნა
          </button>
        </div>
      )}
      
      <Slider {...settings} className="mb-8">
        {groupedDays.map((group, groupIndex) => (
          <div key={groupIndex}>
            <div className="grid grid-cols-3 gap-4 ">
              {group.map((daySchedule, dayIndex) => {
                const actualIndex = groupIndex * 3 + dayIndex;
                return (
                  <div key={actualIndex} className="rounded-lg shadow-md bg-white overflow-hidden">
                    <div className="bg-[#0b2849] text-white p-2 text-center">
                      <h3 className="text-sm">{daySchedule.day}</h3>
                      <p className="text-sm">{formatDate(daySchedule.date)} {daySchedule.month}</p>
                    </div>
                    <div className="px-1 max-h-80 overflow-y-auto">
                      {daySchedule.timeSlots.map((slot, slotIndex) => {
                        const isInRange = isInSelectedRange(actualIndex, slot.time);
                        const isStartSlot = selectionStart && selectionStart.dayIndex === actualIndex && selectionStart.slotIndex === slotIndex;
                        const isEndSlot = selectionEnd && selectionEnd.dayIndex === actualIndex && selectionEnd.slotIndex === slotIndex;

                        return (
                          <div
                            key={slotIndex}
                            className={`p-2 my-1 rounded text-center cursor-pointer transition-all 
                              ${!slot.isAvailable 
                                ? 'bg-[#0b2849] border border-gray-300 text-white opacity-70 cursor-not-allowed'
                                : isStartSlot || isEndSlot || isInRange
                                  ? 'bg-green-500 text-white'
                                  : 'bg-gray-300 text-[#0b2849]'}`}
                            onClick={slot.isAvailable ? () => handleTimeSlotClick(actualIndex, slotIndex, slot.time) : undefined}
                          >
                            <p className='text-sm'>{slot.time}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default DoctorSchedule;