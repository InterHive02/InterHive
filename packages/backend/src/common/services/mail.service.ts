import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MailService {
  private transporter: Transporter;
  private readonly logger = new Logger(MailService.name);
  private templates: Map<string, any> = new Map();

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
    this.loadTemplates();
  }

  private initializeTransporter() {
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
      } else {
        this.logger.log('Mail transporter ready');
      }
    });
  }

  private loadTemplates() {
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
    } catch (error) {
      this.logger.warn('Email templates directory not found, using inline templates');
    }
  }

  async sendEmail(to: string | string[], subject: string, html: string, from?: string) {
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
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${error.message}`);
      return null;
    }
  }

  async sendTemplateEmail(
    to: string | string[],
    templateName: string,
    context: any,
    subject?: string,
  ) {
    let template = this.templates.get(templateName);
    if (!template) {
      // Use inline template
      template = this.getInlineTemplate(templateName);
    }

    const html = template(context);
    const defaultSubject = this.getDefaultSubject(templateName);
    return this.sendEmail(to, subject || defaultSubject, html);
  }

  private getInlineTemplate(templateName: string): any {
    const templates: Record<string, string> = {
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

  private getDefaultSubject(templateName: string): string {
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

  // Convenience methods
  async sendWelcomeEmail(to: string, name: string, link?: string) {
    return this.sendTemplateEmail(to, 'welcome', {
      name,
      link: link || `${this.configService.get('app.url')}/dashboard`,
    });
  }

  async sendVerificationEmail(to: string, name: string, token: string) {
    const link = `${this.configService.get('app.url')}/verify-email?token=${token}`;
    return this.sendTemplateEmail(to, 'verify-email', { name, link });
  }

  async sendPasswordResetEmail(to: string, name: string, token: string) {
    const link = `${this.configService.get('app.url')}/reset-password?token=${token}`;
    return this.sendTemplateEmail(to, 'reset-password', { name, link });
  }

  async sendAssessmentInviteEmail(to: string, assessmentName: string, duration: number, link: string) {
    return this.sendTemplateEmail(to, 'assessment-invite', {
      assessmentName,
      duration,
      link,
    });
  }

  async sendInterviewScheduledEmail(
    to: string,
    companyName: string,
    position: string,
    date: string,
    type: string,
    meetingLink?: string,
  ) {
    return this.sendTemplateEmail(to, 'interview-schedule', {
      companyName,
      position,
      date,
      type,
      meetingLink,
    });
  }

  async sendOfferEmail(to: string, companyName?: string, position?: string, stipend?: string, startDate?: string, link?: string) {
    return this.sendTemplateEmail(to, 'offer', {
      companyName: companyName || '',
      position: position || '',
      stipend: stipend || '',
      startDate: startDate || '',
      link: link || '#',
    });
  }

  async sendApplicationConfirmation(to: any, ...rest: any[]) {
    try {
      return this.sendTemplateEmail(String(to), 'welcome', { name: 'Applicant', link: '#' });
    } catch {
      return null;
    }
  }

  async sendOnboardingEmail(to: any, ...rest: any[]) {
    try {
      return this.sendTemplateEmail(String(to), 'welcome', { name: 'Intern', link: '#' });
    } catch {
      return null;
    }
  }

  async sendMatchAcceptedEmail(to: any, ...rest: any[]) {
    try {
      return this.sendTemplateEmail(String(to), 'welcome', { name: 'User', link: '#' });
    } catch {
      return null;
    }
  }

  async sendHiringConfirmationEmail(to: any, ...rest: any[]) {
    try {
      return this.sendTemplateEmail(String(to), 'welcome', { name: 'User', link: '#' });
    } catch {
      return null;
    }
  }

  async sendAssessmentStartedEmail(to: any, ...rest: any[]) {
    try {
      return this.sendTemplateEmail(String(to), 'welcome', { name: 'Intern', link: '#' });
    } catch {
      return null;
    }
  }

  async sendAssessmentCompletedEmail(to: any, ...rest: any[]) {
    try {
      return this.sendTemplateEmail(String(to), 'welcome', { name: 'Intern', link: '#' });
    } catch {
      return null;
    }
  }

  async sendNotificationEmail(to: string, title?: string, message?: string, ...rest: any[]) {
    try {
      return this.sendTemplateEmail(to, 'welcome', { name: 'User', link: '#' });
    } catch {
      return null;
    }
  }

  async sendProjectAssignmentEmail(to: string, projectTitle?: string, ...rest: any[]) {
    try {
      return this.sendTemplateEmail(to, 'welcome', { name: 'User', link: '#' });
    } catch {
      return null;
    }
  }

  async sendTrainingEnrollmentEmail(to: string, programTitle?: string, ...rest: any[]) {
    try {
      return this.sendTemplateEmail(to, 'welcome', { name: 'User', link: '#' });
    } catch {
      return null;
    }
  }

  async sendTrainingCompletionEmail(to: string, programTitle?: string, ...rest: any[]) {
    try {
      return this.sendTemplateEmail(to, 'welcome', { name: 'User', link: '#' });
    } catch {
      return null;
    }
  }

  async sendOtpEmail(to: string, otpCode: string) {
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
}