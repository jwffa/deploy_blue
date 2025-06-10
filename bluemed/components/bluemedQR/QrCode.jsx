import React from 'react'

const QrCode = () => {
  return (
    <div className='w-full m-auto rounded-2xl mt-10 pt-12 px-7 bg-gradient-to-r from-[#0B2842] to-[#00A3E0] mb-10'>
      <div className='relative flex items-center justify-between'>
        <div className='hidden lg:block'>
          <div className='max-w-[320px] absolute bottom-0'>
            <img className='w-full' src="/picsQR/wood-hand.png" alt="wood-hand" />
          </div>
        </div>

        <div className='pt-0 pb-12 lg:pb-12'>
          <p className='text-2xl sm:text-3xl font-poppins text-white lg:max-w-[400px]'>გადმოწერე რედმედის აპლიკაცია</p>
          <p className='text-base opacity-75 mt-10 text-white'>აპლიკაციის გადმოსაწერად დაასკანირე QR კოდი</p>
          <img className='w-32 rounded-xl mt-10' src="/picsQR/qr.png" alt="" />
        </div>
      </div>
    </div>
  )
}

export default QrCode
