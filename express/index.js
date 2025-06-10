require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cron = require('node-cron');

const Doctors = require('./models/doctors.model.js');
const User = require('./models/User');
const authRoutes = require('./routes/auth');
const scheduleRoutes = require('./routes/schedule');
const { updateAllDoctorsSchedule } = require('./services/scheduleService');

const app = express();

// const __dirname = path.resolve();


// app.use(cors({
//   origin: process.env.FRONTEND_URL
// }));
if(process.env.NODE_ENV !== 'production'){
  app.use(cors({
    origin: "http://localhost:5173",
  }));
}

app.use(express.json()); 
app.use(cookieParser()); 

// routes
app.use('/api/auth', authRoutes);
app.use('/api', scheduleRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../bluemed/dist')));

  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next(); 
    }
    res.sendFile(path.join(__dirname, '../bluemed/dist/index.html'));
  });
}


// app.use(express.static(path.join(__dirname, '../bluemed/dist')));

// // for all other routes, serve React's index.html (SPA support)
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../bluemed/dist/index.html'));
// });

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('connected to mongoDB');
    
    // update the schedule daily at 00:01 AM
    cron.schedule('1 0 * * *', async () => {
      await updateAllDoctorsSchedule();
    });
    
    // one-time check during server startup - ensures schedule creation on the first run
    setTimeout(async () => {
      try {
        const doctor = await Doctors.findOne();
        if (doctor && (!doctor.schedule || doctor.schedule.length === 0)) {
            console.log('initial schedule generation...');
          await updateAllDoctorsSchedule();
        }
      } catch (err) {
        console.error('error occurred while checking the schedule:', err);
      }
    }, 2000);
    
    app.listen(3000, '0.0.0.0', () => {
      console.log('server running on http://localhost:3000');
      console.log('server running on http://0.0.0.0:3000');
      setTimeout(async () => {
        console.log('ხელით იწყება განრიგის განახლება...');
        try {
          const result = await updateAllDoctorsSchedule();
          console.log('შედეგი:', result);
        } catch (error) {
          console.error('შეცდომა განახლებისას:', error);
        }
      }, 5000);
    });
  })
  .catch(err => console.log('error', err));


app.get('/', (req, res) => {
  res.send('API for doctors and users');
});

// get all doctors data
app.get('/api/doctors', async (req, res) => {
  try {
    const doctorsList = await Doctors.find();
    res.status(200).json(doctorsList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/doctorsProf', async (req, res) => {
  try {
    const doctors = await Doctors.find({}, { schedule: 0 });
    res.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/doctors/ui', async (req, res) => {
  try {
    const doctorsList = await Doctors.find({}, {
      first_name: 1,
      last_name: 1,
      profession: 1,
      clinic: 1,
      phone: 1,
      gender: 1,
      about: 1
    }).limit(10);
    res.status(200).json(doctorsList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// get doctor by id
app.get('/api/doctors/:id', async (req, res) => {
  try {
    const doctor = await Doctors.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'doctor not found' });
    }
    res.status(200).json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/doctors/ui/:id', async (req, res) => {
  try {
    const doctor = await Doctors.findById(req.params.id, {
      first_name: 1,
      last_name: 1,
      profession: 1,
      phone: 1,
      gender: 1,
      about: 1,
      clinic: 1,
      comments: 1
    });

    if (!doctor) {
      return res.status(404).json({ message: 'doctor not found' });
    }

    res.status(200).json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// add new doctor data
app.post('/api/doctors', async (req, res) => {
  try {
    const doctor = await Doctors.create(req.body);
    res.status(201).json({ data: doctor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// user registration

app.post('/api/users/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ name, email, password: hashedPassword });
    const token = jwt.sign({ id: newUser._id, name: newUser.name }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'user successfully registered!', user: newUser, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// user login

app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'incorrect email or password' });
    }
    const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'login operation successfully', user, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// get user data by id
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'user not found.' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// gett all user data
app.get('/api/users', async (req, res) => {
  try {
    const usersList = await User.find();
    res.status(200).json(usersList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// add a comment to a specific doctor
app.post('/api/doctors/:id/comments', async (req, res) => {
  const doctorId = req.params.id;
  const { author, text } = req.body;

  try {
    // create comment object
    const comment = {
      author,
      text,
      date: new Date()
    };

    // add comment to the doctor document
    const updatedDoctor = await Doctors.findByIdAndUpdate(
      doctorId,
      { $push: { comments: comment } },  // push comment into the comments array
      { new: true } 
    );

    if (!updatedDoctor) {
      return res.status(404).json({ message: 'doctor not found' });
    }

    res.status(200).json(updatedDoctor);
  } catch (err) {
    console.error('error adding comment:', err);
    res.status(500).json({ message: 'error on server' });
  }
});
