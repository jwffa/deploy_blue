import React from 'react'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@headlessui/react'
import Disclos from './Disclos'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const MenuBar = () => {

  const { isLoggedIn, userName, handleLogout } = useAuth();
  // state to manage the menu visibility (true = open and false = closed)
  const [open, setIsOpen] = useState(false)

  return (
    <div className='block md:hidden z-50'>
      <Menu size={34} cursor={"pointer"} onClick={() => setIsOpen(prev => !prev)}/>

      <div className={`px-4 fixed top-0 h-full overflow-scroll pb-5 right-0 w-full bg-[#2d2d2de0]  transition-transform duration-400 ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className='w-full flex justify-end pt-4'>
          <X onClick={() => setIsOpen(prev => !prev)} color={"white"} size={36} className=''/> 
        </div>

        <div className='w-full sm:w-[350px] m-auto'>
          <div className=' m-auto flex flex-col px-12 mt-20 gap-6'>
            {isLoggedIn && <Button className="flex justify-center items-center gap-2 rounded-full bg-[#ffffff] py-1 px-4 text-sm/6 font-semibold text-[#0b2849] border border-[#0b2849] shadow-inner shadow-white/10 data-[focus]:outline-1  cursor-pointer"><Link onClick={() => setIsOpen(prev => !prev)}>პროფილზე გადასვლა</Link></Button>}
            {isLoggedIn && <Button className={"flex justify-center items-center gap-2 rounded-full bg-[#ffffff] py-1 px-4 text-sm/6 font-semibold text-[#0b2849] border border-[#0b2849] shadow-inner shadow-white/10 data-[focus]:outline-1  cursor-pointer"} onClick={() => {
              handleLogout();
              setIsOpen(prev =>  !prev)
            }}>გამოსვლა</Button>}
            <Button className="flex justify-center items-center gap-2 rounded-full bg-[#ffffff] py-1 px-4 text-sm/6 font-semibold text-[#0b2849] border border-[#0b2849] shadow-inner shadow-white/10 data-[focus]:outline-1  cursor-pointer"><Link onClick={() => setIsOpen(prev => !prev)} to={"/register"}>რეგისტრაცია</Link></Button>
            <Button className="flex justify-center items-center gap-2 rounded-full bg-[#ffffff] py-1 px-4 text-sm/6 font-semibold text-[#0b2849] border border-[#0b2849] shadow-inner shadow-white/10 data-[focus]:outline-1  cursor-pointer"><Link onClick={() => setIsOpen(prev => !prev)} to={"/login"}>ავტორიზაცია</Link></Button>
          </div>       

          <div className='m-auto'>
            <Disclos/>
          </div>

          
        </div>
      </div>
    </div>
  )
}

export default MenuBar
