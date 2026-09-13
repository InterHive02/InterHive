import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InternReadiness, InternReadinessDocument } from '../../interns/schemas/intern-readiness.schema';
import { InternProfile, InternProfileDocument } from '../../interns/schemas/intern-profile.schema';
import { AnalyticsQueryDto } from '../dto/analytics-query.dto';

@Injectable()
export class ReadinessAnalyticsService {
  private readonly logger = new Logger(ReadinessAnalyticsService.name);

  constructor(
    @InjectModel(InternReadiness.name) private readinessModel: Model<InternReadinessDocument>,
    @InjectModel(InternProfile.name) private profileModel: Model<InternProfileDocument>,
  ) {}

  async getReadinessAnalytics(query: AnalyticsQueryDto) {
    const { department, startDate, endDate } = query;

    // Build query
    const match: any = {};
    if (startDate && endDate) {
      match.lastUpdated = { $gte: startDate, $lte: endDate };
    }

    // Get readiness scores
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

    // Calculate statistics
    const overallScores = scores.map(s => s.overall);
    const averageOverall = overallScores.length > 0 
      ? Math.round(overallScores.reduce((a, b) => a + b, 0) / overallScores.length) 
      : 0;

    // Distribution
    const distribution = [
      { range: '0-20', count: 0 },
      { range: '21-40', count: 0 },
      { range: '41-60', count: 0 },
      { range: '61-80', count: 0 },
      { range: '81-100', count: 0 },
    ];

    for (const score of overallScores) {
      if (score <= 20) distribution[0].count++;
      else if (score <= 40) distribution[1].count++;
      else if (score <= 60) distribution[2].count++;
      else if (score <= 80) distribution[3].count++;
      else distribution[4].count++;
    }

    // By department
    const byDepartment = scores.reduce((acc, s) => {
      const dept = s.profile?.academicInfo?.department || 'Unknown';
      if (!acc[dept]) acc[dept] = { total: 0, count: 0 };
      acc[dept].total += s.overall;
      acc[dept].count++;
      return acc;
    }, {});

    const departmentStats = Object.entries(byDepartment).map(([dept, data]: [string, any]) => ({
      department: dept,
      average: Math.round(data.total / data.count),
      count: data.count,
    }));

    // Top skills
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
      .map(([name, data]: [string, any]) => ({
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

  async getInternReadiness(internId: string) {
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

    // Generate recommendations based on breakdown
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

  private async getReadinessTrends() {
    // Get last 12 months of data
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

  private getLevelFromWeight(weight: number): string {
    if (weight >= 3.5) return 'expert';
    if (weight >= 2.5) return 'advanced';
    if (weight >= 1.5) return 'intermediate';
    return 'beginner';
  }

  private getRecommendationForCategory(category: string, score: number): string {
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
}