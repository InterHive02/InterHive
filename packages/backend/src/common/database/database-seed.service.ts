import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class DatabaseSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger('DatabaseSeedService');

  constructor(@InjectConnection() private readonly connection: Connection) {}

  async onApplicationBootstrap() {
    await this.seedDemoAccounts();
    if (process.env.SEED_DATABASE === 'true') {
      this.logger.log('🌱 SEED_DATABASE=true detected: Seeding demo records and dummy activities...');
      await this.seedRoleBasedChats();
      await this.seedApplications();
      await this.seedTrainingPrograms();
      await this.seedProjects();
      await this.seedCompanyLeads();
      await this.seedInternReadiness();
      await this.seedCompanies();
      await this.seedCompanyRequirements();
      await this.seedMatches();
      await this.seedPlatformActivities();
    } else {
      this.logger.log('⚡ Clean startup mode: Demo accounts ensured. Fake data seeding skipped (SEED_DATABASE!=true).');
    }
  }

  async seedDemoAccounts() {
    try {
      const userCollection = this.connection.collection('users');
      this.logger.log('🌱 Checking and ensuring demo accounts in MongoDB...');

      const dummyAccounts = [
        {
          employeeId: 'EMP0001',
          firstName: 'Super',
          lastName: 'Admin',
          email: 'admin@interhive.in',
          passwordPlain: 'Admin@123',
          role: 'admin',
          position: 'System Administrator',
          phone: '+91 9876543210',
          skills: ['System Administration', 'Security', 'NestJS', 'React'],
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
          skills: ['Talent Acquisition', 'Employee Relations', 'Onboarding'],
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
          skills: ['JavaScript', 'TypeScript', 'Node.js', 'React', 'MongoDB'],
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
          skills: ['Team Leadership', 'Project Management', 'Agile'],
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
          skills: ['Hiring', 'Corporate Training'],
        },
      ];

      for (const acc of dummyAccounts) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(acc.passwordPlain, salt);
        const existing = await userCollection.findOne({ email: acc.email });

        if (!existing) {
          await userCollection.insertOne({
            employeeId: acc.employeeId,
            firstName: acc.firstName,
            lastName: acc.lastName,
            email: acc.email,
            password: hashedPassword,
            role: acc.role,
            position: acc.position,
            phone: acc.phone,
            skills: acc.skills,
            isActive: true,
            isVerified: true,
            mustChangePassword: false,
            preferences: {
              theme: 'light',
              notifications: { email: true, push: true, sms: false },
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          this.logger.log(`Created demo user: ${acc.email} (${acc.role})`);
        } else {
          await userCollection.updateOne(
            { email: acc.email },
            {
              $set: {
                password: hashedPassword,
                isActive: true,
                isVerified: true,
                role: acc.role,
              },
            },
          );
          this.logger.log(`Verified/updated demo user: ${acc.email} (${acc.role})`);
        }
      }

      const totalCount = await userCollection.countDocuments();
      this.logger.log(`✅ All demo accounts guaranteed and active. Total users in DB: ${totalCount}`);
    } catch (err: any) {
      this.logger.error(`❌ Error seeding demo accounts: ${err.message}`, err.stack);
    }
  }

  async seedRoleBasedChats() {
    try {
      const userCollection = this.connection.collection('users');
      const chatCollection = this.connection.collection('chats');
      this.logger.log('🌱 Seeding role-based chats...');

      // Role permission matrix (key = role, value = roles allowed to chat with)
      const ALLOWED_CHAT_ROLES: Record<string, string[]> = {
        admin: ['company', 'hr', 'manager'],
        company: ['admin', 'manager'],
        manager: ['admin', 'hr', 'intern'],
        hr: ['manager'],
        intern: ['manager'],
      };

      const allUsers = await userCollection.find({ isActive: true }).toArray();
      const usersByRole: Record<string, any[]> = {};
      for (const u of allUsers) {
        if (!usersByRole[u.role]) usersByRole[u.role] = [];
        usersByRole[u.role].push(u);
      }

      let created = 0;
      for (const user of allUsers) {
        const allowedRoles = ALLOWED_CHAT_ROLES[user.role] || [];
        for (const targetRole of allowedRoles) {
          const targets = usersByRole[targetRole] || [];
          for (const target of targets) {
            if (user._id.toString() === target._id.toString()) continue;

            // Check if 1-on-1 chat already exists
            const existing = await chatCollection.findOne({
              isGroupChat: false,
              participants: { $all: [user._id, target._id], $size: 2 },
              isActive: true,
            });

            if (!existing) {
              await chatCollection.insertOne({
                isGroupChat: false,
                participants: [user._id, target._id],
                createdBy: user._id,
                name: null,
                avatar: null,
                lastMessage: null,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
              });
              created++;
            }
          }
        }
      }

      this.logger.log(`✅ Role-based chats seeded. Created ${created} new chats.`);
    } catch (err: any) {
      this.logger.error(`❌ Error seeding role-based chats: ${err.message}`, err.stack);
    }
  }

  async seedApplications() {
    try {
      const appsCollection = this.connection.collection('internshipapplications');
      const count = await appsCollection.countDocuments();
      if (count === 0) {
        this.logger.log('🌱 Seeding initial internship applications into MongoDB...');
        const initialApps: any[] = [
          {
            fullName: 'Rahul Sharma',
            email: 'rahul.sharma@techcorp.in',
            phone: '+91 9876543201',
            rollNumber: 'CS202201',
            institution: 'IIT Bombay',
            degree: 'B.Tech Computer Science',
            semester: '6th Semester',
            skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS'],
            areasOfInterest: ['TechCorp India', 'Full Stack Developer'],
            internshipPreference: 'hybrid',
            resumeUrl: 'https://interhive.in/resumes/rahul-sharma.pdf',
            reasonForApplying: 'Passionate about full-stack web applications and microservices.',
            status: 'interview_scheduled',
            interview: {
              date: 'Today',
              time: '11:00 AM',
              mode: 'online',
              linkOrLocation: 'https://meet.google.com/ih-techcorp-rs',
              interviewer: 'TechCorp Technical Team',
              notes: 'Round 1 technical architecture assessment.',
              result: 'pending',
            },
            notes: [{ author: 'Hannah HR', text: 'Strong GitHub repository and algorithmic skills.', createdAt: new Date() }],
            accountCreated: false,
            createdAt: new Date(Date.now() - 3600000 * 24 * 3),
            updatedAt: new Date(),
          },
          {
            fullName: 'Priya Patel',
            email: 'priya.patel@cloudwave.io',
            phone: '+91 9876543202',
            rollNumber: 'IT202202',
            institution: 'NIT Surat',
            degree: 'B.E. Information Technology',
            semester: '6th Semester',
            skills: ['React', 'Next.js', 'Tailwind CSS', 'Redux', 'TypeScript'],
            areasOfInterest: ['CloudWave Systems', 'Frontend React Dev'],
            internshipPreference: 'remote',
            resumeUrl: 'https://interhive.in/resumes/priya-patel.pdf',
            reasonForApplying: 'Focused on high performance React client architecture and design systems.',
            status: 'interview_scheduled',
            interview: {
              date: 'Today',
              time: '02:30 PM',
              mode: 'online',
              linkOrLocation: 'https://meet.google.com/ih-cloudwave-pp',
              interviewer: 'CloudWave Lead Architect',
              notes: 'Frontend system design and responsive layouts.',
              result: 'pending',
            },
            notes: [{ author: 'Hannah HR', text: 'Excellent Figma-to-code implementations.', createdAt: new Date() }],
            accountCreated: false,
            createdAt: new Date(Date.now() - 3600000 * 24 * 2),
            updatedAt: new Date(),
          },
          {
            fullName: 'Aman Verma',
            email: 'aman.verma@nexusfin.com',
            phone: '+91 9876543203',
            rollNumber: 'MCA202203',
            institution: 'Delhi University',
            degree: 'M.C.A. Software Engineering',
            semester: '4th Semester',
            skills: ['Node.js', 'Express', 'PostgreSQL', 'Redis', 'Kafka'],
            areasOfInterest: ['Nexus FinTech', 'Backend Node.js Dev'],
            internshipPreference: 'hybrid',
            resumeUrl: 'https://interhive.in/resumes/aman-verma.pdf',
            reasonForApplying: 'Experience with high-throughput event processing and financial APIs.',
            status: 'interview_scheduled',
            interview: {
              date: 'Tomorrow',
              time: '04:00 PM',
              mode: 'online',
              linkOrLocation: 'https://meet.google.com/ih-nexus-av',
              interviewer: 'Nexus FinTech VP of Tech',
              notes: 'Confirmed by partner company engineering committee.',
              result: 'pending',
            },
            notes: [{ author: 'Hannah HR', text: 'Passed automated algorithmic screening with 98%.', createdAt: new Date() }],
            accountCreated: false,
            createdAt: new Date(Date.now() - 3600000 * 24 * 1),
            updatedAt: new Date(),
          },
        ];

        const colleges = ['BITS Pilani', 'IIT Delhi', 'DTU Delhi', 'VIT Vellore', 'NIT Trichy', 'IIIT Hyderabad', 'Manipal Institute of Tech'];
        const firstNames = ['Ananya', 'Rohan', 'Sneha', 'Vikram', 'Aditi', 'Karan', 'Pooja', 'Deepak', 'Meera', 'Arjun', 'Isha', 'Siddharth', 'Tanvi', 'Varun', 'Rhea', 'Gaurav', 'Divya', 'Manish', 'Kavya', 'Nikhil', 'Simran', 'Abhishek', 'Shreya', 'Harsh', 'Preeti', 'Yash', 'Bhavna', 'Akash', 'Swati', 'Alok', 'Neelam', 'Raj', 'Anjali', 'Mohit', 'Nandini', 'Pranav', 'Payal', 'Sachin', 'Sonali', 'Tarun', 'Pallavi', 'Girish', 'Shweta', 'Umesh', 'Richa'];
        
        for (let i = 0; i < 45; i++) {
          const fn = firstNames[i % firstNames.length];
          const ln = ['Verma', 'Gupta', 'Singh', 'Kapoor', 'Reddy', 'Mehta', 'Chopra', 'Iyer', 'Nair', 'Bansal'][i % 10];
          const college = colleges[i % colleges.length];
          let status = 'selected';
          if (i < 6) status = 'interview_scheduled';
          else if (i < 14) status = 'under_review';
          else if (i < 19) status = 'shortlisted';
          else status = 'selected';

          initialApps.push({
            fullName: `${fn} ${ln}`,
            email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i + 10}@example.com`,
            phone: `+91 98765${String(10000 + i).slice(0, 5)}`,
            rollNumber: `ROLL2026${100 + i}`,
            institution: college,
            degree: i % 2 === 0 ? 'B.Tech Computer Science' : 'B.E. Information Technology',
            semester: '6th Semester',
            skills: ['React', 'Node.js', 'Python', 'Docker', 'PostgreSQL'],
            areasOfInterest: ['Full Stack Development', 'Cloud Engineering'],
            internshipPreference: 'remote',
            resumeUrl: `https://interhive.in/resumes/${fn.toLowerCase()}-${ln.toLowerCase()}.pdf`,
            reasonForApplying: 'Eager to build high quality production software.',
            status: status,
            interview: status === 'interview_scheduled' ? {
              date: 'In 2 Days',
              time: '03:00 PM',
              mode: 'online',
              linkOrLocation: 'https://meet.google.com/ih-interview',
              interviewer: 'Technical Evaluation Panel',
              notes: 'Technical screening session',
              result: 'pending',
            } : undefined,
            notes: [],
            accountCreated: status === 'selected',
            createdAt: new Date(Date.now() - 3600000 * 24 * (i + 1)),
            updatedAt: new Date(),
          });
        }

        await appsCollection.insertMany(initialApps);
        this.logger.log(`✅ Seeded ${initialApps.length} internship applications in MongoDB.`);
      }
    } catch (err: any) {
      this.logger.error(`❌ Error seeding applications: ${err.message}`);
    }
  }

  async seedTrainingPrograms() {
    try {
      const trainingCollection = this.connection.collection('trainingprograms');
      const count = await trainingCollection.countDocuments();
      if (count === 0) {
        this.logger.log('🌱 Seeding training sprint batches into MongoDB...');
        await trainingCollection.insertMany([
          {
            title: 'Full-Stack 45-Day Sprint (Batch 12)',
            description: '18 Enrolled Interns • Sprint 3/4',
            category: 'Web Development',
            level: 'intermediate',
            duration: { min: 45, max: 45 },
            totalModules: 12,
            daysLeft: 14,
            progress: 68,
            enrolledCount: 18,
            status: 'published',
            modules: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            title: 'Data Engineering & Analytics (Batch 04)',
            description: '15 Enrolled Interns • Sprint 2/4',
            category: 'Data Science',
            level: 'intermediate',
            duration: { min: 45, max: 45 },
            totalModules: 10,
            daysLeft: 26,
            progress: 42,
            enrolledCount: 15,
            status: 'published',
            modules: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);
        this.logger.log('✅ Seeded training programs in MongoDB.');
      }
    } catch (err: any) {
      this.logger.error(`❌ Error seeding training programs: ${err.message}`);
    }
  }

  async seedProjects() {
    try {
      const projectsCollection = this.connection.collection('projects');
      const count = await projectsCollection.countDocuments();
      if (count === 0) {
        this.logger.log('🌱 Seeding active live projects into MongoDB...');
        const liveProjects = [
          'E-Commerce Microservices Engine',
          'AI Automated Document Processing',
          'Real-Time FinTech Telemetry Dashboard',
          'Cloud-Native Kubernetes Observability',
          'Enterprise Identity & Access Management',
          'Healthcare Patient Record Portal',
          'Logistics Fleet Route Optimizer',
          'Multi-Tenant SaaS Billing Platform',
          'Cybersecurity Threat Monitoring Suite',
          'EdTech Interactive Virtual Classroom',
          'Smart Supply Chain Inventory Tracker',
          'Decentralized Digital Credential Verifier',
          'Customer Sentiment Analysis Engine',
          'Cross-Platform Mobile FinTech App',
        ].map((title, idx) => ({
          title,
          description: `Production grade microservices project solving enterprise challenges in ${title}.`,
          category: ['Software Engineering', 'Enterprise'],
          status: 'in_progress',
          phase: 'execution',
          progress: 50 + (idx * 3) % 45,
          teamSize: { min: 3, max: 6 },
          duration: { weeks: 8, startDate: new Date(), endDate: new Date(Date.now() + 3600000 * 24 * 30) },
          workType: 'remote',
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
        await projectsCollection.insertMany(liveProjects);
        this.logger.log(`✅ Seeded ${liveProjects.length} live projects in MongoDB.`);
      }
    } catch (err: any) {
      this.logger.error(`❌ Error seeding projects: ${err.message}`);
    }
  }

  async seedCompanyLeads() {
    try {
      const leadsCollection = this.connection.collection('companyleads');
      const count = await leadsCollection.countDocuments();
      if (count === 0) {
        this.logger.log('🌱 Seeding company partnership leads into MongoDB...');
        await leadsCollection.insertMany([
          {
            companyName: 'TechCorp India',
            contactPerson: 'Rajesh Mehta',
            email: 'rajesh@techcorp.in',
            phone: '+91 9876543220',
            website: 'https://techcorp.in',
            industry: 'Information Technology',
            hiringRequirement: 'Full Stack Developers',
            internCount: '5-10',
            status: 'discussion',
            notes: [{ author: 'Hannah HR', text: 'Interviewing shortlisted candidates this week.', createdAt: new Date() }],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            companyName: 'CloudWave Systems',
            contactPerson: 'Neha Kapoor',
            email: 'neha@cloudwave.io',
            phone: '+91 9876543221',
            website: 'https://cloudwave.io',
            industry: 'Cloud & DevOps',
            hiringRequirement: 'Frontend React Devs',
            internCount: '3-5',
            status: 'contacted',
            notes: [{ author: 'Hannah HR', text: 'Technical round scheduled.', createdAt: new Date() }],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            companyName: 'Nexus FinTech',
            contactPerson: 'Vikram Singhania',
            email: 'vikram@nexusfin.com',
            phone: '+91 9876543222',
            website: 'https://nexusfin.com',
            industry: 'Financial Technology',
            hiringRequirement: 'Backend Node.js Devs',
            internCount: '5-10',
            status: 'follow_up',
            notes: [{ author: 'Hannah HR', text: 'Partner agreement under review.', createdAt: new Date() }],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            companyName: 'Apex Digital Mobility',
            contactPerson: 'Arjun Nair',
            email: 'arjun@apexdigital.com',
            phone: '+91 9876543223',
            website: 'https://apexdigital.com',
            industry: 'Automotive & IoT',
            hiringRequirement: 'Full Stack & Mobile Devs',
            internCount: '10+',
            status: 'converted',
            notes: [{ author: 'Hannah HR', text: 'Contract signed, placing Batch 12 interns.', createdAt: new Date() }],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);
        this.logger.log('✅ Seeded company leads in MongoDB.');
      }
    } catch (err: any) {
      this.logger.error(`❌ Error seeding company leads: ${err.message}`);
    }
  }

  async seedInternReadiness() {
    try {
      const readinessCollection = this.connection.collection('internreadinesses');
      const count = await readinessCollection.countDocuments();
      if (count === 0) {
        this.logger.log('🌱 Seeding intern readiness scores in MongoDB...');
        const scores: any[] = [];
        for (let i = 0; i < 26; i++) {
          scores.push({
            userId: `demo-intern-${i + 1}`,
            overall: 80 + (i % 18),
            breakdown: {
              technicalSkills: 85,
              projects: 88,
              communication: 82,
              problemSolving: 90,
              industryWorkflow: 84,
              teamCollaboration: 86,
              leadership: 80,
              adaptability: 88,
            },
            history: [],
            lastUpdated: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
        await readinessCollection.insertMany(scores);
        this.logger.log(`✅ Seeded ${scores.length} placement-ready records in MongoDB.`);
      }
    } catch (err: any) {
      this.logger.error(`❌ Error seeding intern readiness: ${err.message}`);
    }
  }

  async seedCompanies() {
    try {
      const companiesCollection = this.connection.collection('companies');
      const count = await companiesCollection.countDocuments();
      if (count < 5) {
        this.logger.log('🌱 Seeding partner companies in MongoDB...');
        const initialCompanies = [
          {
            companyInfo: {
              name: 'TechCorp India',
              legalName: 'TechCorp Solutions Private Limited',
              registrationNumber: 'CIN-U72200MH2021PTC123456',
              industry: ['Information Technology', 'Software Engineering'],
              size: 250,
              foundedYear: 2018,
              website: 'https://techcorp.in',
              description: 'Premier enterprise cloud and full-stack software development powerhouse.',
            },
            contact: {
              primaryContact: {
                email: 'company@interhive.in',
                phone: '+91 9876543214',
                address: { street: 'Bandra-Kurla Complex', city: 'Mumbai', state: 'Maharashtra', country: 'India', zipCode: '400051' },
              },
            },
            status: 'active',
            subscription: { plan: 'premium', tier: 2, status: 'active', price: 25000, currency: 'INR', autoRenew: true },
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            companyInfo: {
              name: 'Innovate AI Labs',
              legalName: 'Innovate Artificial Intelligence Labs Inc.',
              registrationNumber: 'CIN-U72900KA2022PTC654321',
              industry: ['Artificial Intelligence', 'Machine Learning'],
              size: 85,
              foundedYear: 2021,
              website: 'https://innovateai.io',
              description: 'Generative AI and automated vision systems research studio.',
            },
            contact: {
              primaryContact: {
                email: 'careers@innovateai.io',
                phone: '+91 9876543230',
                address: { street: 'Indiranagar 100ft Road', city: 'Bengaluru', state: 'Karnataka', country: 'India', zipCode: '560038' },
              },
            },
            status: 'pending',
            subscription: { plan: 'basic', tier: 1, status: 'active', price: 10000, currency: 'INR', autoRenew: true },
            createdAt: new Date(Date.now() - 3600000 * 35),
            updatedAt: new Date(),
          },
          {
            companyInfo: {
              name: 'CloudWave Systems',
              legalName: 'CloudWave Technologies LLP',
              registrationNumber: 'CIN-U72300DL2020LLP987654',
              industry: ['Cloud & DevOps', 'Infrastructure'],
              size: 120,
              foundedYear: 2020,
              website: 'https://cloudwave.io',
              description: 'High throughput cloud native architectures and Kubernetes orchestrations.',
            },
            contact: {
              primaryContact: {
                email: 'neha@cloudwave.io',
                phone: '+91 9876543221',
                address: { street: 'Connaught Place', city: 'New Delhi', state: 'Delhi', country: 'India', zipCode: '110001' },
              },
            },
            status: 'active',
            subscription: { plan: 'premium', tier: 2, status: 'active', price: 25000, currency: 'INR', autoRenew: true },
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            companyInfo: {
              name: 'Nexus FinTech',
              legalName: 'Nexus Financial Technologies India Pvt Ltd',
              registrationNumber: 'CIN-U65999MH2019PTC112233',
              industry: ['FinTech', 'Banking Technology'],
              size: 300,
              foundedYear: 2019,
              website: 'https://nexusfin.com',
              description: 'Next-generation UPI payments and algorithmic credit assessment engines.',
            },
            contact: {
              primaryContact: {
                email: 'contact@nexusfin.com',
                phone: '+91 9876543222',
                address: { street: 'Cyber City', city: 'Gurugram', state: 'Haryana', country: 'India', zipCode: '122002' },
              },
            },
            status: 'active',
            subscription: { plan: 'enterprise', tier: 3, status: 'active', price: 50000, currency: 'INR', autoRenew: true },
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            companyInfo: {
              name: 'Apex Digital Mobility',
              legalName: 'Apex Digital Mobility Systems Ltd',
              registrationNumber: 'CIN-U34100TN2017PLC445566',
              industry: ['Automotive & IoT', 'Embedded Systems'],
              size: 150,
              foundedYear: 2017,
              website: 'https://apexdigital.com',
              description: 'Connected vehicle telemetry and autonomous vehicle sensing platform.',
            },
            contact: {
              primaryContact: {
                email: 'arjun@apexdigital.com',
                phone: '+91 9876543223',
                address: { street: 'OMR IT Expressway', city: 'Chennai', state: 'Tamil Nadu', country: 'India', zipCode: '600096' },
              },
            },
            status: 'active',
            subscription: { plan: 'premium', tier: 2, status: 'active', price: 25000, currency: 'INR', autoRenew: true },
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];

        // Ensure 46 companies in database to match reference KPI: 46 active partner companies
        const industryList = ['SaaS', 'EdTech', 'HealthTech', 'Cybersecurity', 'Logistics', 'Retail AI', 'Gaming & XR'];
        for (let i = 6; i <= 46; i++) {
          const isPending = i % 6 === 0;
          initialCompanies.push({
            companyInfo: {
              name: `Partner Studio ${i}`,
              legalName: `Partner Studio ${i} India Pvt Ltd`,
              registrationNumber: `CIN-U72200MH2022PTC${100000 + i}`,
              industry: [industryList[i % industryList.length], 'Software'],
              size: 40 + (i * 5),
              foundedYear: 2019 + (i % 4),
              website: `https://partner${i}.example.com`,
              description: `Technology partner organization #${i} specializing in ${industryList[i % industryList.length]}.`,
            },
            contact: {
              primaryContact: {
                email: `contact@partner${i}.example.com`,
                phone: `+91 98765${String(20000 + i).slice(0, 5)}`,
                address: { street: 'Tech Park', city: 'Bengaluru', state: 'Karnataka', country: 'India', zipCode: '560001' },
              },
            },
            status: isPending ? 'pending' : 'active',
            subscription: { plan: 'basic', tier: 1, status: 'active', price: 10000, currency: 'INR', autoRenew: true },
            createdAt: new Date(Date.now() - 3600000 * 24 * (i + 1)),
            updatedAt: new Date(),
          });
        }

        await companiesCollection.insertMany(initialCompanies);
        this.logger.log(`✅ Seeded ${initialCompanies.length} partner companies in MongoDB.`);
      }
    } catch (err: any) {
      this.logger.error(`❌ Error seeding companies: ${err.message}`);
    }
  }

  async seedCompanyRequirements() {
    try {
      const requirementsCollection = this.connection.collection('companyrequirements');
      const companiesCollection = this.connection.collection('companies');
      const count = await requirementsCollection.countDocuments();

      if (count < 4) {
        this.logger.log('🌱 Seeding company hiring requirements in MongoDB...');
        const techcorp = await companiesCollection.findOne({ 'companyInfo.name': 'TechCorp India' });
        const companyId = techcorp ? techcorp._id : null;

        const initialRequirements = [
          {
            companyId,
            position: 'Frontend Developer Intern',
            department: 'Web Development',
            count: 3,
            applicantsCount: 24,
            postedDaysAgo: 2,
            skills: [
              { id: '1', name: 'React.js', category: 'Frontend', level: 'Intermediate' },
              { id: '2', name: 'TypeScript', category: 'Language', level: 'Intermediate' },
              { id: '3', name: 'Tailwind CSS', category: 'Design', level: 'Intermediate' },
            ],
            experience: { min: 0, max: 1 },
            education: { minDegree: 'B.Tech / B.E.', preferredFields: ['Computer Science', 'IT'] },
            responsibilities: [
              'Build responsive, production-ready React components.',
              'Collaborate with UI/UX team on design token implementations.',
              'Integrate RESTful microservices and GraphQL client hooks.',
            ],
            benefits: ['Paid stipend', 'Mentorship from Staff Engineers', 'Full-time conversion opportunity'],
            stipend: { min: 15000, max: 25000, currency: 'INR', period: 'monthly' },
            workType: 'remote',
            location: 'Bangalore / Remote',
            duration: { min: 3, max: 6 },
            startDate: new Date(),
            status: 'published',
            createdAt: new Date(Date.now() - 3600000 * 24 * 2),
            updatedAt: new Date(),
          },
          {
            companyId,
            position: 'Data Science Intern',
            department: 'Data & Analytics',
            count: 2,
            applicantsCount: 18,
            postedDaysAgo: 4,
            skills: [
              { id: '4', name: 'Python', category: 'Language', level: 'Advanced' },
              { id: '5', name: 'Pandas & NumPy', category: 'Data', level: 'Intermediate' },
              { id: '6', name: 'SQL', category: 'Database', level: 'Intermediate' },
            ],
            experience: { min: 0, max: 1 },
            education: { minDegree: 'B.Tech / M.Tech / MCA', preferredFields: ['Computer Science', 'Data Science', 'Statistics'] },
            responsibilities: [
              'Develop feature extraction pipelines for predictive telemetry models.',
              'Clean, transform, and aggregate large multidimensional time-series datasets.',
            ],
            benefits: ['Flexible hours', 'Cloud GPU credits', 'Certificate of Completion'],
            stipend: { min: 18000, max: 28000, currency: 'INR', period: 'monthly' },
            workType: 'hybrid',
            location: 'Mumbai Office / Hybrid',
            duration: { min: 3, max: 6 },
            startDate: new Date(),
            status: 'published',
            createdAt: new Date(Date.now() - 3600000 * 24 * 4),
            updatedAt: new Date(),
          },
          {
            companyId,
            position: 'UI/UX Design Intern',
            department: 'Design',
            count: 2,
            applicantsCount: 16,
            postedDaysAgo: 6,
            skills: [
              { id: '7', name: 'Figma', category: 'Design', level: 'Advanced' },
              { id: '8', name: 'Wireframing', category: 'UX', level: 'Intermediate' },
              { id: '9', name: 'Design Systems', category: 'Design', level: 'Intermediate' },
            ],
            experience: { min: 0, max: 1 },
            education: { minDegree: 'B.Des / B.Tech', preferredFields: ['Design', 'HCI', 'Computer Science'] },
            responsibilities: [
              'Design high fidelity interactive wireframes and design system components.',
              'Participate in user research and usability testing sessions.',
            ],
            benefits: ['Figma Pro License', 'Design review sessions with Head of Product'],
            stipend: { min: 15000, max: 22000, currency: 'INR', period: 'monthly' },
            workType: 'remote',
            location: 'Remote',
            duration: { min: 3, max: 6 },
            startDate: new Date(),
            status: 'draft',
            createdAt: new Date(Date.now() - 3600000 * 24 * 6),
            updatedAt: new Date(),
          },
          {
            companyId,
            position: 'Backend Developer Intern',
            department: 'Backend Development',
            count: 4,
            applicantsCount: 31,
            postedDaysAgo: 7,
            skills: [
              { id: '10', name: 'Node.js', category: 'Backend', level: 'Intermediate' },
              { id: '11', name: 'PostgreSQL', category: 'Database', level: 'Intermediate' },
              { id: '12', name: 'Redis', category: 'Cache', level: 'Intermediate' },
            ],
            experience: { min: 0, max: 1 },
            education: { minDegree: 'B.Tech / MCA', preferredFields: ['Computer Science', 'IT'] },
            responsibilities: [
              'Architect event-driven NestJS microservices and perform database optimizations.',
              'Implement secure JWT/OAuth authentication workflows.',
            ],
            benefits: ['Competitive Stipend', 'High ownership on core modules'],
            stipend: { min: 20000, max: 30000, currency: 'INR', period: 'monthly' },
            workType: 'remote',
            location: 'Remote',
            duration: { min: 3, max: 6 },
            startDate: new Date(),
            status: 'published',
            createdAt: new Date(Date.now() - 3600000 * 24 * 7),
            updatedAt: new Date(),
          },
          {
            companyId,
            position: 'Cloud DevOps Intern',
            department: 'Cloud Infrastructure',
            count: 2,
            applicantsCount: 14,
            postedDaysAgo: 9,
            skills: [
              { id: '13', name: 'Docker', category: 'DevOps', level: 'Intermediate' },
              { id: '14', name: 'Kubernetes', category: 'DevOps', level: 'Intermediate' },
              { id: '15', name: 'AWS', category: 'Cloud', level: 'Intermediate' },
            ],
            experience: { min: 0, max: 1 },
            education: { minDegree: 'B.Tech', preferredFields: ['Computer Science', 'IT'] },
            responsibilities: ['Build CI/CD pipelines in GitHub Actions and maintain Kubernetes clusters.'],
            benefits: ['AWS Certification sponsorship', 'Flexible schedule'],
            stipend: { min: 18000, max: 26000, currency: 'INR', period: 'monthly' },
            workType: 'hybrid',
            location: 'Bengaluru / Hybrid',
            duration: { min: 3, max: 6 },
            startDate: new Date(),
            status: 'published',
            createdAt: new Date(Date.now() - 3600000 * 24 * 9),
            updatedAt: new Date(),
          },
        ];

        // Seed 7 additional requirements to total 12 active requirements matching KPI card
        const moreRoles = [
          { pos: 'Mobile App Developer Intern (Flutter)', dept: 'Mobile Development', count: 2, apps: 19 },
          { pos: 'Cybersecurity Analyst Intern', dept: 'Security', count: 1, apps: 11 },
          { pos: 'QA Automation Engineer Intern', dept: 'Quality Assurance', count: 3, apps: 22 },
          { pos: 'AI Prompt & LLM Ops Intern', dept: 'AI Research', count: 2, apps: 28 },
          { pos: 'Product Operations Intern', dept: 'Product Management', count: 1, apps: 15 },
          { pos: 'Full Stack MERN Intern', dept: 'Web Engineering', count: 4, apps: 34 },
          { pos: 'Database Systems Intern', dept: 'Data Engineering', count: 2, apps: 12 },
        ];

        moreRoles.forEach((r, idx) => {
          initialRequirements.push({
            companyId,
            position: r.pos,
            department: r.dept,
            count: r.count,
            applicantsCount: r.apps,
            postedDaysAgo: 10 + idx,
            skills: [{ id: `s-${idx}`, name: 'General Engineering', category: 'Tech', level: 'Intermediate' }],
            experience: { min: 0, max: 1 },
            education: { minDegree: 'B.Tech', preferredFields: ['Computer Science'] },
            responsibilities: ['Develop scalable modular code under senior guidance.'],
            benefits: ['Stipend', 'Certificate'],
            stipend: { min: 15000, max: 25000, currency: 'INR', period: 'monthly' },
            workType: 'remote',
            location: 'Remote',
            duration: { min: 3, max: 6 },
            startDate: new Date(),
            status: 'published',
            createdAt: new Date(Date.now() - 3600000 * 24 * (10 + idx)),
            updatedAt: new Date(),
          });
        });

        await requirementsCollection.insertMany(initialRequirements);
        this.logger.log(`✅ Seeded ${initialRequirements.length} company requirements in MongoDB.`);
      }
    } catch (err: any) {
      this.logger.error(`❌ Error seeding company requirements: ${err.message}`);
    }
  }

  async seedMatches() {
    try {
      const matchesCollection = this.connection.collection('matches');
      const count = await matchesCollection.countDocuments();
      if (count < 10) {
        this.logger.log('🌱 Seeding intern candidate matches in MongoDB...');
        const initialMatches = [
          {
            internName: 'Rahul Sharma',
            internEmail: 'rahul.sharma@techcorp.in',
            college: 'IIT Bombay',
            degree: 'B.Tech Computer Science',
            role: 'Full Stack Developer',
            matchScore: 94,
            skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS'],
            status: 'interview_scheduled',
            interview: {
              scheduledDate: new Date(Date.now() + 3600000 * 2).toISOString(),
              type: 'Technical Interview',
              meetingLink: 'https://meet.google.com/ih-techcorp-rs',
              status: 'scheduled',
            },
            createdAt: new Date(),
          },
          {
            internName: 'Priya Patel',
            internEmail: 'priya.patel@cloudwave.io',
            college: 'NIT Surat',
            degree: 'B.E. Information Technology',
            role: 'Frontend React Dev',
            matchScore: 91,
            skills: ['React', 'Next.js', 'Tailwind CSS', 'Redux', 'TypeScript'],
            status: 'interview_scheduled',
            interview: {
              scheduledDate: new Date(Date.now() + 3600000 * 5).toISOString(),
              type: 'Frontend System Design',
              meetingLink: 'https://meet.google.com/ih-cloudwave-pp',
              status: 'scheduled',
            },
            createdAt: new Date(),
          },
          {
            internName: 'Aman Verma',
            internEmail: 'aman.verma@nexusfin.com',
            college: 'Delhi University',
            degree: 'M.C.A. Software Engineering',
            role: 'Backend Node.js Dev',
            matchScore: 89,
            skills: ['Node.js', 'Express', 'PostgreSQL', 'Redis', 'Kafka'],
            status: 'interview_scheduled',
            interview: {
              scheduledDate: new Date(Date.now() + 3600000 * 26).toISOString(),
              type: 'Backend Architecture',
              meetingLink: 'https://meet.google.com/ih-nexus-av',
              status: 'scheduled',
            },
            createdAt: new Date(),
          },
          {
            internName: 'Sneha Reddy',
            internEmail: 'sneha.r@outlook.com',
            college: 'BITS Pilani',
            degree: 'B.Tech Computer Science',
            role: 'Frontend Developer',
            matchScore: 87,
            skills: ['React', 'TypeScript', 'UI Systems'],
            status: 'accepted',
            createdAt: new Date(),
          },
          {
            internName: 'Vikram Mehta',
            internEmail: 'vikram.m@gmail.com',
            college: 'IIT Delhi',
            degree: 'B.Tech Computer Science',
            role: 'Full Stack Developer',
            matchScore: 85,
            skills: ['React', 'Node.js', 'Docker', 'PostgreSQL'],
            status: 'hired',
            createdAt: new Date(),
          },
        ];

        // Seed matches up to 248 to match reference donut breakdown:
        // Highly Matched (90%+): 120 (48%)
        // Good Match (75-89%): 82 (33%)
        // Partial Match (60-74%): 38 (15%)
        // Review Needed: 8 (4%)
        // Total = 248
        const rolesPool = ['Frontend Developer', 'Backend Developer', 'Data Science', 'UI/UX Design', 'DevOps'];
        const collegesPool = ['BITS Pilani', 'IIT Delhi', 'DTU Delhi', 'VIT Vellore', 'NIT Trichy', 'IIIT Hyderabad'];
        const sampleNames = [
          'Ananya Deshmukh', 'Aditi Rao', 'Rohan Gupta', 'Karan Johar', 'Pooja Hegde', 'Deepak Hooda',
          'Meera Nair', 'Arjun Kapoor', 'Isha Ambani', 'Siddharth Roy', 'Tanvi Shah', 'Varun Dhawan',
          'Rhea Chakraborty', 'Gaurav Gill', 'Divya Bharti', 'Manish Pandey', 'Kavya Maran', 'Nikhil Chinapa',
        ];

        for (let i = 6; i <= 248; i++) {
          let score = 85;
          let status = 'accepted';
          if (i <= 120) {
            score = 90 + (i % 9);
            if (i <= 38) status = 'interview_scheduled';
            else if (i <= 54) status = 'hired';
          } else if (i <= 202) {
            score = 75 + (i % 15);
            status = 'pending';
          } else if (i <= 240) {
            score = 60 + (i % 15);
            status = 'pending';
          } else {
            score = 52 + (i % 8);
            status = 'pending';
          }

          const name = sampleNames[i % sampleNames.length];
          initialMatches.push({
            internName: `${name} ${i}`,
            internEmail: `candidate${i}@example.com`,
            college: collegesPool[i % collegesPool.length],
            degree: 'B.Tech Computer Science',
            role: rolesPool[i % rolesPool.length],
            matchScore: score,
            skills: ['JavaScript', 'React', 'Node.js'],
            status,
            createdAt: new Date(Date.now() - 3600000 * 24 * (i % 30)),
          });
        }

        await matchesCollection.insertMany(initialMatches);
        this.logger.log(`✅ Seeded ${initialMatches.length} candidate matches in MongoDB.`);
      }
    } catch (err: any) {
      this.logger.error(`❌ Error seeding matches: ${err.message}`);
    }
  }

  async seedPlatformActivities() {
    try {
      const activitiesCollection = this.connection.collection('platformactivities');
      const count = await activitiesCollection.countDocuments();
      if (count < 5) {
        this.logger.log('🌱 Seeding platform activities in MongoDB...');
        const initialActivities = [
          {
            userName: 'Vikram Mehta',
            userEmail: 'vikram.m@gmail.com',
            role: 'Intern (Full Stack)',
            timeAgo: '10 mins ago',
            status: 'Active',
            statusType: 'success',
            entityType: 'intern',
            details: 'Completed profile setup and verified identity credentials.',
            createdAt: new Date(Date.now() - 1000 * 60 * 10),
          },
          {
            userName: 'Innovate AI Labs',
            userEmail: 'careers@innovateai.io',
            role: 'Company Partner',
            timeAgo: '35 mins ago',
            status: 'Pending Approval',
            statusType: 'warning',
            entityType: 'company',
            details: 'Submitted enterprise onboarding inquiry with 85 team headcount.',
            createdAt: new Date(Date.now() - 1000 * 60 * 35),
          },
          {
            userName: 'Sneha Reddy',
            userEmail: 'sneha.r@outlook.com',
            role: 'Intern (Frontend)',
            timeAgo: '1 hour ago',
            status: 'Active',
            statusType: 'success',
            entityType: 'intern',
            details: 'Earned Advanced React 98% badge on skills assessment.',
            createdAt: new Date(Date.now() - 1000 * 60 * 60),
          },
          {
            userName: 'Ananya Deshmukh',
            userEmail: 'ananya@interhive.in',
            role: 'HR Evaluator',
            timeAgo: '3 hours ago',
            status: 'Active',
            statusType: 'success',
            entityType: 'staff',
            details: 'Scheduled 6 candidate interviews for TechCorp India.',
            createdAt: new Date(Date.now() - 1000 * 60 * 180),
          },
          {
            userName: 'Rahul Chawla',
            userEmail: 'rahul@cloudwave.com',
            role: 'Company Partner',
            timeAgo: '3 hours ago',
            status: 'Pending Verification',
            statusType: 'primary',
            entityType: 'company',
            details: 'Updated corporate GSTIN and company verification documents.',
            createdAt: new Date(Date.now() - 1000 * 60 * 190),
          },
        ];

        await activitiesCollection.insertMany(initialActivities);
        this.logger.log(`✅ Seeded ${initialActivities.length} platform activities in MongoDB.`);
      }
    } catch (err: any) {
      this.logger.error(`❌ Error seeding platform activities: ${err.message}`);
    }
  }
}
