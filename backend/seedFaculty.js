require('dotenv').config();
const mongoose = require('mongoose');
const FacultyMember = require('./models/FacultyMember');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gdg_vimeet';

const guidance = [
  { name: 'Dr. B. R. Patil', role: 'Principal of ViMEET', orderIndex: 1 },
  { name: 'Dr. Shankar S. Kadam', role: 'Vice-Principal of ViMEET', orderIndex: 2 },
  { name: 'Mrs. Charusheela Pandit', role: 'HOD, Computer Engineering', orderIndex: 3 },
  { name: 'Dr. Ankush Pawar', role: 'HOD, Cse(AIML) Engineering', orderIndex: 4 },
  { name: 'Dr. Jyoti Gangane', role: 'HOD, EXTC Engineering', orderIndex: 5 },
  { name: 'Mrs. Shivani Agrawal', role: 'HOD, First Year Engineering', orderIndex: 6 },
  { name: 'Dr. Bhaveshkumar Pasi', role: 'HOD, Mechanical Engineering', orderIndex: 7 },
  { name: 'Dr. Shilpa Pankaj Kewate', role: 'HOD, Civil Engineering', orderIndex: 8 },
  { name: 'Prof. Sharvari Hemchandra Sane', role: 'HOD, Electrical Engineering', orderIndex: 9 },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB');

    const count = await FacultyMember.countDocuments();
    if (count === 0) {
      await FacultyMember.insertMany(guidance);
      console.log('Seeded faculty members successfully!');
    } else {
      console.log('Faculty already seeded, skipping.');
    }
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    mongoose.disconnect();
  }
}

seed();
