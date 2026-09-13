"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const shared_1 = require("@interhive/shared");
async function bootstrap() {
    const logger = new common_1.Logger('Seeder');
    logger.log('Starting database dummy accounts seeding...');
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    try {
        const userModel = app.get((0, mongoose_1.getModelToken)('User'));
        const internProfileModel = app.get((0, mongoose_1.getModelToken)('InternProfile'));
        const internReadinessModel = app.get((0, mongoose_1.getModelToken)('InternReadiness'));
        const companyModel = app.get((0, mongoose_1.getModelToken)('Company'));
        const companyRequirementModel = app.get((0, mongoose_1.getModelToken)('CompanyRequirement'));
        const dummyAccounts = [
            {
                firstName: 'Alex',
                lastName: 'Admin',
                email: 'admin@interhive.in',
                password: 'Password123!',
                role: shared_1.UserRole.ADMIN,
                position: 'System Administrator',
                phone: '+91 9876543210',
            },
            {
                firstName: 'Hannah',
                lastName: 'HR',
                email: 'hr@interhive.in',
                password: 'Password123!',
                role: shared_1.UserRole.HR,
                position: 'HR Manager',
                phone: '+91 9876543211',
            },
            {
                firstName: 'Michael',
                lastName: 'Manager',
                email: 'manager@interhive.in',
                password: 'Password123!',
                role: shared_1.UserRole.MANAGER,
                position: 'Engineering Manager',
                phone: '+91 9876543212',
            },
            {
                firstName: 'Ian',
                lastName: 'Intern',
                email: 'intern@interhive.in',
                password: 'Password123!',
                role: shared_1.UserRole.INTERN,
                position: 'Software Engineering Intern',
                phone: '+91 9876543213',
            },
            {
                firstName: 'Clara',
                lastName: 'Company',
                email: 'company@interhive.in',
                password: 'Password123!',
                role: shared_1.UserRole.COMPANY,
                position: 'Tech Talent Acquisition Head',
                phone: '+91 9876543214',
            },
        ];
        let empCounter = 9000;
        for (const account of dummyAccounts) {
            empCounter++;
            let user = await userModel.findOne({ email: account.email });
            if (!user) {
                user = await userModel.findOne({ role: account.role });
            }
            if (!user) {
                user = new userModel({
                    ...account,
                    employeeId: `EMP${empCounter}`,
                    isActive: true,
                    isVerified: true,
                });
                await user.save();
                logger.log(`✅ Created user [${account.role}]: ${account.email} / ${account.password}`);
            }
            else {
                user.email = account.email;
                user.password = account.password;
                user.firstName = account.firstName;
                user.lastName = account.lastName;
                user.role = account.role;
                user.isActive = true;
                user.isVerified = true;
                await user.save();
                logger.log(`✅ Updated user [${account.role}]: ${account.email} / ${account.password}`);
            }
            if (account.role === shared_1.UserRole.INTERN) {
                let profile = await internProfileModel.findOne({ userId: user._id });
                if (!profile) {
                    profile = new internProfileModel({
                        userId: user._id,
                        personalInfo: {
                            firstName: user.firstName,
                            lastName: user.lastName,
                            gender: 'male',
                            nationality: 'Indian',
                        },
                        contact: {
                            email: user.email,
                            phone: user.phone,
                            address: { city: 'Bengaluru', state: 'Karnataka', country: 'India', zipCode: '560001' },
                        },
                        academicInfo: {
                            currentEducation: {
                                institution: 'Indian Institute of Technology',
                                degree: 'B.Tech',
                                field: 'Computer Science & Engineering',
                                startDate: new Date('2022-08-01'),
                                isCurrent: true,
                                grade: '8.8 CGPA',
                            },
                            cgpa: 8.8,
                            graduationYear: 2026,
                        },
                        professionalInfo: {
                            skills: [
                                { id: '1', name: 'React', category: 'Frontend', level: 'advanced', yearsOfExperience: 2, isVerified: true },
                                { id: '2', name: 'Node.js', category: 'Backend', level: 'intermediate', yearsOfExperience: 2, isVerified: true },
                                { id: '3', name: 'TypeScript', category: 'Programming Language', level: 'advanced', yearsOfExperience: 2, isVerified: true },
                                { id: '4', name: 'MongoDB', category: 'Database', level: 'intermediate', yearsOfExperience: 1, isVerified: true },
                            ],
                            experience: [
                                {
                                    company: 'Acme Software Solutions',
                                    position: 'Frontend Developer Intern',
                                    startDate: new Date('2025-05-01'),
                                    endDate: new Date('2025-07-31'),
                                    current: false,
                                    description: 'Built responsive Web UI components using React and Tailwind CSS.',
                                    skills: ['React', 'TypeScript'],
                                },
                            ],
                        },
                        preferences: {
                            preferredDomains: ['Full Stack Web Development', 'Frontend Development'],
                            preferredLocation: ['Bengaluru', 'Remote'],
                            preferredWorkType: ['remote', 'hybrid'],
                            expectedStipend: { min: 25000, max: 50000 },
                            availability: { startDate: new Date(), duration: 6 },
                        },
                        status: 'ready',
                    });
                    await profile.save();
                    logger.log(`✅ Seeded Intern Profile for ${user.email}`);
                }
                let readiness = await internReadinessModel.findOne({ userId: user._id });
                if (!readiness) {
                    readiness = new internReadinessModel({
                        userId: user._id,
                        overall: 85,
                        breakdown: {
                            technicalSkills: 88,
                            projects: 82,
                            communication: 90,
                            problemSolving: 84,
                            industryWorkflow: 80,
                            teamCollaboration: 86,
                            leadership: 75,
                            adaptability: 90,
                        },
                        lastUpdated: new Date(),
                    });
                    await readiness.save();
                    logger.log(`✅ Seeded Intern Readiness score for ${user.email}`);
                }
            }
            if (account.role === shared_1.UserRole.COMPANY) {
                let company = await companyModel.findOne({ 'contact.primaryContact.email': user.email });
                if (!company) {
                    company = new companyModel({
                        companyInfo: {
                            name: 'TechHive Solutions Ltd.',
                            legalName: 'TechHive Solutions Private Limited',
                            registrationNumber: 'CIN-U72200KA2024PTC123456',
                            industry: ['Software & IT Services', 'AI & Cloud Technology'],
                            size: 150,
                            foundedYear: 2020,
                            website: 'https://techhive.example.com',
                            description: 'Leading provider of cloud-native and AI-driven software solutions.',
                        },
                        contact: {
                            primaryContact: {
                                email: user.email,
                                phone: user.phone,
                                address: { city: 'Bengaluru', state: 'Karnataka', country: 'India', zipCode: '560100' },
                            },
                        },
                        status: 'verified',
                        subscription: {
                            plan: 'enterprise',
                            tier: 2,
                            startDate: new Date(),
                            features: ['Unlimited Intern Matching', 'Priority AI Screening', 'Dedicated Account Manager'],
                            price: 99999,
                            currency: 'INR',
                            status: 'active',
                            autoRenew: true,
                        },
                    });
                    await company.save();
                    logger.log(`✅ Seeded Company Profile for ${user.email}`);
                    const existingReq = await companyRequirementModel.findOne({ companyId: company._id });
                    if (!existingReq) {
                        const req = new companyRequirementModel({
                            companyId: company._id,
                            position: 'Full Stack Developer Intern',
                            department: 'Software Engineering',
                            count: 3,
                            skills: [
                                { id: '1', name: 'React', category: 'Frontend', level: 'intermediate' },
                                { id: '2', name: 'Node.js', category: 'Backend', level: 'intermediate' },
                            ],
                            stipend: { min: 30000, max: 45000, currency: 'INR', period: 'monthly' },
                            duration: { min: 3, max: 6 },
                            startDate: new Date(),
                            workType: 'hybrid',
                            location: 'Bengaluru',
                            status: 'published',
                        });
                        await req.save();
                        logger.log(`✅ Seeded Company Requirement for ${company.companyInfo.name}`);
                    }
                }
            }
        }
        logger.log('🎉 Database seeding for dummy accounts completed successfully!');
    }
    catch (error) {
        logger.error(`❌ Seeding failed: ${error.message}`);
        throw error;
    }
    finally {
        await app.close();
    }
}
bootstrap();
