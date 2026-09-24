import { registerAs } from '@nestjs/config';

export interface MailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: {
    name: string;
    email: string;
  };
  templates: {
    welcome: string;
    resetPassword: string;
    assessmentInvite: string;
    interviewSchedule: string;
    offerLetter: string;
    projectAssignment: string;
  };
}

export default registerAs('mail', (): MailConfig => ({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '465', 10),
  secure: process.env.SMTP_SECURE === 'true' || true,
  auth: {
    user: process.env.SMTP_USER || 'interhive.info@gmail.com',
    pass: process.env.SMTP_PASS || 'jyrt htfk ovif pzkw',
  },
  from: {
    name: process.env.MAIL_FROM_NAME || 'InterHive Team',
    email: process.env.MAIL_FROM_EMAIL || 'interhive.info@gmail.com',
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