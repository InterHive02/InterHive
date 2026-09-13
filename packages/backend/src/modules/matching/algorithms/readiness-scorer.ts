import { Injectable } from '@nestjs/common';

@Injectable()
export class ReadinessScorer {
  calculateReadinessScore(profile: any): number {
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

  private calculateTechnicalScore(profile: any): number {
    const skills = profile.professionalInfo?.skills || [];
    if (!skills.length) return 0;

    let score = 0;
    const skillLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
    const levelWeights = { beginner: 25, intermediate: 50, advanced: 75, expert: 100 };

    for (const skill of skills) {
      const level = skill.level || 'beginner';
      score += levelWeights[level] || 25;
    }

    return Math.round(score / skills.length);
  }

  private calculateProjectScore(profile: any): number {
    const projects = profile.professionalInfo?.projects || [];
    if (!projects.length) return 0;

    let score = 0;
    for (const project of projects) {
      if (project.status === 'completed') score += 100;
      else if (project.status === 'in_progress') score += 50;
      else score += 25;
    }

    return Math.round(Math.min(score / projects.length, 100));
  }

  private calculateCommunicationScore(profile: any): number {
    let score = 50; // Base score

    // Check for communication-related skills
    const skills = profile.professionalInfo?.skills || [];
    const commSkills = skills.filter(s =>
      s.name.toLowerCase().includes('communication') ||
      s.name.toLowerCase().includes('presentation') ||
      s.name.toLowerCase().includes('writing')
    );

    if (commSkills.length > 0) score += 20;

    // Check for portfolio or blog
    if (profile.professionalInfo?.portfolio) score += 15;
    if (profile.professionalInfo?.linkedin) score += 15;

    return Math.min(score, 100);
  }

  private calculateProblemSolvingScore(profile: any): number {
    let score = 40;

    // Education contributes
    const education = profile.academicInfo?.currentEducation;
    if (education) {
      if (education.degree.toLowerCase().includes('engineering') ||
          education.degree.toLowerCase().includes('science')) {
        score += 20;
      }
    }

    // Skills contribute
    const skills = profile.professionalInfo?.skills || [];
    const problemSkills = skills.filter(s =>
      s.name.toLowerCase().includes('problem') ||
      s.name.toLowerCase().includes('debug') ||
      s.name.toLowerCase().includes('algorithm')
    );

    if (problemSkills.length > 0) score += 20;

    // Projects contribute
    const projects = profile.professionalInfo?.projects || [];
    const completedProjects = projects.filter(p => p.status === 'completed');
    if (completedProjects.length > 2) score += 20;

    return Math.min(score, 100);
  }

  private calculateIndustryWorkflowScore(profile: any): number {
    let score = 30;

    // Check for tools experience
    const skills = profile.professionalInfo?.skills || [];
    const toolSkills = skills.filter(s =>
      ['git', 'docker', 'aws', 'azure', 'jenkins', 'kubernetes'].includes(s.name.toLowerCase())
    );

    if (toolSkills.length > 0) score += 30;

    // Check for internship/professional experience
    const experience = profile.professionalInfo?.experience || [];
    if (experience.length > 0) {
      const professionalExp = experience.filter(e =>
        e.position.toLowerCase().includes('intern') ||
        e.position.toLowerCase().includes('junior') ||
        e.position.toLowerCase().includes('associate')
      );
      if (professionalExp.length > 0) score += 20;
    }

    // Check for certifications
    const certifications = profile.professionalInfo?.certifications || [];
    if (certifications.length > 0) score += 20;

    return Math.min(score, 100);
  }

  private calculateTeamCollaborationScore(profile: any): number {
    let score = 40;

    // Check for team projects
    const projects = profile.professionalInfo?.projects || [];
    const teamProjects = projects.filter(p => p.teamSize && p.teamSize > 1);
    if (teamProjects.length > 0) score += 20;

    // Check for collaboration skills
    const skills = profile.professionalInfo?.skills || [];
    const collabSkills = skills.filter(s =>
      s.name.toLowerCase().includes('team') ||
      s.name.toLowerCase().includes('collaboration') ||
      s.name.toLowerCase().includes('leadership')
    );

    if (collabSkills.length > 0) score += 20;

    // Check for extracurricular activities
    const extraCurricular = profile.professionalInfo?.extraCurricular || [];
    if (extraCurricular.length > 0) score += 20;

    return Math.min(score, 100);
  }
}