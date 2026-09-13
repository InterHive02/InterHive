"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('mail', () => ({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
    },
    from: {
        name: process.env.MAIL_FROM_NAME || 'InterHive Team',
        email: process.env.MAIL_FROM_EMAIL || 'noreply@interhive.in',
    },
    templates: {
        welcome: process.env.MAIL_TEMPLATE_WELCOME || 'welcome',
        resetPassword: process.env.MAIL_TEMPLATE_RESET_PASSWORD || 'reset-password',
        assessmentInvite: process.env.MAIL_TEMPLATE_ASSESSMENT_INVITE || 'assessment-invite',
        interviewSchedule: process.env.MAIL_TEMPLATE_INTERVIEW_SCHEDULE || 'interview-schedule',
        offerLetter: process.env.MAIL_TEMPLATE_OFFER_LETTER || 'offer-letter',
        projectAssignment: process.env.MAIL_TEMPLATE_PROJECT_ASSIGNMENT || 'project-assignment',
    },
}));
