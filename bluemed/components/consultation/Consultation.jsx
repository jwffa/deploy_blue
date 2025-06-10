import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Consultation = () => {
  const [specialty, setSpecialty] = useState('');
  const navigate = useNavigate();

  const handleSpecialtyClick = (selectedSpecialty) => {
    setSpecialty(selectedSpecialty);
    navigate(`/doctors?specialty=${encodeURIComponent(selectedSpecialty)}`);
  };

  return (
    <div className='max-w-screen-xl m-auto px-4 mb-10'>
      <div className='w-full m-auto rounded-2xl mt-2'>
        <div className='flex flex-col bg-white rounded-2xl py-12 px-7'>
          <h1 className='text-[#0b2849] font-poppins text-2xl'>აირჩიე სპეციალობა</h1>
          <ul className='flex flex-col gap-3 mt-6'>
            <li 
              onClick={() => handleSpecialtyClick("პედიატრია")} 
              className='text-[#0b2849] font-poppins cursor-pointer hover:bg-gray-100 p-2 rounded'
            >
              პედიატრია
            </li>
            <li 
              onClick={() => handleSpecialtyClick("გინეკოლოგია")} 
              className='text-[#0b2849] font-poppins cursor-pointer hover:bg-gray-100 p-2 rounded'
            >
              გინეკოლოგია
            </li>
            <li 
              onClick={() => handleSpecialtyClick("რეპროდუქტოლოგი")} 
              className='text-[#0b2849] font-poppins cursor-pointer hover:bg-gray-100 p-2 rounded'
            >
              რეპროდუქტოლოგი
            </li>
            <li 
              onClick={() => handleSpecialtyClick("ოფთალმოლოგი")} 
              className='text-[#0b2849] font-poppins cursor-pointer hover:bg-gray-100 p-2 rounded'
            >
              ოფთალმოლოგი
            </li>
            <li 
              onClick={() => handleSpecialtyClick("ქირურგი")} 
              className='text-[#0b2849] font-poppins cursor-pointer hover:bg-gray-100 p-2 rounded'
            >
              ქირურგი
            </li>
            <li 
              onClick={() => handleSpecialtyClick("ფსიქოლოგი")} 
              className='text-[#0b2849] font-poppins cursor-pointer hover:bg-gray-100 p-2 rounded'
            >
              ფსიქოლოგი
            </li>
            <li 
              onClick={() => handleSpecialtyClick("ნეიროქირურგი")} 
              className='text-[#0b2849] font-poppins cursor-pointer hover:bg-gray-100 p-2 rounded'
            >
              ნეიროქირურგი
            </li>
            <li 
              onClick={() => handleSpecialtyClick("თერაპევტი")} 
              className='text-[#0b2849] font-poppins cursor-pointer hover:bg-gray-100 p-2 rounded'
            >
              თერაპევტი
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Consultation;

