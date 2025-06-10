import React, { useState, useEffect } from 'react';
import { Search, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@headlessui/react';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useSearchDoctorsApi from './HeaderSearchApi';
import MenuBar from "../menuOnPhone/MenuBar"


const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const { isLoggedIn, userName, handleLogout } = useAuth();
  const doctors = useSearchDoctorsApi();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredDoctors([]); // clear the list when the search term is empty
      return;
    }

    const filtered = doctors.filter((doctor) => {
      const fullName = `${doctor.first_name} ${doctor.last_name}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    });

    setFilteredDoctors(filtered); // set the filtered list of doctors
  }, [searchTerm, doctors]);

  const handleLogoutClick = () => {
    handleLogout();
    navigate('/login'); 
  };

  const handleSearchClick = () => {
    setSearchTerm(''); // clear the search term
  }
  return (
    <header className='w-full mt-2'>
      <nav className='m-auto max-w-screen-xl pt-4 px-4 flex items-center gap-4 justify-between'>
        <div className='flex items-center'>
          <Link to={'/'}>
            <img className='cursor-pointer w-24 sm:w-28' src='/icons/bluemed.png' alt='bluemed' />
          </Link>

          <div className='relative pl-4 ml-4 sm:pl-8 sm:ml-8 border-l'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hidden md:block' size={20} />
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 md:hidden' size={16} />

              <input
                type='text'
                placeholder='ექიმი, სპეციალობა'
                className='w-full text-sm sm:text-base pl-10 pr-4 py-1 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-[#0b2849]'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {filteredDoctors.length > 0 && searchTerm.trim() !== "" && (
              <div className='absolute w-full bg-white border border-gray-300 rounded-md shadow-md mt-1 max-h-52 overflow-auto z-50'>
                {filteredDoctors.map((doctor) => (
                  <Link to={`/doctors/${doctor?._id}`} key={doctor?._id}>
                    <div
                      className='cursor-pointer px-4 py-2 hover:bg-gray-100 text-sm sm:text-base flex flex-col'
                      onClick={() => {
                        setSearchTerm(`${doctor?.first_name} ${doctor?.last_name}`)
                        handleSearchClick();
                      }}
                    >
                      <p to={`/doctors/${doctor?._id}`} className='font-poppins text-[#0b2849] w-full'>{doctor?.first_name} {doctor?.last_name}</p>
                      <p to={`/doctors/${doctor?._id}`} className='text-sm font-poppins text-[#00000070] w-full'>{doctor?.profession}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className='hidden md:block'>
          {!isLoggedIn ? (
            <>
              <Link to={'/register'}>
                <Button className='mr-2 inline-flex items-center gap-2 rounded-full bg-[#ffffff] py-1 px-4 text-sm font-semibold text-[#0b2849] border border-[#0b2849] shadow-inner cursor-pointer'>
                  რეგისტრაცია
                </Button>
              </Link>
              <Link to={'/login'}>
                <Button className='inline-flex items-center gap-2 border border-[#0b2849] rounded-full bg-[#0b2849] py-1 px-4 text-sm font-semibold text-white shadow-inner focus:outline-none cursor-pointer'>
                  ავტორიზაცია
                </Button>
              </Link>
            </>
          ) : (
            <Menu as="div" className="relative">
              <MenuButton className="cursor-pointer flex items-center gap-2  rounded-full p-2  text-white">
                <p className='font-poppins text-sm text-[#0b2849] font-bold'>{userName}</p>
                <User color='#0b2849' size={20} />
              </MenuButton>
              <MenuItems className="flex flex-col z-50 absolute right-0 mt-2 w-32 rounded-sm bg-[#0b2849] shadow-lg ring-1 focus:outline-none">
                <MenuItem className="px-4 py-2 text-sm text-white cursor-pointer border-b border-gray-400">
                  <Button>პროფილი</Button>
                </MenuItem>
                <MenuItem className="px-4 py-2 text-sm text-white cursor-pointer">
                  <Button onClick={handleLogoutClick}>გასვლა</Button>
                </MenuItem>
              </MenuItems>
            </Menu>
          )}
        </div>

        <MenuBar/>
      </nav>
    </header>
  );
};

export default Header;
