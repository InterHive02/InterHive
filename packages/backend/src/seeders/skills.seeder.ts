import { Injectable, Logger } from '@nestjs/common';
import { SKILL_DEFINITIONS } from '@interhive/shared';

@Injectable()
export class SkillsSeeder {
  private readonly logger = new Logger(SkillsSeeder.name);

  async seed() {
    this.logger.log('Seeding skills...');

    const skills: any[] = Object.values(SKILL_DEFINITIONS);
    this.logger.log(`Total skills seeded: ${skills.length}`);

    // Skills are stored in the shared package, no database seeding needed
    // This seeder just logs the available skills for reference

    // Group by category
    const grouped: Record<string, string[]> = skills.reduce((acc: any, skill: any) => {
      const category = skill.category;
      if (!acc[category]) acc[category] = [];
      acc[category].push(skill.name);
      return acc;
    }, {});

    this.logger.log('Skills by category:');
    for (const [category, names] of Object.entries(grouped)) {
      this.logger.log(`  ${category}: ${(names as string[]).join(', ')}`);
    }

    // Could also seed to a database if needed
    // await this.skillModel.insertMany(skills);

    return skills;
  }
}