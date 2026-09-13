"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadinessScorer = void 0;
const common_1 = require("@nestjs/common");
let ReadinessScorer = class ReadinessScorer {
    calculateReadinessScore(profile) {
        let score = 0;
        const weights = {
            technicalSkills: 30,
            projects: 20,
            communication: 15,
            problemSolving: 15,
            industryWorkflow: 10,
            teamCollaboration: 10,
        };
        const breakdown = {
            technicalSkills: this.calculateTechnicalScore(profile),
            projects: this.calculateProjectScore(profile),
            communication: this.calculateCommunicationScore(profile),
            problemSolving: this.calculateProblemSolvingScore(profile),
            industryWorkflow: this.calculateIndustryWorkflowScore(profile),
            teamCollaboration: this.calculateTeamCollaborationScore(profile),
        };
        for (const [key, value] of Object.entries(breakdown)) {
            score += value * (weights[key] / 100);
        }
        return Math.round(Math.min(score, 100));
    }
    calculateTechnicalScore(profile) {
        const skills = profile.professionalInfo?.skills || [];
        if (!skills.length)
            return 0;
        let score = 0;
        const skillLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
        const levelWeights = { beginner: 25, intermediate: 50, advanced: 75, expert: 100 };
        for (const skill of skills) {
            const level = skill.level || 'beginner';
            score += levelWeights[level] || 25;
        }
        return Math.round(score / skills.length);
    }
    calculateProjectScore(profile) {
        const projects = profile.professionalInfo?.projects || [];
        if (!projects.length)
            return 0;
        let score = 0;
        for (const project of projects) {
            if (project.status === 'completed')
                score += 100;
            else if (project.status === 'in_progress')
                score += 50;
            else
                score += 25;
        }
        return Math.round(Math.min(score / projects.length, 100));
    }
    calculateCommunicationScore(profile) {
        let score = 50;
        const skills = profile.professionalInfo?.skills || [];
        const commSkills = skills.filter(s => s.name.toLowerCase().includes('communication') ||
            s.name.toLowerCase().includes('presentation') ||
            s.name.toLowerCase().includes('writing'));
        if (commSkills.length > 0)
            score += 20;
        if (profile.professionalInfo?.portfolio)
            score += 15;
        if (profile.professionalInfo?.linkedin)
            score += 15;
        return Math.min(score, 100);
    }
    calculateProblemSolvingScore(profile) {
        let score = 40;
        const education = profile.academicInfo?.currentEducation;
        if (education) {
            if (education.degree.toLowerCase().includes('engineering') ||
                education.degree.toLowerCase().includes('science')) {
                score += 20;
            }
        }
        const skills = profile.professionalInfo?.skills || [];
        const problemSkills = skills.filter(s => s.name.toLowerCase().includes('problem') ||
            s.name.toLowerCase().includes('debug') ||
            s.name.toLowerCase().includes('algorithm'));
        if (problemSkills.length > 0)
            score += 20;
        const projects = profile.professionalInfo?.projects || [];
        const completedProjects = projects.filter(p => p.status === 'completed');
        if (completedProjects.length > 2)
            score += 20;
        return Math.min(score, 100);
    }
    calculateIndustryWorkflowScore(profile) {
        let score = 30;
        const skills = profile.professionalInfo?.skills || [];
        const toolSkills = skills.filter(s => ['git', 'docker', 'aws', 'azure', 'jenkins', 'kubernetes'].includes(s.name.toLowerCase()));
        if (toolSkills.length > 0)
            score += 30;
        const experience = profile.professionalInfo?.experience || [];
        if (experience.length > 0) {
            const professionalExp = experience.filter(e => e.position.toLowerCase().includes('intern') ||
                e.position.toLowerCase().includes('junior') ||
                e.position.toLowerCase().includes('associate'));
            if (professionalExp.length > 0)
                score += 20;
        }
        const certifications = profile.professionalInfo?.certifications || [];
        if (certifications.length > 0)
            score += 20;
        return Math.min(score, 100);
    }
    calculateTeamCollaborationScore(profile) {
        let score = 40;
        const projects = profile.professionalInfo?.projects || [];
        const teamProjects = projects.filter(p => p.teamSize && p.teamSize > 1);
        if (teamProjects.length > 0)
            score += 20;
        const skills = profile.professionalInfo?.skills || [];
        const collabSkills = skills.filter(s => s.name.toLowerCase().includes('team') ||
            s.name.toLowerCase().includes('collaboration') ||
            s.name.toLowerCase().includes('leadership'));
        if (collabSkills.length > 0)
            score += 20;
        const extraCurricular = profile.professionalInfo?.extraCurricular || [];
        if (extraCurricular.length > 0)
            score += 20;
        return Math.min(score, 100);
    }
};
exports.ReadinessScorer = ReadinessScorer;
exports.ReadinessScorer = ReadinessScorer = __decorate([
    (0, common_1.Injectable)()
], ReadinessScorer);
