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
var ReadinessAnalyticsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadinessAnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const intern_readiness_schema_1 = require("../../interns/schemas/intern-readiness.schema");
const intern_profile_schema_1 = require("../../interns/schemas/intern-profile.schema");
let ReadinessAnalyticsService = ReadinessAnalyticsService_1 = class ReadinessAnalyticsService {
    constructor(readinessModel, profileModel) {
        this.readinessModel = readinessModel;
        this.profileModel = profileModel;
        this.logger = new common_1.Logger(ReadinessAnalyticsService_1.name);
    }
    async getReadinessAnalytics(query) {
        const { department, startDate, endDate } = query;
        const match = {};
        if (startDate && endDate) {
            match.lastUpdated = { $gte: startDate, $lte: endDate };
        }
        const scores = await this.readinessModel.aggregate([
            { $match: match },
            {
                $lookup: {
                    from: 'internprofiles',
                    localField: 'userId',
                    foreignField: 'userId',
                    as: 'profile',
                },
            },
            { $unwind: { path: '$profile', preserveNullAndEmptyArrays: true } },
            ...(department ? [{ $match: { 'profile.academicInfo.department': department } }] : []),
        ]);
        const overallScores = scores.map(s => s.overall);
        const averageOverall = overallScores.length > 0
            ? Math.round(overallScores.reduce((a, b) => a + b, 0) / overallScores.length)
            : 0;
        const distribution = [
            { range: '0-20', count: 0 },
            { range: '21-40', count: 0 },
            { range: '41-60', count: 0 },
            { range: '61-80', count: 0 },
            { range: '81-100', count: 0 },
        ];
        for (const score of overallScores) {
            if (score <= 20)
                distribution[0].count++;
            else if (score <= 40)
                distribution[1].count++;
            else if (score <= 60)
                distribution[2].count++;
            else if (score <= 80)
                distribution[3].count++;
            else
                distribution[4].count++;
        }
        const byDepartment = scores.reduce((acc, s) => {
            const dept = s.profile?.academicInfo?.department || 'Unknown';
            if (!acc[dept])
                acc[dept] = { total: 0, count: 0 };
            acc[dept].total += s.overall;
            acc[dept].count++;
            return acc;
        }, {});
        const departmentStats = Object.entries(byDepartment).map(([dept, data]) => ({
            department: dept,
            average: Math.round(data.total / data.count),
            count: data.count,
        }));
        const skillMap = {};
        for (const profile of await this.profileModel.find()) {
            for (const skill of profile.professionalInfo?.skills || []) {
                if (!skillMap[skill.name]) {
                    skillMap[skill.name] = { count: 0, totalLevel: 0 };
                }
                skillMap[skill.name].count++;
                const levelWeights = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 };
                skillMap[skill.name].totalLevel += levelWeights[skill.level] || 0;
            }
        }
        const topSkills = Object.entries(skillMap)
            .map(([name, data]) => ({
            skill: name,
            count: data.count,
            averageLevel: this.getLevelFromWeight(data.totalLevel / data.count),
        }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
        return {
            overallAverage: averageOverall,
            byDepartment: departmentStats,
            distribution,
            topSkills,
            trends: await this.getReadinessTrends(),
        };
    }
    async getInternReadiness(internId) {
        const readiness = await this.readinessModel.findOne({ userId: internId });
        if (!readiness) {
            return {
                overall: 0,
                breakdown: {
                    technicalSkills: 0,
                    projects: 0,
                    communication: 0,
                    problemSolving: 0,
                    industryWorkflow: 0,
                    teamCollaboration: 0,
                    leadership: 0,
                    adaptability: 0,
                },
                history: [],
                recommendations: [],
            };
        }
        const recommendations = [];
        const breakdown = readiness.breakdown;
        const categories = Object.entries(breakdown);
        for (const [category, score] of categories) {
            if (score < 60) {
                recommendations.push({
                    category,
                    currentScore: score,
                    recommendation: this.getRecommendationForCategory(category, score),
                });
            }
        }
        return {
            overall: readiness.overall,
            breakdown: readiness.breakdown,
            history: readiness.history.slice(-12),
            recommendations,
            lastUpdated: readiness.lastUpdated,
        };
    }
    async exportReadinessData() {
        const readinessData = await this.readinessModel.find().populate('userId', 'firstName lastName email');
        return readinessData;
    }
    async getReadinessTrends() {
        const trends = [];
        const months = 12;
        for (let i = months - 1; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
            const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            const scores = await this.readinessModel.find({
                lastUpdated: { $gte: monthStart, $lte: monthEnd },
            });
            const average = scores.length > 0
                ? Math.round(scores.reduce((a, b) => a + b.overall, 0) / scores.length)
                : 0;
            trends.push({
                date: date,
                average,
                total: scores.length,
            });
        }
        return trends;
    }
    getLevelFromWeight(weight) {
        if (weight >= 3.5)
            return 'expert';
        if (weight >= 2.5)
            return 'advanced';
        if (weight >= 1.5)
            return 'intermediate';
        return 'beginner';
    }
    getRecommendationForCategory(category, score) {
        const recommendations = {
            technicalSkills: 'Focus on building more projects and practicing coding challenges. Consider taking advanced courses.',
            projects: 'Start working on real-world projects. Collaborate with peers on open-source contributions.',
            communication: 'Practice explaining technical concepts clearly. Join speaking clubs or discussion forums.',
            problemSolving: 'Solve more algorithmic problems. Practice breaking down complex problems into smaller parts.',
            industryWorkflow: 'Learn about Agile, DevOps, and CI/CD practices. Contribute to team projects.',
            teamCollaboration: 'Join hackathons and team projects. Practice code reviews and pair programming.',
            leadership: 'Take initiative in group projects. Mentor junior interns and lead small teams.',
            adaptability: 'Learn new technologies regularly. Participate in workshops and tech talks.',
        };
        return recommendations[category] || 'Focus on improving this area through practice and learning.';
    }
};
exports.ReadinessAnalyticsService = ReadinessAnalyticsService;
exports.ReadinessAnalyticsService = ReadinessAnalyticsService = ReadinessAnalyticsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(intern_readiness_schema_1.InternReadiness.name)),
    __param(1, (0, mongoose_1.InjectModel)(intern_profile_schema_1.InternProfile.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], ReadinessAnalyticsService);
