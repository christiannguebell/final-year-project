import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
import { emailConfig } from '../config/email.config';
import { emailTemplateService } from './email-template.service';
import logger from '../common/logger';

interface SendTemplatedEmailOptions {
  to: string;
  template: string;
  data: Record<string, any>;
  subject?: string;
}

class EmailService {
  private transporter: Transporter | null = null;

  async initialize(): Promise<void> {
    try {
      this.transporter = nodemailer.createTransport({
        host: emailConfig.host,
        port: emailConfig.port,
        secure: emailConfig.secure,
        auth: emailConfig.auth.user ? emailConfig.auth : undefined,
      });

      await this.transporter.verify();
      logger.info(`Email service connected to ${emailConfig.host}:${emailConfig.port}`);
    } catch (error) {
      logger.error('Failed to initialize email service:', error);
      throw error;
    }
  }

  async sendMail(options: SendMailOptions): Promise<void> {
    if (!this.transporter) {
      throw new Error('Email service not initialized');
    }

    try {
      await this.transporter.sendMail({
        from: options.from || emailConfig.from,
        ...options,
      });
      logger.info(`Email sent to ${options.to}`);
    } catch (error) {
      logger.error(`Failed to send email to ${options.to}:`, error);
      throw error;
    }
  }

  async sendTemplatedEmail(options: SendTemplatedEmailOptions): Promise<void> {
    if (!emailTemplateService.hasTemplate(options.template)) {
      throw new Error(`Template '${options.template}' not found`);
    }

    const html = emailTemplateService.render(options.template, {
      ...options.data,
      subject: options.subject,
    });

    await this.sendMail({
      to: options.to,
      subject: options.subject || 'SEAS Notification',
      html,
    });
  }

  async sendVerificationEmail(to: string, token: string): Promise<void> {
    const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/verify/${token}`;
    await this.sendMail({
      to,
      subject: 'Verify your email',
      html: `<p>Click <a href="${verifyUrl}">here</a> to verify your email.</p>`,
    });
  }

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/reset-password/${token}`;
    await this.sendMail({
      to,
      subject: 'Reset your password',
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    });
  }

  isInitialized(): boolean {
    return this.transporter !== null;
  }
}

export const emailService = new EmailService();
export default emailService;