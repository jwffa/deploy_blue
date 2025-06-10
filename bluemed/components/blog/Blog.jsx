import { Button } from '@headlessui/react'
import { Link } from 'react-router-dom'
import React from 'react'

const Blog = () => {
  return (
    <div className='w-full m-auto bg-white rounded-2xl mt-10 py-12 px-7'>
      <div className='flex justify-between items-center'>
        <h1 className="text-2xl font-poppins mb-3 text-[#0b2849]">ბლოგი</h1>
        <Button className="font-poppins bg-white text-[#0b2849] border-2 border-dotted border-[#0b2849] text-sm px-6 py-2 rounded-full cursor-pointer transition duration-300 md:hover:border-solid md:hover:bg-[#0b2849] md:hover:text-white">ყველას ნახვა</Button>

      </div>

      <div className='cursor-pointer w-[250px] md:w-[300px] rounded-xl mt-6'>
        <Link className='w-[350px]' to='/blog-1'>
          <img className='w-full rounded-xl' src="/picBlog/blog1.jpg" alt="blog"/>
          <p className='font-poppins text-[#0b2849] whitespace-nowrap overflow-hidden text-ellipsis font-bold text-[17px] mt-3'>მაღალი წნევის კონტროლის 10 გზა მედიკამენტების გარეშე</p>
          <p className='font-poppins text-[#00000080] text-sm mt-2'>ცხოვრების წესი მნიშვნელოვან როლს ასრულებს მაღალი წნევის მკურნალობაში.</p>
        </Link>
      </div>
    </div>
  )
}

export default Blog
