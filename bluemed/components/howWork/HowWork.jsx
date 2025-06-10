import React from 'react'
const icons = [
  {
    id: 1,
    title: "pic1",
    src: "/picHow/pic1.png",
    firstText: "აირჩიე მიმართულება",
    secondText: "აირჩიე შენთვის საჭირო მიმართულება"
  },
  {
    id: 2,
    title: "pic2",
    src: "/picHow/pic2.png",
    firstText: "აირჩიე ექიმი",
    secondText: "გაეცანი ექიმის პროფილს და სხვა მომხმარებლების მიერ დატოვებულ შეფასებებს"
  },
  {
    id: 3,
    title: "pic3",
    src: "/picHow/pic3.png",
    firstText: "აირჩიე მომსახურება",
    secondText: "მიუთითე მომსახურების ტიპი, დრო და ადგილი"
  }
]

const HowWork = () => {
  return (
    <div className='w-full m-auto bg-white rounded-2xl mt-10 py-12 px-7'>
      <div className='flex flex-col gap-10 md:flex-row items-start justify-between'>
        <div className='flex flex-col items-start'>
          <h1 className="text-2xl font-poppins mb-3 text-[#0b2849]">როგორ მუშაობს</h1>
          <p className='text-[#0b2849] font-poppins text-base max-w-[450px]'>
            გაეცანი bluemed-ის გამოყენების ინსტრუქციას და დაჯავშნე სასურველი სერვისი მარტივად
          </p>
          <img className='self-center mt-5' src="/picHow/how.png" alt="how-it-works" />
        </div>

        <div className='w-full md:w-auto'>
          {icons.map((icon) => (
            <div key={icon.id} className='flex items-start gap-4 p-5 mb-3 border rounded-lg border-[#0b284964] h-[150px]'>
              <img className='w-6 mt-0.5' src={icon.src} alt={icon.title} />
              <div>
                <h1 className='mb-3 text-[15px] font-poppins text-[#0b2849] font-bold'>{icon.firstText}</h1>
                <p className='text-[#00000070] font-poppins text-[13px]/5 max-w-[250px] line-'>{icon.secondText}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HowWork
