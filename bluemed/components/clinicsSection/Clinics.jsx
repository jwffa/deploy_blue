import React from 'react'
import { Button } from '@headlessui/react'
const clinicIcons = [
  {
    id: 0,
    src: "/clinicsICON/geomed.png",
    title: "ჯეო მედი"
  },
  {
    id: 1,
    src: "/clinicsICON/evex.png",
    title: "ევექსი"
  }
]

const Clinics = () => {
  return (
    <div className='w-full m-auto bg-white rounded-2xl mt-10 py-12 px-7'>
      <div className='flex flex-row justify-between items-center'>
        <h1 className="text-2xl font-poppins text-[#0b2849]">კლინიკები</h1>
        <p className='text-[#00000080] text-lg font-poppins'>2 კლინიკა</p>
      </div>

      <div className="w-full flex flex-col items-start max-w-screen-xl mx-auto">
        <div className="w-full overflow-x-auto pb-2 mt-6">
          <div className="flex flex-row gap-6 min-w-min mb-2">
            {clinicIcons.map((item) => {
              return(
                <div 
                  key={item.id} 
                  className="flex items-center justify-center h-[40px] gap-2 bg-[#f7f9fc] px-3 rounded-xl cursor-pointer whitespace-nowrap flex-shrink-0"
                >
                  <img className="w-20" src={item.src} alt={item.title} />
                  <p className="font-poppins text-sm">{item.title}</p>
                </div>
              )
            })}
          </div>
        </div>
        <Button className="mt-8 bg-white text-[#0b2849] border-2 border-dotted border-[#0b2849] text-sm px-6 py-2 rounded-full cursor-pointer transition duration-300 md:hover:border-solid md:hover:bg-[#0b2849] md:hover:text-white">ყველას ნახვა</Button>
      </div>
    </div>
  )
}

export default Clinics
