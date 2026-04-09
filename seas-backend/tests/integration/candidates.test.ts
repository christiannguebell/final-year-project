import request from 'supertest';
import app from '../../src/app';

describe('Candidates API', () => {
  let adminToken: string;
  let candidateToken: string;
  let testCandidateId: string;

  beforeAll(async () => {
    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@seas.com', password: 'admin123' });
    adminToken = adminLogin.body.data?.accessToken;

    const candidateRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: `cand-test-${Date.now()}@example.com`,
        password: 'password123',
        firstName: 'Candidate',
        lastName: 'Test',
      });
    candidateToken = candidateRes.body.data?.accessToken;
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
          address: '123 Test Street',
          city: 'Yaounde',
          country: 'Cameroon',
        });

      expect(response.status).toBe(201);
      testCandidateId = response.body.data.id;
    });

    it('should return 409 if candidate profile already exists', async () => {
      const response = await request(app)
        .post('/api/candidates')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({
          dateOfBirth: '2000-01-01',
        });

      expect(response.status).toBe(409);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/api/candidates')
        .send({ dateOfBirth: '2000-01-01' });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/candidates/me', () => {
    it('should return candidate profile for authenticated user', async () => {
      const response = await request(app)
        .get('/api/candidates/me')
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('candidateNumber');
    });
  });

  describe('GET /api/candidates/:id', () => {
    it('should return candidate by id for admin', async () => {
      if (testCandidateId) {
        const response = await request(app)
          .get(`/api/candidates/${testCandidateId}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
      }
    });

    it('should return 404 for non-existent candidate', async () => {
      const response = await request(app)
        .get('/api/candidates/non-existent-id')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/candidates/:id', () => {
    it('should update candidate profile', async () => {
      if (testCandidateId) {
        const response = await request(app)
          .put(`/api/candidates/${testCandidateId}`)
          .set('Authorization', `Bearer ${candidateToken}`)
          .send({
            nationality: 'Nigeria',
            city: 'Lagos',
          });

        expect(response.status).toBe(200);
        expect(response.body.data.nationality).toBe('Nigeria');
      }
    });
  });

  describe('PUT /api/candidates/:id/photo', () => {
    it('should update profile photo', async () => {
      if (testCandidateId) {
        const response = await request(app)
          .put(`/api/candidates/${testCandidateId}/photo`)
          .set('Authorization', `Bearer ${candidateToken}`)
          .send({
            profilePhoto: '/uploads/profile/photo.jpg',
          });

        expect(response.status).toBe(200);
      }
    });
  });

  describe('DELETE /api/candidates/:id', () => {
    it('should delete candidate profile', async () => {
      const newCandidateRes = await request(app)
        .post('/api/auth/register')
        .send({
          email: `cand-del-${Date.now()}@example.com`,
          password: 'password123',
          firstName: 'Delete',
          lastName: 'Test',
        });
      const newToken = newCandidateRes.body.data?.accessToken;

      const profileRes = await request(app)
        .post('/api/candidates')
        .set('Authorization', `Bearer ${newToken}`)
        .send({ dateOfBirth: '2000-01-01' });
      const profileId = profileRes.body.data.id;

      const response = await request(app)
        .delete(`/api/candidates/${profileId}`)
        .set('Authorization', `Bearer ${newToken}`);

      expect(response.status).toBe(200);
    });
  });
});

describe('Candidates (Admin) API', () => {
  let adminToken: string;

  beforeAll(async () => {
    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@seas.com', password: 'admin123' });
    adminToken = adminLogin.body.data?.accessToken;
  });

  describe('GET /api/candidates', () => {
    it('should return all candidates for admin', async () => {
      const response = await request(app)
        .get('/api/candidates')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should return 403 for non-admin', async () => {
      const candidateRes = await request(app)
        .post('/api/auth/register')
        .send({
          email: `cand-user-${Date.now()}@example.com`,
          password: 'password123',
          firstName: 'User',
          lastName: 'Test',
        });
      const token = candidateRes.body.data?.accessToken;

      const response = await request(app)
        .get('/api/candidates')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/candidates/search', () => {
    it('should search candidates by candidate number', async () => {
      const response = await request(app)
        .get('/api/candidates/search')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ candidateNumber: 'CAND' });

      expect(response.status).toBe(200);
    });
  });
});