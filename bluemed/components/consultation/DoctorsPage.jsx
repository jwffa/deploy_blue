import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiUrl } from '../../src/config';

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get specialty from URL query parameters
  const searchParams = new URLSearchParams(location.search);
  const specialty = searchParams.get('specialty');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${apiUrl}/doctorsProf`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch doctors');
        }
        
        const data = await response.json();
        
        // Filter doctors by specialty if specified
        let filteredDoctors = data;
        if (specialty) {
          // Adjusting for different forms of specialty names
          filteredDoctors = data.filter(doctor => {
            // Handle cases like "პედიატრი" vs "პედიატრია"
            return doctor.profession.includes(specialty.slice(0, -2)) || 
                   specialty.includes(doctor.profession.slice(0, -1));
          });
        }
        
        setDoctors(filteredDoctors);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching doctors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [specialty, apiUrl]);

  const goBack = () => {
    navigate('/videoCall');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0b2849]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-10">
        <h2 className="text-xl text-red-600 mb-4">შეცდომა მოხდა</h2>
        <p>{error}</p>
        <button 
          onClick={goBack} 
          className="mt-4 px-4 py-2 bg-[#0b2849] text-white rounded cursor-pointer"
        >
          უკან დაბრუნება
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg md:text-2xl font-poppins text-[#0b2849]">
          {`სულ მოიძებნა ${doctors.length} ექიმი`}
        </h1>
        <button 
          onClick={goBack} 
          className="px-3 py-2 md:px-4 text-sm md:text-base bg-[#0b2849] text-white rounded cursor-pointer"
        >
          უკან დაბრუნება
        </button>
      </div>

      {doctors.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg text-gray-600">ამ სპეციალობის ექიმები ვერ მოიძებნა</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <div 
              key={doctor._id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <img className='w-40 mb-2 rounded-xl' src={doctor.gender === "მამრობითი" ? "/doctorPics/manDoc.jpeg" : "/doctorPics/womanDoc.jpeg"} alt="" />
                <h2 className="text-xl font-semibold text-[#0b2849] mb-2">
                  {doctor.first_name} {doctor.last_name}
                </h2>
                <p className="text-gray-600 mb-2">{doctor.profession}</p>
                <p className="text-gray-600 mb-4">{doctor.clinic}</p>
                
                {doctor.about && (
                  <p className="text-gray-700 mb-4 line-clamp-3">{doctor.about}</p>
                )}
                
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500">{doctor.phone}</span>
                  <button
                    onClick={() => navigate(`/doctors/${doctor._id}`)}
                    className="px-4 py-2 bg-[#0b2849] text-white rounded text-sm cursor-pointer"
                  >
                    დეტალები
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorsPage;