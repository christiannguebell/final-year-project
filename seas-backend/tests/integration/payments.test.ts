import request from 'supertest';
import app from '../../src/app';

describe('Payments API', () => {
  let adminToken: string;
  let candidateToken: string;
  let testApplicationId: string;
  let testPaymentId: string;

  beforeAll(async () => {
    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@seas.com', password: 'admin123' });
    adminToken = adminLogin.body.data?.accessToken;

    const candidateRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: `payment-candidate-${Date.now()}@example.com`,
        password: 'password123',
        firstName: 'Payment',
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
      testPaymentId = response.body.data.id;
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

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/api/payments')
        .send({
          applicationId: testApplicationId,
          amount: 5000,
        });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/payments/:id/receipt', () => {
    it('should upload payment receipt', async () => {
      if (testPaymentId) {
        const response = await request(app)
          .post(`/api/payments/${testPaymentId}/receipt`)
          .set('Authorization', `Bearer ${candidateToken}`)
          .send({
            receiptFile: '/uploads/receipts/test.jpg',
          });

        expect(response.status).toBe(200);
      }
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

    it('should return 403 for unauthorized access', async () => {
      const otherCandidateRes = await request(app)
        .post('/api/auth/register')
        .send({
          email: `other-pay-${Date.now()}@example.com`,
          password: 'password123',
          firstName: 'Other',
          lastName: 'User',
        });
      const otherToken = otherCandidateRes.body.data?.accessToken;

      const response = await request(app)
        .get(`/api/payments/application/${testApplicationId}`)
        .set('Authorization', `Bearer ${otherToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/payments/:id', () => {
    it('should return payment by id', async () => {
      if (testPaymentId) {
        const response = await request(app)
          .get(`/api/payments/${testPaymentId}`)
          .set('Authorization', `Bearer ${candidateToken}`);

        expect(response.status).toBe(200);
      }
    });
  });

  describe('PATCH /api/payments/:id/verify', () => {
    it('should verify payment for admin', async () => {
      if (testPaymentId) {
        const response = await request(app)
          .patch(`/api/payments/${testPaymentId}/verify`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ status: 'verified', notes: 'Payment confirmed' });

        expect(response.status).toBe(200);
        expect(response.body.data.status).toBe('verified');
      }
    });

    it('should return 404 for non-existent payment', async () => {
      const response = await request(app)
        .patch('/api/payments/non-existent-id/verify')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'verified' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/payments/:id', () => {
    it('should delete payment for owner', async () => {
      const newAppRes = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({ programId: (await request(app).get('/api/programs')).body.data[0]?.id });

      const newAppId = newAppRes.body.data.id;

      const paymentRes = await request(app)
        .post('/api/payments')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({
          applicationId: newAppId,
          amount: 5000,
          paymentDate: new Date().toISOString(),
        });
      const paymentId = paymentRes.body.data.id;

      const response = await request(app)
        .delete(`/api/payments/${paymentId}`)
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(response.status).toBe(200);
    });
  });
});

describe('Payments (Admin) API', () => {
  let adminToken: string;

  beforeAll(async () => {
    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@seas.com', password: 'admin123' });
    adminToken = adminLogin.body.data?.accessToken;
  });

  describe('GET /api/payments', () => {
    it('should return all payments for admin', async () => {
      const response = await request(app)
        .get('/api/payments')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter payments by status', async () => {
      const response = await request(app)
        .get('/api/payments')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ status: 'verified' });

      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/payments/:id', () => {
    it('should return payment details for admin', async () => {
      const paymentsRes = await request(app)
        .get('/api/payments')
        .set('Authorization', `Bearer ${adminToken}`);
      const paymentId = paymentsRes.body.data[0]?.id;

      if (paymentId) {
        const response = await request(app)
          .get(`/api/payments/${paymentId}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
      }
    });
  });
});