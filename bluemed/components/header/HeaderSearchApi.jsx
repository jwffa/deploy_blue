import { useState, useEffect } from 'react';
import { apiUrl } from '../../src/config';
const useSearchDoctorsApi = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`${apiUrl}/doctorsProf`);
        if (response.status === 200) {
          const data = await response.json();
          const searchedDoctors = data.map((doctor) => ({
            _id: doctor._id,
            first_name: doctor.first_name, 
            last_name: doctor.last_name,
            profession: doctor.profession, 
          }));
          setDoctors(searchedDoctors);
        } else {
          throw new Error("network response was not ok");
        }
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    fetchDoctors();
  }, []);

  return doctors;
};

export default useSearchDoctorsApi;


