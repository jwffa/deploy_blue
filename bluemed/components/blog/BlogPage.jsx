import { Button } from '@headlessui/react'
import React from 'react'
import Text from './Text'

const BlogPage = () => {
  return (
    <div className='max-w-screen-xl m-auto px-4 mb-10'>
      <div className='w-full m-auto rounded-2xl mt-2'>
       <div className='flex flex-col lg:flex-row justify-between items-start gap-6'>

        <div className='flex flex-col bg-white rounded-2xl py-12 px-7'>
          <h1 className='font-bold text-[#0b2849] text-2xl font-poppins'>მაღალი წნევის კონტროლის 10 გზა მედიკამენტების გარეშე</h1>
          <img className='rounded-3xl mt-6 w-full' src="/picBlog/blog1.jpg" alt="blog" />
          <Text />
        </div>

          <div className='rounded-xl bg-white w-full px-7 py-4 lg:p-4 lg:w-1/2 h-[196px]'>
            <div className='flex items-start gap-3'>
              <img className='w-16  object-center scale-110 rounded-full' src="/doctorPics/manDoc.jpeg" alt="doctor" />
              <div className='flex flex-col gap-2'>
                <p className='font-poppins font-bold text-sm'>ასლან აბაშიძე</p>
                <p className='font-poppins text-sm text-[#00000080] whitespace-nowrap overflow-hidden text-ellipsis'>კარდიოლოგი</p>
                <p className='font-poppins font-bold text-sm text-[#0b2849]'>ბლუმედი</p>
              </div>
            </div>
            <Button className="bg-[#0b2849] mt-6 text-white text-sm font-poppins px-5 w-[270px] lg:w-full lg:px-0 rounded-full py-2 cursor-pointer">დაჯავშნე ონლაინ კონსულტაცია</Button>
          </div>
       </div>
      </div>
    </div>
  )
}

export default BlogPage
