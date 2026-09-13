"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SkillsSeeder_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillsSeeder = void 0;
const common_1 = require("@nestjs/common");
const shared_1 = require("@interhive/shared");
let SkillsSeeder = SkillsSeeder_1 = class SkillsSeeder {
    constructor() {
        this.logger = new common_1.Logger(SkillsSeeder_1.name);
    }
    async seed() {
        this.logger.log('Seeding skills...');
        const skills = Object.values(shared_1.SKILL_DEFINITIONS);
        this.logger.log(`Total skills seeded: ${skills.length}`);
        const grouped = skills.reduce((acc, skill) => {
            const category = skill.category;
            if (!acc[category])
                acc[category] = [];
            acc[category].push(skill.name);
            return acc;
        }, {});
        this.logger.log('Skills by category:');
        for (const [category, names] of Object.entries(grouped)) {
            this.logger.log(`  ${category}: ${names.join(', ')}`);
        }
        return skills;
    }
};
exports.SkillsSeeder = SkillsSeeder;
exports.SkillsSeeder = SkillsSeeder = SkillsSeeder_1 = __decorate([
    (0, common_1.Injectable)()
], SkillsSeeder);
