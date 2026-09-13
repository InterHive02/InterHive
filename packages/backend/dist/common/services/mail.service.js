"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = __importStar(require("nodemailer"));
const handlebars = __importStar(require("handlebars"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let MailService = MailService_1 = class MailService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(MailService_1.name);
        this.templates = new Map();
        this.initializeTransporter();
        this.loadTemplates();
    }
    initializeTransporter() {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('mail.host'),
            port: this.configService.get('mail.port'),
            secure: this.configService.get('mail.secure'),
            auth: {
                user: this.configService.get('mail.auth.user'),
                pass: this.configService.get('mail.auth.pass'),
            },
            pool: true,
            maxConnections: 5,
            maxMessages: 100,
            rateDelta: 1000,
            rateLimit: 5,
        });
        this.transporter.verify((error) => {
            if (error) {
                this.logger.warn(`Mail transporter warning: ${error.message} (Email notifications disabled until valid SMTP credentials are set)`);
            }
            else {
                this.logger.log('Mail transporter ready');
            }
        });
    }
    loadTemplates() {
        const templateDir = path.join(__dirname, '../../../templates/email');
        try {
            const files = fs.readdirSync(templateDir);
            for (const file of files) {
                if (file.endsWith('.hbs')) {
                    const templateName = path.basename(file, '.hbs');
                    const templateContent = fs.readFileSync(path.join(templateDir, file), 'utf8');
                    this.templates.set(templateName, handlebars.compile(templateContent));
                }
            }
            this.logger.log(`Loaded ${this.templates.size} email templates`);
        }
        catch (error) {
            this.logger.warn('Email templates directory not found, using inline templates');
        }
    }
    async sendEmail(to, subject, html, from) {
        try {
            const mailOptions = {
                from: from || this.configService.get('mail.from.email') || 'interhive.info@gmail.com',
                to: Array.isArray(to) ? to.join(', ') : to,
                subject,
                html,
            };
            const info = await this.transporter.sendMail(mailOptions);
            this.logger.log(`Email sent to ${to}: ${info.messageId}`);
            return info;
        }
        catch (error) {
            this.logger.error(`Failed to send email to ${to}: ${error.message}`);
            return null;
        }
    }
    async sendTemplateEmail(to, templateName, context, subject) {
        let template = this.templates.get(templateName);
        if (!template) {
            template = this.getInlineTemplate(templateName);
        }
        const html = template(context);
        const defaultSubject = this.getDefaultSubject(templateName);
        return this.sendEmail(to, subject || defaultSubject, html);
    }
    getInlineTemplate(templateName) {
        const templates = {
            welcome: `
        <h1>Welcome to InterHive, {{name}}!</h1>
        <p>We're excited to have you on board. Start your journey from intern to industry-ready professional.</p>
        <p>Get started by completing your profile and taking your first assessment.</p>
        <a href="{{link}}" style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
          Get Started
        </a>
        <p>If you have any questions, feel free to contact us at interhive.info@gmail.com</p>
      `,
            'verify-email': `
        <h1>Verify Your Email Address</h1>
        <p>Hi {{name}},</p>
        <p>Thank you for registering on InterHive. Please click the link below to verify your email address and activate your account:</p>
        <div style="margin: 24px 0;">
          <a href="{{link}}" style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
            Verify Email
          </a>
        </div>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account, you can safely ignore this email.</p>
      `,
            'reset-password': `
        <h1>Reset Your Password</h1>
        <p>Click the link below to reset your password. This link will expire in 1 hour.</p>
        <a href="{{link}}" style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
          Reset Password
        </a>
        <p>If you didn't request this, please ignore this email.</p>
      `,
            'assessment-invite': `
        <h1>Assessment Invitation</h1>
        <p>You've been invited to take an assessment: {{assessmentName}}</p>
        <p>Duration: {{duration}} minutes</p>
        <a href="{{link}}" style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
          Start Assessment
        </a>
      `,
            'interview-schedule': `
        <h1>Interview Scheduled</h1>
        <p>Your interview for {{position}} at {{companyName}} has been scheduled.</p>
        <p>Date: {{date}}</p>
        <p>Type: {{type}}</p>
        {{#if meetingLink}}<p>Meeting Link: <a href="{{meetingLink}}">{{meetingLink}}</a></p>{{/if}}
      `,
            offer: `
        <h1>Offer Letter</h1>
        <p>Congratulations! You've received an offer from {{companyName}}.</p>
        <p>Position: {{position}}</p>
        <p>Stipend: {{stipend}}</p>
        <p>Start Date: {{startDate}}</p>
        <a href="{{link}}" style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
          View Offer
        </a>
      `,
        };
        const templateStr = templates[templateName] || templates.welcome;
        return handlebars.compile(templateStr);
    }
    getDefaultSubject(templateName) {
        const subjects = {
            welcome: 'Welcome to InterHive!',
            'verify-email': 'Verify Your Email Address',
            'reset-password': 'Reset Your Password',
            'assessment-invite': 'You\'ve Been Invited to Take an Assessment',
            'interview-schedule': 'Interview Scheduled',
            offer: 'Offer Letter',
        };
        return subjects[templateName] || 'InterHive Notification';
    }
    async sendWelcomeEmail(to, name, link) {
        return this.sendTemplateEmail(to, 'welcome', {
            name,
            link: link || `${this.configService.get('app.url')}/dashboard`,
        });
    }
    async sendVerificationEmail(to, name, token) {
        const link = `${this.configService.get('app.url')}/verify-email?token=${token}`;
        return this.sendTemplateEmail(to, 'verify-email', { name, link });
    }
    async sendPasswordResetEmail(to, name, token) {
        const link = `${this.configService.get('app.url')}/reset-password?token=${token}`;
        return this.sendTemplateEmail(to, 'reset-password', { name, link });
    }
    async sendAssessmentInviteEmail(to, assessmentName, duration, link) {
        return this.sendTemplateEmail(to, 'assessment-invite', {
            assessmentName,
            duration,
            link,
        });
    }
    async sendInterviewScheduledEmail(to, companyName, position, date, type, meetingLink) {
        return this.sendTemplateEmail(to, 'interview-schedule', {
            companyName,
            position,
            date,
            type,
            meetingLink,
        });
    }
    async sendOfferEmail(to, companyName, position, stipend, startDate, link) {
        return this.sendTemplateEmail(to, 'offer', {
            companyName: companyName || '',
            position: position || '',
            stipend: stipend || '',
            startDate: startDate || '',
            link: link || '#',
        });
    }
    async sendApplicationConfirmation(to, ...rest) {
        try {
            return this.sendTemplateEmail(String(to), 'welcome', { name: 'Applicant', link: '#' });
        }
        catch {
            return null;
        }
    }
    async sendOnboardingEmail(to, ...rest) {
        try {
            return this.sendTemplateEmail(String(to), 'welcome', { name: 'Intern', link: '#' });
        }
        catch {
            return null;
        }
    }
    async sendMatchAcceptedEmail(to, ...rest) {
        try {
            return this.sendTemplateEmail(String(to), 'welcome', { name: 'User', link: '#' });
        }
        catch {
            return null;
        }
    }
    async sendHiringConfirmationEmail(to, ...rest) {
        try {
            return this.sendTemplateEmail(String(to), 'welcome', { name: 'User', link: '#' });
        }
        catch {
            return null;
        }
    }
    async sendAssessmentStartedEmail(to, ...rest) {
        try {
            return this.sendTemplateEmail(String(to), 'welcome', { name: 'Intern', link: '#' });
        }
        catch {
            return null;
        }
    }
    async sendAssessmentCompletedEmail(to, ...rest) {
        try {
            return this.sendTemplateEmail(String(to), 'welcome', { name: 'Intern', link: '#' });
        }
        catch {
            return null;
        }
    }
    async sendNotificationEmail(to, title, message, ...rest) {
        try {
            return this.sendTemplateEmail(to, 'welcome', { name: 'User', link: '#' });
        }
        catch {
            return null;
        }
    }
    async sendProjectAssignmentEmail(to, projectTitle, ...rest) {
        try {
            return this.sendTemplateEmail(to, 'welcome', { name: 'User', link: '#' });
        }
        catch {
            return null;
        }
    }
    async sendTrainingEnrollmentEmail(to, programTitle, ...rest) {
        try {
            return this.sendTemplateEmail(to, 'welcome', { name: 'User', link: '#' });
        }
        catch {
            return null;
        }
    }
    async sendTrainingCompletionEmail(to, programTitle, ...rest) {
        try {
            return this.sendTemplateEmail(to, 'welcome', { name: 'User', link: '#' });
        }
        catch {
            return null;
        }
    }
    async sendOtpEmail(to, otpCode) {
        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 28px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <h2 style="color: #2563eb; margin-top: 0; font-size: 22px;">🔑 Your InterHive Verification Code</h2>
        <p style="font-size: 14px; color: #475569;">Use the 6-digit verification code below to log in or verify your Gmail address on InterHive:</p>
        
        <div style="margin: 24px 0; text-align: center;">
          <span style="display: inline-block; background-color: #f1f5f9; border: 2px dashed #2563eb; color: #1e293b; font-size: 32px; font-weight: 900; letter-spacing: 8px; padding: 14px 28px; border-radius: 12px;">
            ${otpCode}
          </span>
        </div>

        <p style="font-size: 13px; color: #64748b;">This code will expire in <strong>10 minutes</strong>. If you did not request this verification code, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 11px; color: #94a3b8; text-align: center;">InterHive Inc. • From Intern to Industry</p>
      </div>
    `;
        return this.sendEmail(to, `🔑 ${otpCode} is your InterHive verification code`, html);
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailService);
