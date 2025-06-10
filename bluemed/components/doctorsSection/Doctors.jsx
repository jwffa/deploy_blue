import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import DoctorCard from "./DoctorCard";
import { apiUrl } from "../../src/config";

const Doctor = () => {

  const [doctorsApi, setDoctorsApi] = useState([]);


  // creates a reference for the slider
  const sliderRef = useRef(null);
  // stores the scroll position
  const scrollPositionRef = useRef(0);

  useEffect(() => {

    // fetches doctors data from the API

    fetch(`${apiUrl}/doctors/ui`)
    .then(response => {
      return response.json();
    })
    .then(data => {
      setDoctorsApi(data.slice(0, 10));
    })
    .catch(error => console.error('error fetching data:', error));

  }, []);
  
  // slider settings
  const settings = {
    dots: true,
    infinite: true, 
    speed: 500, 
    slidesToShow: 3, 
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000, 
    pauseOnHover: true, 
    beforeChange: () => {
      scrollPositionRef.current = window.scrollY;
    },
    afterChange: () => {
      setTimeout(() => {
        window.scrollTo(0, scrollPositionRef.current);
      }, 0);
    }, 
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2, 
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };


  return (
    <div className="slider-container w-full overflow-hidden m-auto bg-white rounded-2xl mt-10 py-12 px-7">
      <div className='flex flex-col md:flex-row gap-2 justify-between mb-10'>
        <h1 className="text-2xl font-poppins text-[#0b2849]">ექიმები</h1>
        <p className='text-lg text-[#00000080] font-poppins'>ხელმისაწვდომია 188 ექიმი</p>
      </div>
      {doctorsApi.length === 0 ? (
      <p className="font-poppins text-[#0b2849]">იტვირთება ექიმთა მონაცემები...</p>
      ) : (
        <Slider ref={sliderRef} {...settings}>
          {doctorsApi.map(doctor => (
            <div key={doctor._id} className='pb-6'>
              <DoctorCard doctor={doctor} />
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default Doctor;


