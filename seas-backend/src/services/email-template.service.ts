import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

const TEMPLATES_DIR = path.join(__dirname, '../../src/templates/emails');

interface TemplateData {
  [key: string]: any;
}

class EmailTemplateService {
  private templates: Map<string, HandlebarsTemplateDelegate> = new Map();
  private layoutTemplate: HandlebarsTemplateDelegate | null = null;

  async initialize(): Promise<void> {
    try {
      const layoutPath = path.join(TEMPLATES_DIR, 'layouts/main.hbs');
      const layoutSource = fs.readFileSync(layoutPath, 'utf-8');
      this.layoutTemplate = Handlebars.compile(layoutSource);

      const templateFiles = fs.readdirSync(TEMPLATES_DIR).filter(f => f.endsWith('.hbs') && f !== 'main.hbs');

      for (const file of templateFiles) {
        const templatePath = path.join(TEMPLATES_DIR, file);
        const templateSource = fs.readFileSync(templatePath, 'utf-8');
        const templateName = file.replace('.hbs', '');
        this.templates.set(templateName, Handlebars.compile(templateSource));
      }

      console.log(`Loaded ${this.templates.size} email templates`);
    } catch (error) {
      console.error('Failed to initialize email templates:', error);
    }
  }

  render(templateName: string, data: TemplateData): string {
    const template = this.templates.get(templateName);
    if (!template) {
      throw new Error(`Template '${templateName}' not found`);
    }

    const body = template({ ...data, year: new Date().getFullYear() });

    if (this.layoutTemplate) {
      return this.layoutTemplate({
        title: data.subject || 'SEAS Notification',
        body,
        ...data,
      });
    }

    return body;
  }

  hasTemplate(templateName: string): boolean {
    return this.templates.has(templateName);
  }

  getAvailableTemplates(): string[] {
    return Array.from(this.templates.keys());
  }
}

export const emailTemplateService = new EmailTemplateService();
export default emailTemplateService;