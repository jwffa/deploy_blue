// import { useState, useEffect } from 'react';
// import Slider from 'react-slick';
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// const DoctorSchedule = () => {
//   const [schedule, setSchedule] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [doctorId, setDoctorId] = useState('67e5b4ecc7fb450f69d01174'); // ტესტისთვის ფიქსირებული ID

//   useEffect(() => {
//     const fetchSchedule = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(`http://localhost:3000/api/doctors/${doctorId}/schedule`);
        
//         if (!response.ok) {
//             throw new Error('failed to load schedule');
//         }
        
//         const data = await response.json();
//         setSchedule(data);
//         setLoading(false);
//       } catch (err) {
//         setError(err.message || 'განრიგის ჩატვირთვა ვერ მოხერხდა');
//         setLoading(false);
//         console.error('Error fetching schedule:', err);
//       }
//     };

//     fetchSchedule();
//   }, [doctorId]);

//   const handleTimeSlotClick = async (dayIndex, slotIndex) => {
//     try {
//       const response = await fetch(
//         `http://localhost:3000/api/doctors/${doctorId}/schedule/${dayIndex}/book`,
//         {
//           method: 'PATCH',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ timeSlotIndex: slotIndex }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error('ვიზიტის დაჯავშნა ვერ მოხერხდა');
//       }

//       // განვაახლოთ სტეიტში სლოტის სტატუსი
//       const updatedSchedule = [...schedule];
//       updatedSchedule[dayIndex].timeSlots[slotIndex].isAvailable = false;
//       setSchedule(updatedSchedule);
      
//       alert('ვიზიტი წარმატებით დაჯავშნილია!');
//     } catch (err) {
//       alert(err.message || 'ვიზიტის დაჯავშნა ვერ მოხერხდა');
//       console.error('Error booking appointment:', err);
//     }
//   };

//   // დღეების დაჯგუფება სამ-სამად
//   const groupedDays = [];
//   for (let i = 0; i < schedule.length; i += 3) {
//     groupedDays.push(schedule.slice(i, i + 3));
//   }

//   // slick-ის პარამეტრები
//   const settings = {
//     dots: true,
//     infinite: false,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1
//   };

//   // განვსაზღვროთ თარიღის ფორმატი
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.getDate();
//   };

//   if (loading) return <div className="flex justify-center items-center h-64 text-lg">იტვირთება განრიგი...</div>;
//   if (error) return <div className="flex justify-center items-center h-64 text-lg text-red-600">{error}</div>;
//   if (!schedule || schedule.length === 0) return <div className="flex justify-center items-center h-64 text-lg">განრიგი არ არის ხელმისაწვდომი</div>;

//   return (
//     <div className="max-w-[550px] mx-auto p-4">
      
//       <Slider {...settings} className="mb-8">
//         {groupedDays.map((group, groupIndex) => (
//           <div key={groupIndex}>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               {group.map((daySchedule, dayIndex) => {
//                 const actualIndex = groupIndex * 3 + dayIndex;
//                 return (
//                   <div key={actualIndex} className="rounded-lg shadow-md bg-white overflow-hidden">
//                     <div className="bg-[#0b2849] text-white p-2 text-center">
//                       <h3 className="text-sm">{daySchedule.day}</h3>
//                       <p className="text-sm">{formatDate(daySchedule.date)} {daySchedule.month}</p>
//                     </div>
//                     <div className="px-1 max-h-80 overflow-y-auto">
//                       {daySchedule.timeSlots.map((slot, slotIndex) => (
//                         <div
//                           key={slotIndex}
//                           className={`p-2 my-1 rounded text-center cursor-pointer transition-all 
//                             ${slot.isAvailable 
//                               ? 'bg-gray-300 text-[#0b2849]' 
//                               : 'bg-[#0b2849] border border-gray-300 text-white opacity-70 cursor-not-allowed'}`}
//                           onClick={slot.isAvailable ? () => handleTimeSlotClick(actualIndex, slotIndex) : undefined}
//                         >
//                           <p className='text-sm'>{slot.time}</p>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         ))}
//       </Slider>
//     </div>
//   );
// };

// export default DoctorSchedule;