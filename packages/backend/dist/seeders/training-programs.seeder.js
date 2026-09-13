"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var TrainingProgramsSeeder_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainingProgramsSeeder = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const training_program_schema_1 = require("../modules/training/schemas/training-program.schema");
const training_module_schema_1 = require("../modules/training/schemas/training-module.schema");
let TrainingProgramsSeeder = TrainingProgramsSeeder_1 = class TrainingProgramsSeeder {
    constructor(programModel, moduleModel) {
        this.programModel = programModel;
        this.moduleModel = moduleModel;
        this.logger = new common_1.Logger(TrainingProgramsSeeder_1.name);
    }
    async seed() {
        this.logger.log('Seeding training programs...');
        const programs = [
            {
                title: 'Full Stack Development - 45 Days',
                description: 'Comprehensive full stack development program covering React, Node.js, MongoDB, and more.',
                category: 'Web Development',
                level: 'intermediate',
                duration: { min: 45, max: 60 },
                industry: [{ id: 'web_dev', name: 'Web Development', category: 'Technology' }],
                modules: [
                    {
                        title: 'Foundation - HTML & CSS',
                        description: 'Learn HTML5 and CSS3 fundamentals',
                        type: 'video',
                        duration: 120,
                        isRequired: true,
                    },
                    {
                        title: 'JavaScript Fundamentals',
                        description: 'Master JavaScript ES6+ concepts',
                        type: 'video',
                        duration: 180,
                        isRequired: true,
                    },
                    {
                        title: 'React - Building UI',
                        description: 'Learn React components, hooks, and state management',
                        type: 'project',
                        duration: 240,
                        isRequired: true,
                    },
                    {
                        title: 'Backend with Node.js',
                        description: 'Build REST APIs with Node.js and Express',
                        type: 'project',
                        duration: 200,
                        isRequired: true,
                    },
                    {
                        title: 'Database with MongoDB',
                        description: 'Learn MongoDB and Mongoose',
                        type: 'lab',
                        duration: 120,
                        isRequired: true,
                    },
                    {
                        title: 'Industry Workflow - Git & Agile',
                        description: 'Learn Git workflows, Agile methodology, and CI/CD',
                        type: 'article',
                        duration: 90,
                        isRequired: true,
                    },
                    {
                        title: 'Live Project - E-commerce App',
                        description: 'Build a complete e-commerce application',
                        type: 'project',
                        duration: 480,
                        isRequired: true,
                    },
                ],
            },
            {
                title: 'Data Science & Analytics',
                description: 'Learn data science fundamentals including Python, Pandas, and Machine Learning.',
                category: 'Data Science',
                level: 'intermediate',
                duration: { min: 30, max: 45 },
                industry: [{ id: 'data_science', name: 'Data Science', category: 'Technology' }],
                modules: [
                    {
                        title: 'Python for Data Science',
                        description: 'Learn Python basics for data analysis',
                        type: 'video',
                        duration: 150,
                        isRequired: true,
                    },
                    {
                        title: 'Data Analysis with Pandas',
                        description: 'Master data manipulation with Pandas',
                        type: 'lab',
                        duration: 180,
                        isRequired: true,
                    },
                    {
                        title: 'Data Visualization',
                        description: 'Learn data visualization with Matplotlib and Seaborn',
                        type: 'project',
                        duration: 120,
                        isRequired: true,
                    },
                ],
            },
            {
                title: 'DevOps & Cloud Engineering',
                description: 'Master DevOps practices and cloud infrastructure.',
                category: 'DevOps',
                level: 'advanced',
                duration: { min: 30, max: 40 },
                industry: [{ id: 'devops', name: 'DevOps', category: 'Technology' }],
                modules: [
                    {
                        title: 'Linux Fundamentals',
                        description: 'Learn Linux basics and shell scripting',
                        type: 'video',
                        duration: 120,
                        isRequired: true,
                    },
                    {
                        title: 'Docker & Containerization',
                        description: 'Master Docker for application containerization',
                        type: 'lab',
                        duration: 180,
                        isRequired: true,
                    },
                    {
                        title: 'Kubernetes Orchestration',
                        description: 'Learn Kubernetes for container orchestration',
                        type: 'project',
                        duration: 240,
                        isRequired: true,
                    },
                ],
            },
        ];
        for (const programData of programs) {
            const existing = await this.programModel.findOne({ title: programData.title });
            if (existing) {
                this.logger.log(`Training program already exists: ${programData.title}`);
                continue;
            }
            const modules = programData.modules;
            delete programData.modules;
            const program = new this.programModel({
                ...programData,
                totalModules: modules.length,
                status: 'published',
                createdBy: 'admin',
            });
            await program.save();
            const createdModules = await Promise.all(modules.map(async (moduleData) => {
                const module = new this.moduleModel({
                    programId: program.id,
                    ...moduleData,
                });
                return module.save();
            }));
            program.modules = createdModules.map(m => m.id);
            await program.save();
            this.logger.log(`Training program created: ${programData.title}`);
        }
    }
};
exports.TrainingProgramsSeeder = TrainingProgramsSeeder;
exports.TrainingProgramsSeeder = TrainingProgramsSeeder = TrainingProgramsSeeder_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(training_program_schema_1.TrainingProgram.name)),
    __param(1, (0, mongoose_1.InjectModel)(training_module_schema_1.TrainingModule.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], TrainingProgramsSeeder);
