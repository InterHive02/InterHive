const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

// Load environment variables
const envPath = path.resolve(__dirname, '../packages/backend/.env');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...values] = trimmed.split('=');
      if (key && values.length > 0) {
        process.env[key.trim()] = values.join('=').trim();
      }
    }
  });
}

const mongoUri = process.env.MONGODB_URI;
console.log('Connecting to MongoDB URI:', mongoUri.replace(/:([^:@]+)@/, ':****@'));

const userSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['admin', 'hr', 'manager', 'intern', 'company'] },
  position: { type: String },
  phone: { type: String },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: true },
  skills: [String],
  preferences: {
    theme: { type: String, default: 'light' },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    }
  }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

const dummyUsers = [
  {
    employeeId: 'EMP0001',
    firstName: 'Super',
    lastName: 'Admin',
    email: 'admin@interhive.in',
    passwordPlain: 'Admin@123',
    role: 'admin',
    position: 'System Administrator',
    phone: '+91 9876543210',
    skills: ['System Administration', 'Cloud Infrastructure', 'Security', 'NestJS', 'React']
  },
  {
    employeeId: 'EMP0002',
    firstName: 'Sarah',
    lastName: 'HR',
    email: 'hr@interhive.in',
    passwordPlain: 'HrManager@123',
    role: 'hr',
    position: 'HR Manager',
    phone: '+91 9876543211',
    skills: ['Talent Acquisition', 'Employee Relations', 'Performance Management', 'Onboarding']
  },
  {
    employeeId: 'EMP0003',
    firstName: 'John',
    lastName: 'Intern',
    email: 'intern@interhive.in',
    passwordPlain: 'Intern@123',
    role: 'intern',
    position: 'Software Engineering Intern',
    phone: '+91 9876543213',
    skills: ['JavaScript', 'TypeScript', 'Node.js', 'React', 'MongoDB']
  },
  {
    employeeId: 'EMP9003',
    firstName: 'Alex',
    lastName: 'Manager',
    email: 'manager@interhive.in',
    passwordPlain: 'Manager@123',
    role: 'manager',
    position: 'Engineering Manager',
    phone: '+91 9876543212',
    skills: ['Team Leadership', 'Project Management', 'Agile/Scrum', 'Architecture Design']
  },
  {
    employeeId: 'EMP9005',
    firstName: 'TechCorp',
    lastName: 'Representative',
    email: 'company@interhive.in',
    passwordPlain: 'Company@123',
    role: 'company',
    position: 'Company Recruiter',
    phone: '+91 9876543214',
    skills: ['Hiring', 'Corporate Training', 'Internship Mentorship']
  }
];

async function seed() {
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('✅ Connected to MongoDB Atlas successfully!\n');

    console.log('Creating / Updating dummy accounts...\n');

    for (const userData of dummyUsers) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.passwordPlain, salt);

      const updateData = {
        employeeId: userData.employeeId,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
        position: userData.position,
        phone: userData.phone,
        isActive: true,
        isVerified: true,
        skills: userData.skills,
        preferences: {
          theme: 'light',
          notifications: { email: true, push: true, sms: false }
        }
      };

      await User.findOneAndUpdate(
        { email: userData.email },
        { $set: updateData },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      console.log(`✓ [${userData.role.toUpperCase()}] ${userData.email} (Password: ${userData.passwordPlain})`);
    }

    console.log('\n🎉 All dummy accounts created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding error:', error.message);
    process.exit(1);
  }
}

seed();
