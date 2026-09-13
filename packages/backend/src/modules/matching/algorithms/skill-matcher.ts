import { Injectable } from '@nestjs/common';

@Injectable()
export class SkillMatcher {
  async calculateMatch(
    internSkills: any[],
    requirementSkills: any[],
  ): Promise<number> {
    if (!requirementSkills.length) return 100;
    if (!internSkills.length) return 0;

    let matchCount = 0;
    let totalWeight = 0;

    for (const reqSkill of requirementSkills) {
      const weight = this.getSkillWeight(reqSkill.level || 'intermediate');
      totalWeight += weight;

      const matched = internSkills.some(internSkill => {
        const isMatch = internSkill.id === reqSkill.id ||
          internSkill.name.toLowerCase() === reqSkill.name.toLowerCase();
        
        if (isMatch) {
          const internLevelWeight = this.getSkillWeight(internSkill.level || 'beginner');
          const ratio = Math.min(internLevelWeight / weight, 1);
          matchCount += ratio;
          return true;
        }
        return false;
      });

      if (!matched) {
        matchCount += 0;
      }
    }

    return Math.round((matchCount / totalWeight) * 100);
  }

  async calculateExperienceMatch(
    internExperience: any[],
    requirementExperience: { min: number; max?: number },
  ): Promise<number> {
    if (!requirementExperience.min) return 100;
    if (!internExperience.length) return 0;

    let totalExperience = 0;
    const currentDate = new Date();

    for (const exp of internExperience) {
      const startDate = new Date(exp.startDate);
      const endDate = exp.endDate ? new Date(exp.endDate) : currentDate;
      const years = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
      totalExperience += years;
    }

    const required = requirementExperience.min;
    const maxRequired = requirementExperience.max || required * 2;

    if (totalExperience >= required) {
      if (maxRequired && totalExperience <= maxRequired) {
        return 100;
      }
      // More experience than required (within reason)
      const bonus = Math.min((totalExperience - required) / required, 0.5);
      return Math.min(100, 100 + bonus * 50);
    }

    // Less than required
    const ratio = totalExperience / required;
    return Math.round(ratio * 100);
  }

  async calculatePreferenceMatch(
    internPreferences: any,
    requirement: any,
  ): Promise<number> {
    let score = 0;
    let totalWeight = 0;

    // Location match (30%)
    if (internPreferences.preferredLocation?.length) {
      totalWeight += 30;
      const locations = internPreferences.preferredLocation;
      if (locations.includes(requirement.location) || 
          locations.some(loc => requirement.location?.includes(loc))) {
        score += 30;
      }
    }

    // Work type match (30%)
    if (internPreferences.preferredWorkType?.length) {
      totalWeight += 30;
      if (internPreferences.preferredWorkType.includes(requirement.workType)) {
        score += 30;
      }
    }

    // Domain match (40%)
    if (internPreferences.preferredDomains?.length && requirement.category) {
      totalWeight += 40;
      const domains = internPreferences.preferredDomains;
      const matched = domains.some(domain => 
        requirement.category?.some(cat => 
          cat.toLowerCase().includes(domain.toLowerCase()) ||
          domain.toLowerCase().includes(cat.toLowerCase())
        )
      );
      if (matched) score += 40;
    }

    if (totalWeight === 0) return 50;
    return Math.round((score / totalWeight) * 100);
  }

  private getSkillWeight(level: string): number {
    const weights = {
      'beginner': 1,
      'intermediate': 2,
      'advanced': 3,
      'expert': 4,
    };
    return weights[level] || 1;
  }
}