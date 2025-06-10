import React from 'react'
import SliderSection from "../components/slideSection/Slider"
import Service from '../components/serviceSection/Service'
import Clinics from '../components/clinicsSection/Clinics'
import Doctors from '../components/doctorsSection/Doctors'
import HowWork from '../components/howWork/HowWork'
import Blog from '../components/blog/Blog'
import QrCode from '../components/bluemedQR/QrCode'
const Home = () => {
  return (
    <div className='max-w-screen-xl m-auto px-4'>
      <SliderSection/>
      <Service/>
      <Clinics/>
      <Doctors/>
      <HowWork/>
      <Blog/>
      <QrCode/>
    </div>
  )
}

export default Home
