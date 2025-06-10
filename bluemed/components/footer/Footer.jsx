import React from 'react'
import { Link } from 'react-router-dom'
import FooterMob from './FooterMob'

const Footer = () => {
  return (
      <footer className='w-full mb-10 mt-10'>
        <div className='m-auto max-w-screen-xl pt-4 px-4 hidden  md:flex md:justify-between'>
          <div className='pr-3 w-1/4'>
            <img className='cursor-pointer w-28' src="/icons/bluemed.png" alt="bluemed" />
          </div>

          <div className='flex flex-col px-4 w-1/4 border-l-1 border-[#0b2849]'>
            <p className='text-base font-bold font-poppins text-[#0b2849]'>ექიმის სივრცე</p>
            <div className='flex flex-col gap-2 mt-3'>
              <Link className='font-poppins text-sm text-[#00000080] cursor-pointer'>ავტორიზაცია</Link>
              <Link className='font-poppins text-sm text-[#00000080] cursor-pointer'>რეგისტრაცია</Link>
              <Link className='font-poppins text-sm text-[#00000080] cursor-pointer'>აპის გადმოწერა</Link>
            </div>
          </div>

          <div className='flex flex-col px-4 w-1/4 border-l-1 border-[#0b2849]'>
            <p className='text-base font-bold font-poppins text-[#0b2849]'>ჩვენს შესახებ</p>
            <div className='flex flex-col gap-2 mt-3'>
              <Link className='font-poppins text-sm text-[#00000080] cursor-pointer'>ჩვენ</Link>
              <Link className='font-poppins text-sm text-[#00000080] cursor-pointer'>როგორ მუშაობს</Link>
              <Link className='font-poppins text-sm text-[#00000080] cursor-pointer'>ბლოგი</Link>
              <Link className='font-poppins text-sm text-[#00000080] cursor-pointer'>კონტაქტი</Link>
              <Link className='font-poppins text-sm text-[#00000080] cursor-pointer'>პერსონალურ მონაცემთა დაცვის ოფიცერი</Link>
            </div>
          </div>

          <div className='flex flex-col pl-4 w-1/4 border-l-1 border-[#0b2849]'>
            <p className='text-base font-bold font-poppins text-[#0b2849]'>წესები და პირობები</p>
            <div className='flex flex-col gap-2 mt-3'>
              <Link className='font-poppins text-sm text-[#00000080] cursor-pointer'>როგორც ექიმი</Link>
              <Link className='font-poppins text-sm text-[#00000080] cursor-pointer'>როგორც პაციენტი</Link>
            </div>
          </div>
        </div>

        <div className='px-12 mt-8'>
          <img className='cursor-pointer w-28 md:hidden' src="/icons/bluemed.png" alt="bluemed" />
        </div>
        <FooterMob/>
      </footer>
  )
}

export default Footer
