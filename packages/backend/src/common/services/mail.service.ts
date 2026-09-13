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
      const fromName = this.configService.get('mail.from.name') || 'InterHive Team';
      const fromEmail = this.configService.get('mail.from.email') || 'interhive.info@gmail.com';
      const defaultFrom = `"${fromName}" <${fromEmail}>`;

      const mailOptions = {
        from: from || defaultFrom,
        replyTo: fromEmail,
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

  async sendCredentialDeliveryEmail(data: {
    to: string;
    fullName: string;
    employeeId: string;
    loginEmail: string;
    temporaryPassword: string;
    loginUrl: string;
  }) {
    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #4f46e5; margin: 0; font-size: 26px; font-weight: 800;">Welcome to InterHive 🎉</h1>
          <p style="color: #64748b; font-size: 14px; margin-top: 6px;">From Intern to Industry Readiness</p>
        </div>

        <p style="font-size: 15px; color: #1e293b; line-height: 1.6;">
          Dear <strong>${data.fullName}</strong>,
        </p>

        <p style="font-size: 15px; color: #334155; line-height: 1.6;">
          Congratulations! Your application has been officially accepted by the HR team. Your internal platform account has now been created.
        </p>

        <div style="background: linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%); border: 1px solid #cbd5e1; border-radius: 14px; padding: 20px; margin: 24px 0;">
          <h3 style="margin-top: 0; color: #1e293b; font-size: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">🔐 Your Official Login Credentials</h3>
          
          <table style="width: 100%; font-size: 14px; border-collapse: collapse; margin-top: 10px;">
            <tr>
              <td style="padding: 6px 0; color: #64748b; width: 140px;"><strong>Internal ID:</strong></td>
              <td style="padding: 6px 0; color: #0f172a; font-family: monospace; font-size: 15px;"><strong>${data.employeeId}</strong></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;"><strong>Login Email:</strong></td>
              <td style="padding: 6px 0; color: #2563eb; font-family: monospace;"><strong>${data.loginEmail}</strong></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;"><strong>Temporary Password:</strong></td>
              <td style="padding: 6px 0; color: #dc2626; font-family: monospace; font-size: 16px;"><strong>${data.temporaryPassword}</strong></td>
            </tr>
          </table>
        </div>

        <p style="font-size: 13px; color: #dc2626; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 12px;">
          ⚠️ <strong>Security Notice:</strong> You will be required to change this temporary password immediately upon your first login.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.loginUrl}" style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff; text-decoration: none; font-weight: bold; font-size: 15px; padding: 14px 32px; border-radius: 10px; display: inline-block; box-shadow: 0 4px 10px rgba(79,70,229,0.3);">
            Access Intern Portal →
          </a>
        </div>

        <div style="background-color: #f8fafc; border-radius: 10px; padding: 16px; margin-top: 24px; font-size: 13px; color: #475569;">
          <h4 style="margin: 0 0 8px 0; color: #1e293b;">Next Steps for Onboarding:</h4>
          <ol style="margin: 0; padding-left: 20px; line-height: 1.6;">
            <li>Log in using the temporary credentials above.</li>
            <li>Set your secure personal password.</li>
            <li>Review your assigned department, mentor details, and orientation tasks in your Intern Dashboard.</li>
          </ol>
        </div>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 28px 0;" />
        <p style="font-size: 12px; color: #94a3b8; text-align: center;">
          InterHive Inc. • Industry Readiness & Talent Connect Platform<br />
          If you have questions, please reach out to <a href="mailto:interhive.info@gmail.com" style="color: #6366f1;">interhive.info@gmail.com</a>.
        </p>
      </div>
    `;

    return this.sendEmail(
      data.to,
      `🎉 Welcome to InterHive! Your Intern Login Credentials & Onboarding Details`,
      html,
    );
  }

  async sendApplicationReceivedEmail(to: string, fullName: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 28px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <h2 style="color: #4f46e5; margin-top: 0;">Application Received! 🚀</h2>
        <p style="font-size: 14px; color: #334155;">Dear ${fullName},</p>
        <p style="font-size: 14px; color: #334155; line-height: 1.6;">
          Thank you for applying for an internship opportunity at <strong>InterHive</strong>. We have successfully received your application.
        </p>
        <p style="font-size: 14px; color: #334155; line-height: 1.6;">
          Our HR and technical review team will review your qualifications, skills, and portfolio. If shortlisted, you will receive an invitation for an interview directly via email.
        </p>
        <div style="background-color: #f1f5f9; padding: 14px; border-radius: 8px; margin: 20px 0; font-size: 13px; color: #475569;">
          <strong>Note:</strong> InterHive operates on a controlled-access model. Accounts are created directly by the HR team once candidate selection is finalized.
        </div>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #94a3b8; text-align: center;">InterHive Inc. • From Intern to Industry</p>
      </div>
    `;
    return this.sendEmail(to, `Application Received - InterHive Internship Program`, html);
  }

  async sendApplicationInterviewEmail(data: {
    to: string;
    fullName: string;
    date: string;
    time: string;
    mode: 'online' | 'offline';
    linkOrLocation: string;
    interviewer?: string;
    notes?: string;
  }) {
    const isOnline = data.mode === 'online';
    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #4f46e5; margin: 0; font-size: 26px; font-weight: 800;">Interview Invitation 📅</h1>
          <p style="color: #64748b; font-size: 14px; margin-top: 6px;">InterHive Internship Technical Evaluation</p>
        </div>

        <p style="font-size: 15px; color: #1e293b; line-height: 1.6;">
          Dear <strong>${data.fullName}</strong>,
        </p>

        <p style="font-size: 15px; color: #334155; line-height: 1.6;">
          Great news! Following a review of your application, our HR team has shortlisted you for an interview. Please find the confirmed schedule and session details below:
        </p>

        <div style="background: linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%); border: 1px solid #cbd5e1; border-radius: 14px; padding: 20px; margin: 24px 0;">
          <h3 style="margin-top: 0; color: #1e293b; font-size: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">🗓️ Session Schedule</h3>
          
          <table style="width: 100%; font-size: 14px; border-collapse: collapse; margin-top: 10px;">
            <tr>
              <td style="padding: 6px 0; color: #64748b; width: 140px;"><strong>Date:</strong></td>
              <td style="padding: 6px 0; color: #0f172a; font-weight: bold;">${data.date}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;"><strong>Time:</strong></td>
              <td style="padding: 6px 0; color: #0f172a; font-weight: bold;">${data.time}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;"><strong>Mode:</strong></td>
              <td style="padding: 6px 0; color: #4f46e5; font-weight: bold; text-transform: uppercase;">${data.mode}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;"><strong>${isOnline ? 'Meeting Link:' : 'Location:'}</strong></td>
              <td style="padding: 6px 0; color: #2563eb; font-weight: bold;">
                ${isOnline && data.linkOrLocation.startsWith('http') 
                  ? `<a href="${data.linkOrLocation}" target="_blank" style="color: #2563eb; text-decoration: underline;">${data.linkOrLocation}</a>`
                  : data.linkOrLocation}
              </td>
            </tr>
            ${data.interviewer ? `
            <tr>
              <td style="padding: 6px 0; color: #64748b;"><strong>Interviewer:</strong></td>
              <td style="padding: 6px 0; color: #334155;">${data.interviewer}</td>
            </tr>` : ''}
          </table>

          ${data.notes ? `
          <div style="margin-top: 14px; padding-top: 10px; border-top: 1px dashed #cbd5e1; font-size: 13px; color: #475569;">
            <strong>Additional Notes / Instructions:</strong>
            <p style="margin: 4px 0 0 0;">${data.notes}</p>
          </div>` : ''}
        </div>

        ${isOnline && data.linkOrLocation.startsWith('http') ? `
        <div style="text-align: center; margin: 28px 0;">
          <a href="${data.linkOrLocation}" target="_blank" style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff; text-decoration: none; font-weight: bold; font-size: 15px; padding: 14px 32px; border-radius: 10px; display: inline-block; box-shadow: 0 4px 10px rgba(79,70,229,0.3);">
            Join Interview Session →
          </a>
        </div>` : ''}

        <div style="background-color: #f8fafc; border-radius: 10px; padding: 16px; margin-top: 24px; font-size: 13px; color: #475569;">
          <h4 style="margin: 0 0 8px 0; color: #1e293b;">Preparation Checklist:</h4>
          <ul style="margin: 0; padding-left: 20px; line-height: 1.6;">
            <li>Please join or arrive 5 minutes before the scheduled time.</li>
            <li>Ensure a stable internet connection and functioning webcam/microphone.</li>
            <li>Have your portfolio, GitHub repositories, and resume ready to share.</li>
          </ul>
        </div>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 28px 0;" />
        <p style="font-size: 12px; color: #94a3b8; text-align: center;">
          InterHive Inc. • From Intern to Industry<br />
          If you need to reschedule, please contact <a href="mailto:interhive.info@gmail.com" style="color: #6366f1;">interhive.info@gmail.com</a>.
        </p>
      </div>
    `;

    return this.sendEmail(
      data.to,
      `📅 Interview Invitation: InterHive Internship Program with ${data.fullName}`,
      html,
    );
  }

  async sendRejectionEmail(data: {
    to: string;
    fullName: string;
    feedback?: string;
  }) {
    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #4f46e5; margin: 0; font-size: 24px; font-weight: 800;">InterHive Internship Program</h1>
          <p style="color: #64748b; font-size: 13px; margin-top: 6px;">From Intern to Industry Readiness</p>
        </div>

        <p style="font-size: 15px; color: #1e293b; line-height: 1.6;">
          Dear <strong>${data.fullName}</strong>,
        </p>

        <p style="font-size: 15px; color: #334155; line-height: 1.7;">
          Thank you for taking the time to apply and participate in our internship selection process at <strong>InterHive</strong>. We truly appreciate your interest in joining our program.
        </p>

        <p style="font-size: 15px; color: #334155; line-height: 1.7;">
          After careful consideration of all applicants, we regret to inform you that we are <strong>unable to move forward with your application</strong> at this time. This was a very competitive round, and the decision was not made lightly.
        </p>

        ${data.feedback ? `
        <div style="background: #f8fafc; border-left: 4px solid #4f46e5; border-radius: 8px; padding: 16px; margin: 20px 0; font-size: 14px; color: #475569; line-height: 1.6;">
          <strong style="color: #1e293b;">Feedback from our HR team:</strong><br/>
          ${data.feedback}
        </div>` : ''}

        <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 1px solid #bbf7d0; border-radius: 14px; padding: 20px; margin: 24px 0;">
          <h3 style="margin-top: 0; color: #166534; font-size: 15px;">💡 Keep Going — Your Journey Doesn't End Here</h3>
          <ul style="margin: 0; padding-left: 18px; color: #15803d; font-size: 14px; line-height: 1.8;">
            <li>Continue building your skills and portfolio with real-world projects.</li>
            <li>InterHive runs new internship batches periodically — you're welcome to re-apply in the future.</li>
            <li>Keep contributing to open-source projects and strengthening your GitHub profile.</li>
          </ul>
        </div>

        <p style="font-size: 14px; color: #475569; line-height: 1.7;">
          We wish you the very best in your career journey. We encourage you to keep learning and growing — many successful professionals faced similar setbacks early on. <strong>Better luck next time!</strong> 🌟
        </p>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 28px 0;" />
        <p style="font-size: 12px; color: #94a3b8; text-align: center;">
          InterHive Inc. • Industry Readiness &amp; Talent Connect Platform<br />
          Questions? Reach us at <a href="mailto:interhive.info@gmail.com" style="color: #6366f1;">interhive.info@gmail.com</a>
        </p>
      </div>
    `;

    return this.sendEmail(
      data.to,
      `InterHive Internship Application — Update on Your Application`,
      html,
    );
  }
}