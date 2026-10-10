require('dotenv').config();
const mongoose = require('mongoose');
const TeamMember = require('../models/TeamMember');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gdg_vimeet';

const previousTenureGroups = [
  {
    heading: 'CORE TEAM 2025-26',
    members: [
      { name: 'Pranav Salunkhe', role: 'Lead', socials: [
        { label: 'Email', href: 'mailto:pranavchamps@gmail.com' },
      ] },
      { name: 'Harsh Dhanawade', role: 'Facilitator', socials: [
        { label: 'Instagram', href: 'https://www.instagram.com/_harsh_dhanawade_?igsh=MW03bmZ6N2d4bXloNA==' },
        { label: 'LinkedIn', href: 'https://www.linkedin.com/in/harsh-dhanawade-2a3253272/' },
        { label: 'GitHub', href: 'https://github.com/HarshMD' },
      ] },
    ],
  },
  {
    heading: 'Web-Dev Team',
    members: [
      { name: 'Vikram Devadiga', role: 'Web-Dev Team Lead', socials: [
        { label: 'Instagram', href: 'https://www.instagram.com/call_me_vicky.ig/' },
        { label: 'LinkedIn', href: 'https://www.linkedin.com/in/vikramdevadiga' },
        { label: 'GitHub', href: 'https://github.com/VikramDevadiga' },
      ] },
      { name: 'Vivek Suryawanshi', role: 'Web-Dev Team Co-Lead', socials: [
        { label: 'Instagram', href: 'https://www.instagram.com/mr_vivek_1737?igsh=MThjNGpoNmNjMWhzYQ==' },
        { label: 'LinkedIn', href: 'https://www.linkedin.com/in/vivek-suryawanshi-07719628a' },
        { label: 'GitHub', href: 'https://github.com/viveksuryawanshi491' },
      ] },
      { name: 'Vansh Mhatre', role: 'Web-Dev Team Member' },
      { name: 'Bhumika Mhaskar', role: 'Web-Dev Team Member', socials: [
        { label: 'LinkedIn', href: 'https://www.linkedin.com/in/bhumika-mhaskar-12306833b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app' },
        { label: 'GitHub', href: 'https://github.com/mhaskarbhumi03-sys' },
      ] },
    ],
  },
  {
    heading: 'Technical Team',
    members: [
      { name: 'Piyush Gupta', role: 'Technical Team Member' },
      { name: 'Pankaj Chavan', role: 'Technical Team Member' },
      { name: 'Riddhi Sawant', role: 'Technical Team Member', socials: [
        { label: 'LinkedIn', href: 'https://www.linkedin.com/in/riddhi-sawant-762835342?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app' },
        { label: 'GitHub', href: 'https://github.com/RiddhiSawant27' },
      ] },
      { name: 'Yug Shah', role: 'Technical Team Member', socials: [
        { label: 'LinkedIn', href: 'https://www.linkedin.com/in/yug-shah-308446326?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app' },
        { label: 'GitHub', href: 'https://github.com/figcooks' },
      ] },
    ],
  },
  {
    heading: 'Administrative Team',
    members: [
      { name: 'Omkar Patil', role: 'Administrative Team Member' },
      { name: 'Omkar Misal', role: 'Administrative Team Member' },
      { name: 'Vishakha Yelmar', role: 'Administrative Team Member', socials: [
        { label: 'LinkedIn', href: 'https://www.linkedin.com/in/vishakha-yelmar-b19b09330?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app' },
      ] },
      { name: 'Anushka Navale', role: 'Administrative Team Member', socials: [
        { label: 'Instagram', href: 'https://www.instagram.com/anushkaa3103?igsh=dHF6b3llajF1c2N3' },
      ] },
      { name: 'Harshita Singh', role: 'Administrative Team Member' },
    ],
  },
  {
    heading: 'Graphics Team',
    members: [
      { name: 'Gauri Shinde', role: 'Graphics Team Member' },
      { name: 'Janhavi Chavan', role: 'Graphics Team Member' },
      { name: 'Jay Giri', role: 'Graphics Team Member' },
      { name: 'Shreya Patil', role: 'Graphics Team Member', socials: [
        { label: 'Instagram', href: 'https://www.instagram.com/_shreya_spams?igsh=Yzc3ejRiYWh2bXY4' },
      ] },
    ],
  },
  {
    heading: 'Content & Media Team',
    members: [
      { name: 'Rushikesh Malgan', role: 'Content & Media Team Member' },
      { name: 'Dhanashree Mohitkar', role: 'Content & Media Team Co-Lead', socials: [
        { label: 'Instagram', href: 'https://www.instagram.com/dhnshrimohitkar.__?igsh=MWFlcHdkZXdsZjhmOA==' },
        { label: 'LinkedIn', href: 'https://www.linkedin.com/in/dhanshree-mohitkar-92ba33289/' },
        { label: 'GitHub', href: 'https://github.com/dhanshree2005' },
      ] },
      { name: 'Shweta Khariwale', role: 'Content & Media Team Member' },
      { name: 'Khushi Dhammakar', role: 'Content & Media Team Member', socials: [
        { label: 'Instagram', href: 'https://www.instagram.com/khushiiii_dd?igsh=OGg3ZHk2c2lrMGFq&utm_source=qr' },
        { label: 'LinkedIn', href: 'https://www.linkedin.com/in/khushi-dhammakar-b2639a32b' },
      ] },
      { name: 'Samruddhi Adbane', role: 'Content & Media Team Member', socials: [
        { label: 'Instagram', href: 'https://www.instagram.com/samruddhiiii._.28?igsh=MTZ1azZncGY1Z2Rrag==' },
      ] },
    ],
  },
  {
    heading: 'Cloud Campaign Mentor',
    members: [
      { name: 'Nimish Patil', role: 'Cloud Campaign Mentor', socials: [
        { label: 'LinkedIn', href: 'https://www.linkedin.com/in/nimishpatil3927/' },
      ] },
    ],
  },
];

async function seed() {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB');

    await TeamMember.deleteMany({});
    console.log('Cleared existing teams');

    let orderIndex = 0;
    for (const group of previousTenureGroups) {
        for (const member of group.members) {
            const newMember = new TeamMember({
                teamName: group.heading,
                name: member.name,
                role: member.role,
                socials: member.socials || [],
                orderIndex: orderIndex++
            });
            await newMember.save();
        }
    }
    console.log('Seeded successfully!');
    mongoose.disconnect();
}
seed();
