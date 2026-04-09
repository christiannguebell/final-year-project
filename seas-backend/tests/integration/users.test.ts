import request from 'supertest';
import { Express } from 'express';

let app: Express;
let adminToken: string;
let candidateToken: string;
let testUserId: string;

beforeAll(async () => {
  app = require('../../src/app');
  
  const adminLogin = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@seas.com', password: 'admin123' });
  adminToken = adminLogin.body.data?.accessToken;

  const candidateLogin = await request(app)
    .post('/api/auth/register')
    .send({
      email: `candidate-${Date.now()}@example.com`,
      password: 'password123',
      firstName: 'Candidate',
      lastName: 'Test',
    });
  candidateToken = candidateLogin.body.data?.accessToken;
  testUserId = candidateLogin.body.data?.user?.id;
});

describe('Users API', () => {
  describe('GET /api/users', () => {
    it('should return 401 without authentication', async () => {
      const response = await request(app).get('/api/users');
      expect(response.status).toBe(401);
    });

    it('should return 403 for non-admin user', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${candidateToken}`);
      expect(response.status).toBe(403);
    });

    it('should return users for admin', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return user by id for admin', async () => {
      const response = await request(app)
        .get(`/api/users/${testUserId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('email');
    });

    it('should return user by id for owner', async () => {
      const response = await request(app)
        .get(`/api/users/${testUserId}`)
        .set('Authorization', `Bearer ${candidateToken}`);
      expect(response.status).toBe(200);
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .get('/api/users/non-existent-id')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /api/users/:id/activate', () => {
    it('should activate user for admin', async () => {
      const response = await request(app)
        .patch(`/api/users/${testUserId}/activate`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(response.status).toBe(200);
    });
  });

  describe('PATCH /api/users/:id/deactivate', () => {
    it('should deactivate user for admin', async () => {
      const response = await request(app)
        .patch(`/api/users/${testUserId}/deactivate`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(response.status).toBe(200);
    });
  });
});

describe('Programs API', () => {
  describe('GET /api/programs', () => {
    it('should return all programs', async () => {
      const response = await request(app).get('/api/programs');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /api/programs', () => {
    it('should create program for admin', async () => {
      const response = await request(app)
        .post('/api/programs')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Program',
          code: `TEST-${Date.now()}`,
          description: 'Test description',
          durationYears: 4,
        });
      expect(response.status).toBe(201);
    });

    it('should return 403 for non-admin', async () => {
      const response = await request(app)
        .post('/api/programs')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({
          name: 'Test Program',
          code: 'TEST001',
          durationYears: 4,
        });
      expect(response.status).toBe(403);
    });
  });
});

describe('Candidates API', () => {
  describe('GET /api/candidates/me', () => {
    it('should return candidate profile for authenticated user', async () => {
      const response = await request(app)
        .get('/api/candidates/me')
        .set('Authorization', `Bearer ${candidateToken}`);
      expect(response.status).toBe(200);
    });
  });

  describe('POST /api/candidates', () => {
    it('should create candidate profile', async () => {
      const response = await request(app)
        .post('/api/candidates')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({
          dateOfBirth: '2000-01-01',
          gender: 'male',
          nationality: 'Cameroon',
        });
      expect(response.status).toBe(201);
    });
  });
});