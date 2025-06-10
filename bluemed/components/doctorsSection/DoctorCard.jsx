import { House, Phone, Video } from "lucide-react";
import { Link } from "react-router-dom";
const DoctorCard = ({ doctor }) => (
  <Link to={`/doctors/${doctor._id}`}> 
    <div className="doctor-card flex flex-col items-center md:flex-row gap-4">
      <div className="self-center w-32 h-32">
        <img
          className="w-full h-full rounded-[6px] object-cover"
          src={doctor.gender === "მამრობითი" ? "/doctorPics/manDoc.jpeg" : "/doctorPics/womanDoc.jpeg"}
          alt={`${doctor.first_name} ${doctor.last_name}`}
        />
      </div>

      <div className="flex flex-col justify-center">
        <p className="text-base font-bold whitespace-nowrap overflow-hidden text-ellipsis">{doctor.first_name} {doctor.last_name}</p>
        <p className="text-base text-[#00000070] font-bold overflow-hidden text-ellipsis">{doctor.profession}</p>
        <p className="text-base text-[#0b2849] font-bold">{doctor.clinic}</p>

        <div className="flex items-center gap-3 mt-3">
          <House size={18} cursor="pointer" color="#0b2849" />
          <Video size={18} cursor="pointer" color="#0b2849" />
          <Phone size={18} cursor="pointer" color="#0b2849" />
        </div>
      </div> 
    </div>
  </Link>
);

export default DoctorCard