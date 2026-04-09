import request from 'supertest';
import app from '../../src/app';
import { Express } from 'express';

let adminToken: string;
let candidateToken: string;
let testProgramId: string;
let testApplicationId: string;

beforeAll(async () => {
  const adminLogin = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@seas.com', password: 'admin123' });
  adminToken = adminLogin.body.data?.accessToken;

  const candidateRes = await request(app)
    .post('/api/auth/register')
    .send({
      email: `app-candidate-${Date.now()}@example.com`,
      password: 'password123',
      firstName: 'App',
      lastName: 'Candidate',
    });
  candidateToken = candidateRes.body.data?.accessToken;

  const programsRes = await request(app).get('/api/programs');
  testProgramId = programsRes.body.data[0]?.id;
});

describe('Applications API', () => {
  describe('POST /api/applications', () => {
    it('should create a new application', async () => {
      const response = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({
          programId: testProgramId,
          personalStatement: 'I want to study computer science.',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      testApplicationId = response.body.data.id;
    });

    it('should return 409 for duplicate application', async () => {
      const response = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({
          programId: testProgramId,
        });

      expect(response.status).toBe(409);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/api/applications')
        .send({ programId: testProgramId });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/applications/mine', () => {
    it('should return user applications', async () => {
      const response = await request(app)
        .get('/api/applications/mine')
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/applications/:id', () => {
    it('should return application by id for owner', async () => {
      const response = await request(app)
        .get(`/api/applications/${testApplicationId}`)
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(testApplicationId);
    });

    it('should return application for admin', async () => {
      const response = await request(app)
        .get(`/api/applications/${testApplicationId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
    });
  });

  describe('PUT /api/applications/:id', () => {
    it('should update draft application', async () => {
      const response = await request(app)
        .put(`/api/applications/${testApplicationId}`)
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({
          personalStatement: 'Updated statement.',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.personalStatement).toBe('Updated statement.');
    });
  });

  describe('POST /api/applications/:id/submit', () => {
    it('should submit draft application', async () => {
      const response = await request(app)
        .post(`/api/applications/${testApplicationId}/submit`)
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('submitted');
    });
  });

  describe('GET /api/applications', () => {
    it('should return all applications for admin', async () => {
      const response = await request(app)
        .get('/api/applications')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
});

describe('Applications (Admin Actions) API', () => {
  describe('PATCH /api/applications/:id/approve', () => {
    it('should approve submitted application', async () => {
      const response = await request(app)
        .patch(`/api/applications/${testApplicationId}/approve`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('approved');
    });
  });

  describe('PATCH /api/applications/:id/reject', () => {
    it('should reject submitted application', async () => {
      const newAppRes = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({
          programId: testProgramId,
        });
      const newAppId = newAppRes.body.data.id;

      await request(app)
        .post(`/api/applications/${newAppId}/submit`)
        .set('Authorization', `Bearer ${candidateToken}`);

      const response = await request(app)
        .patch(`/api/applications/${newAppId}/reject`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('rejected');
    });
  });
});