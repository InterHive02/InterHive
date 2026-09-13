import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TrainingProgram, TrainingProgramDocument } from '../modules/training/schemas/training-program.schema';
import { TrainingModule, TrainingModuleDocument } from '../modules/training/schemas/training-module.schema';

@Injectable()
export class TrainingProgramsSeeder {
  private readonly logger = new Logger(TrainingProgramsSeeder.name);

  constructor(
    @InjectModel(TrainingProgram.name) private programModel: Model<TrainingProgramDocument>,
    @InjectModel(TrainingModule.name) private moduleModel: Model<TrainingModuleDocument>,
  ) {}

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
        createdBy: 'admin', // Should be replaced with actual admin ID
      });

      await program.save();

      const createdModules = await Promise.all(
        modules.map(async (moduleData) => {
          const module = new this.moduleModel({
            programId: program.id,
            ...moduleData,
          });
          return module.save();
        }),
      );

      program.modules = createdModules.map(m => m.id);
      await program.save();

      this.logger.log(`Training program created: ${programData.title}`);
    }
  }
}