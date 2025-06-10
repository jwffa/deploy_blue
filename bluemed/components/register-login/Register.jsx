import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../../src/config';
const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${apiUrl}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('თქვენ წარმატებით დარეგისტრირდით!');
        setErrorMessage('');
        setName('');
        setEmail('');
        setPassword('');
        navigate('/login');
      } else {
        setErrorMessage(data.message || 'გთხოვთ, თავიდან სცადეთ.');
        setName('');
        setEmail('');
        setPassword('');
        setSuccessMessage('');
      }
    } catch {
      setErrorMessage('დაფიქსირდა შეცდომა, თავიდან სცადეთ.');
      setSuccessMessage('');
      setName('');
      setEmail('');
      setPassword('');
    }
  };

  return (
    <div className='max-w-screen-xl m-auto px-4 mb-10'>
      <div className='w-full sm:w-1/2 m-auto flex flex-col justify-center bg-white rounded-2xl py-12 px-7'>
        <h1 className='text-2xl font-poppins text-[#0b2849]'>მომხმარებლის რეგისტრაცია</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4 mt-5'>
          <input
            type='text'
            placeholder='სახელი, გვარი'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='border border-[#0b2849] rounded-lg p-2 outline-none'
          />
          <input
            type='email'
            placeholder='ელ. ფოსტა'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='border border-[#0b2849] rounded-lg p-2 outline-none'
          />
          <input
            type='password'
            placeholder='პაროლი'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='border border-[#0b2849] rounded-lg p-2 outline-none'
          />
          <button type='submit' className='bg-[#0b2849] text-white rounded-lg p-2 cursor-pointer'>
            რეგისტრაცია
          </button>
        </form>

        {errorMessage && (
          <div className='mt-4 text-red-700'>
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className='mt-4 text-green-700'>
            {successMessage}
          </div>
        )}

      </div>
    </div>
  )
}

export default Register
