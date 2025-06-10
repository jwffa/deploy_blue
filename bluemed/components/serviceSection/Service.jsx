import TbcLogo from "../../serviceICONS/tbc-logo.svg";
import VideoCallLogo from "../../serviceICONS/video_call_card.svg";
import ClinicVisit from "../../serviceICONS/clinic-visit-card.svg";
import HomeVisit from "../../serviceICONS/home_visit_card.svg";
import HomeVisitNurse from "../../serviceICONS/home_visit_nurse.png";
import Laboratory from "../../serviceICONS/laboratory_card.svg";
import DoctorLogo from "../../serviceICONS/doctor_card.svg";
import { Link } from "react-router-dom";

// array containing service data, used to dynamically render components using the map function
const services = [   
  {
    id: 0,
    logo: TbcLogo, // service logo
    firstText: "თიბისი დაზღვევის ექიმები", 
    secondText: "ვიდეო კონსულტაცია",
    link: "/tbcInsurance", // navigation link for the service
  },
  {
    id: 1,
    logo: VideoCallLogo,
    firstText: "ექიმის ონლაინ კონსულტაცია",
    secondText: "300+ წამყვანი სპეციალისტი",
    link: "/videoCall",
  },
  {
    id: 2,
    logo: ClinicVisit,
    firstText: "კლინიკაში ჩაწერა",
    secondText: "30+ კლინიკა, 300+ ექიმი",
    link: "/clinicVisit",
  },
  {
    id: 3,
    logo: HomeVisit,
    firstText: "ექიმი სახლში",
    secondText: "პედიატრი, თერაპევტი, ნევროლოგი",
    link: "/homeVisit",
  },
  {
    id: 4,
    logo: HomeVisitNurse,
    firstText: "ექთანი სახლში",
    secondText: "ინექცია, გადასხმა, ჭრილობის მოვლა",
    link: "/homeNurse",
  },
  {
    id: 5,
    logo: Laboratory,
    firstText: "ლაბორატორიული ანალიზი",
    secondText: "სახლში გამოძახება ან ლაბში ვიზიტი",
    link: "/laboratory",
  },
  {
    id: 6,
    logo: DoctorLogo,
    firstText: "ექიმები საზღვარგარეთ",
    secondText: "მეორეული აზრი და კონსულტაცია",
    link: "/doctor",
  },
];

const Service = () => {
  return (
    <div className='w-full m-auto bg-white rounded-2xl mt-10 py-12 px-7'>
      <h1 className="text-2xl font-poppins mb-3 text-[#0b2849]">სერვისები</h1>
      <div className='border border-[#0b2849] rounded-2xl sm:border-0 sm:rounded-none grid grid-cols-1 m-auto mt-6 gap-0 w-auto sm:w-auto sm:grid-cols-2 md:grid-cols-3 sm:gap-6 lg:grid-cols-4'>
        {/* i am using the map function to render each service. */}
        {services.map((service) => {
          return(
            <div key={service.id} className='p-4 sm:p-6 sm:border sm:rounded-xl border-[#0b28496a] cursor-pointer md:hover:bg-[#f7f9fc] transition duration-300 ease-in-out'>
              <Link to={service.link}>
                <div className='flex flex-row sm:flex sm:flex-col gap-2.5'>
                  <img src={service.logo} alt={service.firstText} className="w-13 h-13" />
                  <div className="flex flex-col gap-2.5">
                    <p className="text-sm text-[#0b2849] font-poppins">{service.firstText}</p>
                    <p className="text-xs text-[#00000080] font-poppins">{service.secondText}</p>
                  </div>
                </div>
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Service
