// const mongoose = require('mongoose');

// const DoctorsSchema = new mongoose.Schema({
//   id: {
//     type: Number,
//     required: true,
//   },
//   first_name: {
//     type: String,
//     required: [true, "Please enter Doctor's name"],
//   },
//   last_name: {
//     type: String,
//     required: [true, "Please enter Doctor's surname"],
//   },
//   profession: {
//     type: String,
//     required: true,
//   },
//   phone: {
//     type: String,
//     required: true,
//     default: "0"
//   },
//   gender: {
//     type: String,
//     required: true,
//     default: "Unknown"
//   },
//   about: {
//     type: String,
//     required: true,
//   },
//   clinic:{
//     type: String,
//     required: true,
//   },
//   comments: [
//     {
//       author: {
//         type: String,
//         required: true,
//       },
//       text: {
//         type: String,
//         required: true,
//       }
//     }
//   ]
// }, { timestamps: true });

// const Doctors = mongoose.model('Doctors', DoctorsSchema);
// module.exports = Doctors;


const mongoose = require('mongoose');

const timeSlotSchema = {
  time: String,
  isAvailable: { type: Boolean, default: true }
};

const scheduleSchema = {
  date: Date,
  day: String,
  month: String,
  timeSlots: [timeSlotSchema]
};

const DoctorsSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  first_name: {
    type: String,
    required: [true, "Please enter Doctor's name"],
  },
  last_name: {
    type: String,
    required: [true, "Please enter Doctor's surname"],
  },
  profession: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    default: "0"
  },
  gender: {
    type: String,
    required: true,
    default: "Unknown"
  },
  about: {
    type: String,
    required: true,
  },
  clinic:{
    type: String,
    required: true,
  },
  comments: [
    {
      author: {
        type: String,
        required: true,
      },
      text: {
        type: String,
        required: true,
      }
    }
  ],
  schedule: [scheduleSchema]
}, { timestamps: true });

const Doctors = mongoose.model('Doctors', DoctorsSchema);
module.exports = Doctors;