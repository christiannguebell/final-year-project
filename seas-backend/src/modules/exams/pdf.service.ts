import puppeteer from 'puppeteer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

export const generateAdmissionSlipPdf = async (assignment: any): Promise<Buffer> => {
  try {
    const templatePath = path.join(__dirname, '../../templates/pdf/admission-slip.hbs');
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(templateSource);

    const user = assignment.application?.user || {};
    const program = assignment.application?.program || {};
    const session = assignment.session || {};
    const center = assignment.center || {};

    const htmlContent = template({
      user,
      application: { userId: assignment.application?.userId?.substring(0, 8).toUpperCase() || 'UNKNOWN' },
      program,
      session,
      center,
      examDateFormatted: assignment.examTime ? new Date(assignment.examTime).toLocaleString() : 'TBD',
      seatNumber: assignment.seatNumber,
    });

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    });

    await browser.close();

    return Buffer.from(pdfBuffer);
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw new Error('Failed to generate PDF slip');
  }
};
