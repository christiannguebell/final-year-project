import request from 'supertest';
import app from '../../src/app';
import path from 'path';
import fs from 'fs';
import { Express } from 'express';

let adminToken: string;
let candidateToken: string;
let testApplicationId: string;

beforeAll(async () => {
  const adminLogin = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@seas.com', password: 'admin123' });
  adminToken = adminLogin.body.data?.accessToken;

  const candidateRes = await request(app)
    .post('/api/auth/register')
    .send({
      email: `doc-candidate-${Date.now()}@example.com`,
      password: 'password123',
      firstName: 'Doc',
      lastName: 'Candidate',
    });
  candidateToken = candidateRes.body.data?.accessToken;

  const programsRes = await request(app).get('/api/programs');
  const programId = programsRes.body.data[0]?.id;

  const appRes = await request(app)
    .post('/api/applications')
    .set('Authorization', `Bearer ${candidateToken}`)
    .send({ programId });
  testApplicationId = appRes.body.data.id;
});

describe('Documents API', () => {
  const testFilePath = path.join(__dirname, 'test-file.txt');
  const testContent = 'Test document content';
  fs.writeFileSync(testFilePath, testContent);

  afterAll(() => {
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  });

  describe('POST /api/documents/:applicationId', () => {
    it('should upload a document', async () => {
      const response = await request(app)
        .post(`/api/documents/${testApplicationId}`)
        .set('Authorization', `Bearer ${candidateToken}`)
        .attach('file', testFilePath)
        .field('type', 'id_card');

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post(`/api/documents/${testApplicationId}`)
        .attach('file', testFilePath)
        .field('type', 'id_card');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/documents/:applicationId', () => {
    it('should return documents for application', async () => {
      const response = await request(app)
        .get(`/api/documents/${testApplicationId}`)
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('PATCH /api/documents/:id/verify', () => {
    it('should verify document for admin', async () => {
      const docsRes = await request(app)
        .get(`/api/documents/${testApplicationId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      const docId = docsRes.body.data[0]?.id;

      if (docId) {
        const response = await request(app)
          .patch(`/api/documents/${docId}/verify`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ status: 'verified', notes: 'Looks good' });

        expect(response.status).toBe(200);
      }
    });
  });
});

describe('Payments API', () => {
  describe('POST /api/payments', () => {
    it('should create a payment record', async () => {
      const response = await request(app)
        .post('/api/payments')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({
          applicationId: testApplicationId,
          amount: 5000,
          paymentDate: new Date().toISOString(),
        });

      expect(response.status).toBe(201);
    });

    it('should return 404 for non-existent application', async () => {
      const response = await request(app)
        .post('/api/payments')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({
          applicationId: 'non-existent-id',
          amount: 5000,
          paymentDate: new Date().toISOString(),
        });

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/payments/application/:applicationId', () => {
    it('should return payments for application', async () => {
      const response = await request(app)
        .get(`/api/payments/application/${testApplicationId}`)
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('PATCH /api/payments/:id/verify', () => {
    it('should verify payment for admin', async () => {
      const paymentsRes = await request(app)
        .get(`/api/payments/application/${testApplicationId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      const paymentId = paymentsRes.body.data[0]?.id;

      if (paymentId) {
        const response = await request(app)
          .patch(`/api/payments/${paymentId}/verify`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ status: 'verified', notes: 'Payment confirmed' });

        expect(response.status).toBe(200);
      }
    });
  });
});