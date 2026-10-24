import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

async function freshStart() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI not found in .env');
    process.exit(1);
  }

  console.log('🔄 Connecting to MongoDB database...');
  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB successfully.');

  const db = mongoose.connection.db;
  if (!db) {
    console.error('❌ Database connection handle unavailable');
    process.exit(1);
  }

  // Collections to wipe completely for a clean fresh start
  const collectionsToClear = [
    'companyleads',
    'chats',
    'internreadinesses',
    'trainingenrollments',
    'projectuploads',
    'announcements',
    'users',
    'assessmentresults',
    'matches',
    'internprofiles',
    'attendances',
    'platformstats',
    'notifications',
    'assessmentquestions',
    'messages',
    'companyrequirements',
    'projecttasks',
    'skillassessments',
    'internapplications',
    'projects',
    'internshipapplications',
    'platformactivities',
    'companies',
    'trainingprograms',
    'trainingmodules',
  ];

  console.log('\n🧹 Clearing all collections for clean fresh start...');
  for (const name of collectionsToClear) {
    try {
      const exists = await db.listCollections({ name }).hasNext();
      if (exists) {
        const result = await db.collection(name).deleteMany({});
        console.log(`  - Cleared collection '${name}': deleted ${result.deletedCount} documents`);
      }
    } catch (err: any) {
      console.warn(`  - Notice clearing '${name}': ${err.message}`);
    }
  }

  console.log('\n🌱 Seeding official InterHive v1.1 demo accounts...');
  const defaultPassword = 'InterHive@2026!';
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  const demoUsers = [
    {
      employeeId: 'EMP0001',
      firstName: 'Alex',
      lastName: 'Admin',
      email: 'admin@interhive.in',
      password: passwordHash,
      role: 'admin',
      accessLevel: 'PREMIUM',
      internStatus: 'ACTIVE',
      position: 'Super Administrator',
      phone: '+91 82783 14925',
      skills: ['System Administration', 'Security Architecture', 'Platform Governance'],
      isActive: true,
      isVerified: true,
      mustChangePassword: false,
      preferences: { theme: 'light', notifications: { email: true, push: true, sms: false } },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      employeeId: 'EMP0002',
      firstName: 'Sarah',
      lastName: 'HR',
      email: 'hr@interhive.in',
      password: passwordHash,
      role: 'hr',
      accessLevel: 'PREMIUM',
      internStatus: 'ACTIVE',
      position: 'Senior Talent Acquisition & HR Lead',
      phone: '+91 82783 14925',
      skills: ['Talent Acquisition', 'Interview Coordination', 'PPO Candidate Screening'],
      isActive: true,
      isVerified: true,
      mustChangePassword: false,
      preferences: { theme: 'light', notifications: { email: true, push: true, sms: false } },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      employeeId: 'EMP0003',
      firstName: 'Michael',
      lastName: 'Manager',
      email: 'manager@interhive.in',
      password: passwordHash,
      role: 'manager',
      accessLevel: 'PREMIUM',
      internStatus: 'ACTIVE',
      position: 'Engineering Project Manager',
      phone: '+91 82783 14925',
      skills: ['Agile Sprint Management', 'Technical Architecture', 'Intern Mentorship'],
      isActive: true,
      isVerified: true,
      mustChangePassword: false,
      preferences: { theme: 'light', notifications: { email: true, push: true, sms: false } },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      employeeId: 'EMP0004',
      firstName: 'Ian',
      lastName: 'Intern',
      email: 'intern@interhive.in',
      password: passwordHash,
      role: 'intern',
      accessLevel: 'PREMIUM',
      internStatus: 'ACTIVE',
      domain: 'Full Stack Web Development',
      position: 'Premium PPO Track Intern',
      phone: '+91 82783 14925',
      skills: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'REST APIs'],
      isActive: true,
      isVerified: true,
      mustChangePassword: false,
      preferences: { theme: 'light', notifications: { email: true, push: true, sms: false } },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      employeeId: 'EMP0005',
      firstName: 'Sam',
      lastName: 'Student',
      email: 'student@interhive.in',
      password: passwordHash,
      role: 'student',
      accessLevel: 'BASIC',
      internStatus: 'FREE',
      position: 'Free Registered Candidate',
      phone: '+91 82783 14925',
      skills: ['JavaScript', 'HTML/CSS', 'Python Basics'],
      isActive: true,
      isVerified: true,
      mustChangePassword: false,
      preferences: { theme: 'light', notifications: { email: true, push: true, sms: false } },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      employeeId: 'EMP0006',
      firstName: 'Clara',
      lastName: 'Company',
      email: 'company@interhive.in',
      password: passwordHash,
      role: 'company',
      accessLevel: 'PREMIUM',
      internStatus: 'ACTIVE',
      position: 'Talent Acquisition Partner',
      phone: '+91 82783 14925',
      skills: ['Hiring Management', 'Technical Assessment', 'Candidate Evaluation'],
      isActive: true,
      isVerified: true,
      mustChangePassword: false,
      preferences: { theme: 'light', notifications: { email: true, push: true, sms: false } },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const userCollection = db.collection('users');
  const insertUsersResult = await userCollection.insertMany(demoUsers);
  console.log(`✅ Seeded ${insertUsersResult.insertedCount} demo users.`);

  // Find created user documents
  const internUser = await userCollection.findOne({ email: 'intern@interhive.in' });
  const companyUser = await userCollection.findOne({ email: 'company@interhive.in' });

  // Seed Intern Profile for Premium Intern
  if (internUser) {
    const internProfilesCollection = db.collection('internprofiles');
    await internProfilesCollection.insertOne({
      userId: internUser._id,
      personalInfo: {
        firstName: internUser.firstName,
        lastName: internUser.lastName,
        gender: 'male',
        nationality: 'Indian',
      },
      contact: {
        email: internUser.email,
        phone: internUser.phone,
        address: { city: 'Bengaluru', state: 'Karnataka', country: 'India', zipCode: '560001' },
      },
      academicInfo: {
        currentEducation: {
          institution: 'National Institute of Technology',
          degree: 'B.Tech',
          field: 'Computer Science & Engineering',
          startDate: new Date('2022-08-01'),
          isCurrent: true,
          grade: '8.9 CGPA',
        },
        cgpa: 8.9,
        graduationYear: 2026,
      },
      professionalInfo: {
        skills: [
          { id: '1', name: 'React', category: 'Frontend', level: 'advanced', yearsOfExperience: 2, isVerified: true },
          { id: '2', name: 'Node.js', category: 'Backend', level: 'intermediate', yearsOfExperience: 2, isVerified: true },
          { id: '3', name: 'TypeScript', category: 'Language', level: 'advanced', yearsOfExperience: 2, isVerified: true },
          { id: '4', name: 'MongoDB', category: 'Database', level: 'intermediate', yearsOfExperience: 1, isVerified: true },
        ],
        experience: [
          {
            company: 'TechHive Solutions Ltd.',
            position: 'Full Stack Intern',
            startDate: new Date('2025-05-01'),
            endDate: new Date('2025-08-31'),
            current: false,
            description: 'Engineered responsive web modules with React, NestJS, and MongoDB.',
            skills: ['React', 'TypeScript', 'Node.js'],
          },
        ],
      },
      preferences: {
        preferredDomains: ['Full Stack Web Development', 'Frontend Engineering'],
        preferredLocation: ['Bengaluru', 'Remote'],
        preferredWorkType: ['remote', 'hybrid'],
        expectedStipend: { min: 30000, max: 55000 },
        availability: { startDate: new Date(), duration: 6 },
      },
      status: 'ready',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('✅ Seeded clean Intern Profile for intern@interhive.in');

    const internReadinessCollection = db.collection('internreadinesses');
    await internReadinessCollection.insertOne({
      userId: internUser._id,
      overall: 88,
      breakdown: {
        technicalSkills: 90,
        projects: 86,
        communication: 92,
        problemSolving: 85,
        industryWorkflow: 84,
        teamCollaboration: 90,
        leadership: 80,
        adaptability: 91,
      },
      lastUpdated: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('✅ Seeded clean Intern Readiness (88%) for intern@interhive.in');
  }

  // Seed Company Profile for Company User
  if (companyUser) {
    const companiesCollection = db.collection('companies');
    const companyInsert = await companiesCollection.insertOne({
      companyInfo: {
        name: 'TechHive Solutions Ltd.',
        legalName: 'TechHive Solutions Private Limited',
        registrationNumber: 'CIN-U72200KA2024PTC123456',
        industry: ['Software & IT Services', 'AI & Cloud Infrastructure'],
        size: 250,
        foundedYear: 2021,
        website: 'https://interhive.in',
        description: 'Next-generation tech enterprise partnering with InterHive to hire verified interns.',
      },
      contact: {
        primaryContact: {
          email: companyUser.email,
          phone: companyUser.phone,
          address: { city: 'Bengaluru', state: 'Karnataka', country: 'India', zipCode: '560100' },
        },
      },
      status: 'verified',
      subscription: {
        plan: 'enterprise',
        tier: 2,
        startDate: new Date(),
        features: ['Unlimited Intern Matching', 'Priority AI Screening', 'Dedicated PPO Management'],
        price: 99999,
        currency: 'INR',
        status: 'active',
        autoRenew: true,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const companyId = companyInsert.insertedId;

    const companyRequirementsCollection = db.collection('companyrequirements');
    await companyRequirementsCollection.insertOne({
      companyId: companyId,
      position: 'Full Stack Developer Intern (PPO Track)',
      department: 'Software Engineering',
      count: 5,
      skills: [
        { id: '1', name: 'React', category: 'Frontend', level: 'intermediate' },
        { id: '2', name: 'Node.js', category: 'Backend', level: 'intermediate' },
        { id: '3', name: 'TypeScript', category: 'Language', level: 'intermediate' },
      ],
      stipend: { min: 35000, max: 50000, currency: 'INR', period: 'monthly' },
      duration: { min: 3, max: 6 },
      startDate: new Date(),
      workType: 'hybrid',
      location: 'Bengaluru',
      status: 'published',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('✅ Seeded Company Profile and published requirement for TechHive Solutions Ltd.');
  }

  // Seed system announcement for v1.1
  const announcementsCollection = db.collection('announcements');
  await announcementsCollection.insertOne({
    title: 'Welcome to InterHive v1.1',
    content: 'InterHive version 1.1 is now officially live! Featuring hardened authentication, role-based dashboards, and dedicated PPO career tracks.',
    priority: 'high',
    author: 'InterHive Administration',
    targetRoles: ['admin', 'hr', 'manager', 'intern', 'student', 'company'],
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  console.log('✅ Seeded system launch announcement for InterHive v1.1.');

  console.log('\n🎉 Database reset & fresh seed completed successfully!');
  await mongoose.disconnect();
}

freshStart().catch((err) => {
  console.error('❌ Fresh start failed:', err);
  process.exit(1);
});
