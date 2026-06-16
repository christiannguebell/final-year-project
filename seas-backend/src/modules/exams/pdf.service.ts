import puppeteer from 'puppeteer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

function resolveTemplatePath(templateName: string): string {
  const candidates = [
    path.join(__dirname, '../../src/templates/pdf', `${templateName}.hbs`),
    path.join(__dirname, '../templates/pdf', `${templateName}.hbs`),
    path.join(process.cwd(), 'src/templates/pdf', `${templateName}.hbs`),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return candidates[0];
}

export async function generatePdfFromTemplate(
  templateName: string,
  data: Record<string, unknown>
): Promise<Buffer> {
  try {
    const templatePath = resolveTemplatePath(templateName);
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(templateSource);
    const htmlContent = template(data);

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm',
        },
      });

      return Buffer.from(pdfBuffer);
    } finally {
      await browser.close();
    }
  } catch (error) {
    throw new Error(
      `Failed to generate PDF (${templateName}): ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export const generateAdmissionSlipPdf = async (assignment: any): Promise<Buffer> => {
  const user = assignment.application?.user || {};
  const program = assignment.application?.program || {};
  const session = assignment.session || {};
  const center = assignment.center || {};

  return generatePdfFromTemplate('admission-slip', {
    user,
    application: {
      userId: assignment.application?.userId?.substring(0, 8).toUpperCase() || 'UNKNOWN',
    },
    program,
    session,
    center,
    examDateFormatted: assignment.examTime
      ? new Date(assignment.examTime).toLocaleString()
      : 'TBD',
    seatNumber: assignment.seatNumber,
  });
};

export const generateResultReportPdf = async (result: any, user: any, program: any): Promise<Buffer> => {
  const scores = (result.scores || []).map((score: any) => ({
    subject: score.subject,
    score: score.score ?? '-',
    maxScore: score.maxScore ?? '-',
  }));

  return generatePdfFromTemplate('result-report', {
    user,
    program,
    totalScore: result.totalScore ?? '-',
    rank: result.rank ?? '-',
    status: result.status,
    publishedAt: result.publishedAt
      ? new Date(result.publishedAt).toLocaleDateString()
      : new Date().toLocaleDateString(),
    scores,
  });
};

export const generatePaymentSummaryPdf = async (
  application: any,
  payments: any[],
  totals: { invoiced: number; paid: number; balance: number }
): Promise<Buffer> => {
  const user = application.candidate || {};
  const program = application.program || {};

  return generatePdfFromTemplate('payment-summary', {
    user,
    program,
    applicationId: application.id?.substring(0, 8).toUpperCase(),
    payments: payments.map((payment) => ({
      date: payment.paymentDate
        ? new Date(payment.paymentDate).toLocaleDateString()
        : '-',
      amount: Number(payment.amount || 0).toFixed(2),
      method: payment.method,
      status: payment.status,
    })),
    totalInvoiced: totals.invoiced.toFixed(2),
    totalPaid: totals.paid.toFixed(2),
    balanceDue: totals.balance.toFixed(2),
    generatedAt: new Date().toLocaleString(),
  });
};

export const generateAdmissionLetterPdf = async (application: any): Promise<Buffer> => {
  const user = application.candidate || {};
  const program = application.program || {};

  return generatePdfFromTemplate('admission-letter', {
    user,
    program,
    applicationId: application.id?.substring(0, 8).toUpperCase(),
    approvedAt: application.updatedAt
      ? new Date(application.updatedAt).toLocaleDateString()
      : new Date().toLocaleDateString(),
  });
};

export const generateDocumentScanningGuidePdf = async (): Promise<Buffer> => {
  return generatePdfFromTemplate('document-scanning-guide', {
    generatedAt: new Date().toLocaleString(),
  });
};
