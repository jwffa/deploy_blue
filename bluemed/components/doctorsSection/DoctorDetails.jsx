import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star } from 'lucide-react';
import { apiUrl } from '../../src/config';
import DoctorSchedule from '../doctorSchedule/DoctorSchedule';

const docEdu = [
  {
    "institution": "ი. ციციშვილის სახ. ბავშვთა ახალი კლინიკა",
    "country": "საქართველო",
    "position": "გადაუდებელი განყოფილების ხელმძღვანელი, პედიატრი",
    "start_date": "2020-01",
    "end_date": "2020-11"
  },
  {
    "institution": "ივ. ბოკერიას სახ. რეფერალური ჰოსპიტალი",
    "country": "საქართველო",
    "position": "გადაუდებელი სამსახურის ხელმძღვანელი, პედიატრი",
    "start_date": "2017-01",
    "end_date": "2020-01"
  },
  {
    "institution": "შპს \"ბავშვთა ახალი კლინიკა\"",
    "country": "საქართველო",
    "position": "ექიმი პედიატრი",
    "start_date": "2011-01",
    "end_date": "2017-12"
  },
  {
    "institution": "გ. ჟვანიას სახ. პედიატრიული კლინიკა",
    "country": "საქართველო",
    "position": "ექიმი პედიატრი",
    "start_date": "2007-01",
    "end_date": "2011-12"
  },
  {
    "institution": "სს პედიატრიის სამეცნიერო-კვლევითი ინსტიტუტი",
    "country": "საქართველო",
    "position": "მორიგე ექიმი, პედიატრი",
    "start_date": "2006-09",
    "end_date": "2007-12"
  }
]

const DoctorDetails = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [comments, setComments] = useState([]);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');
    if (token && name) {
      setIsLoggedIn(true);
      setUserName(name);
      setAuthor(name);
    }

    fetch(`${apiUrl}/doctors/ui/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setDoctor(data);
        setComments(data.comments || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("error fetching data:", error);
        setLoading(false);
      });
  }, [id]);

  const addComment = async (doctorId, author, text) => {
    if (!isLoggedIn) {
      setError('please log in to add a comment');
      return;
    }

    if (!text) {
      setError('please write a comment');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/doctors/${doctorId}/comments`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ author, text })
      });

      if (!response.ok) {
        throw new Error("could not add comment");
      }

      const data = await response.json();

      const newComment = { author, text };
      setComments((prevComments) => [...prevComments, newComment]);
      
      setText('');
      setError('');
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('კომენტარის დამატების შეცდომა');
    }
  };

  return (
    <div className="max-w-screen-xl m-auto px-4 mb-10">
      <div className="w-full m-auto mt-2">
        {loading && <p>იტვირთება...</p>}
        {doctor && (
          <div className='flex flex-col lg:flex-row justify-between gap-10'>
            <div className="flex flex-col gap-8">
              <div className="w-[300px]">
                <img
                  className="rounded-xl w-full"
                  src={doctor.gender === "მამრობითი" ? `/doctorPics/manDoc.jpeg` : "/doctorPics/womanDoc.jpeg"}
                  alt={doctor.first_name}
                />
              </div>
              <div className="flex flex-col gap-4">
                <p className="text-2xl font-poppins text-[#0b2849] font-bold">
                  {doctor.first_name} {doctor.last_name}
                </p>
                <p className="text-sm underline text-[#13b5e6]">{doctor.clinic}</p>
                <p className="text-[#0b2849] font-poppins text-base">{doctor.profession}</p>
                <p className="text-[#00000080] font-poppins text-base">{doctor.about}</p>
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, index) => (
                    <Star key={index} size={22} color="#ffc107" />
                  ))}
                </div>
              </div>
            </div>

            <DoctorSchedule id={id} />
          </div>
        )}

        <div className='mt-15'>
          <p className="text-2xl font-semibold text-[#0b2849] mb-6">ჩემი გამოცდილება</p>
          <div className="flex flex-col gap-4 border rounded-lg border-[#0b2849] p-2">
            {docEdu.map((edu, index) => (
              <div key={index} className="p-4 flex flex-col gap-1">
                <p className="font-bold text-[#0b2849] font-poppins">{edu.institution}</p>
                <p className='text-[#00000080] italic font-poppins'>{edu.country}</p>
                <p className='text-[#00000080] italic font-poppins'>{edu.position}</p>
                <p className='text-[#00000080] italic font-poppins'>{edu.start_date} - {edu.end_date} წ.</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-15">
          <p className="text-2xl font-semibold text-[#0b2849] mb-6">თქვენი შთაბეჭდილებები</p>
          
          {!isLoggedIn ? (
            <div className="p-4 bg-gray-100 rounded mb-4">
              <p className="text-[#0b2849] font-poppins">
                კომენტარის დასატოვებლად გთხოვთ <a href="/login" className="text-[#13b5e6] underline">შეხვიდეთ თქვენს ანგარიშზე</a>
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addComment(id, author, text);
              }}
              className="flex flex-col gap-4"
            >
              <div className="p-2 border rounded bg-gray-50">
                <p className="text-[#0b2849] font-poppins">კომენტარის ავტორი: <span className="font-semibold">{userName}</span></p>
              </div>
              <textarea
                placeholder="თქვენი კომენტარი"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="p-2 border rounded focus:outline-none"
              />
              <button type="submit" className="bg-[#13b5e6] text-white py-2 rounded cursor-pointer">
                კომენტარის დამატება
              </button>
              {error && <p className="text-red-500">{error}</p>}
            </form>
          )}
        </div>

        <div className="mt-15">
          <p className="text-xl font-semibold text-[#0b2849] mb-3">კომენტარები</p>
          <p className='text-[#00000080] font-poppins mb-6'>სულ {comments?.length} კომენტარი</p>
          {comments.length === 0 ? (
            <p className='font-poppins text-xl text-[#0b2849]'>კომენტარების სექცია ცარიელია</p>
          ) : (
            <ul className="space-y-4">
              {comments.map((comment, index) => (
                <li key={index} className="p-4 border rounded shadow-sm">
                  <p className="font-bold text-[#0b2849] font-poppins">{comment?.author}</p>
                  <p className='text-[#00000080] italic font-poppins'>{comment?.text}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;