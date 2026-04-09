import request from 'supertest';
import app from '../../src/app';

describe('Programs API', () => {
  let adminToken: string;
  let candidateToken: string;
  let testProgramId: string;

  beforeAll(async () => {
    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@seas.com', password: 'admin123' });
    adminToken = adminLogin.body.data?.accessToken;

    const candidateRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: `prog-candidate-${Date.now()}@example.com`,
        password: 'password123',
        firstName: 'Program',
        lastName: 'Candidate',
      });
    candidateToken = candidateRes.body.data?.accessToken;
  });

  describe('GET /api/programs', () => {
    it('should return all active programs', async () => {
      const response = await request(app).get('/api/programs');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter programs by status', async () => {
      const response = await request(app)
        .get('/api/programs')
        .query({ status: 'active' });

      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/programs/:id', () => {
    it('should return program by id', async () => {
      const programsRes = await request(app).get('/api/programs');
      testProgramId = programsRes.body.data[0]?.id;

      if (testProgramId) {
        const response = await request(app).get(`/api/programs/${testProgramId}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('name');
      }
    });

    it('should return 404 for non-existent program', async () => {
      const response = await request(app).get('/api/programs/non-existent-id');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/programs', () => {
    it('should create program for admin', async () => {
      const response = await request(app)
        .post('/api/programs')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: `Test Program ${Date.now()}`,
          code: `TEST-${Date.now()}`,
          description: 'Test program description',
          durationYears: 4,
          entryRequirements: 'High school diploma',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    it('should return 409 for duplicate program code', async () => {
      const programsRes = await request(app).get('/api/programs');
      const existingCode = programsRes.body.data[0]?.code;

      const response = await request(app)
        .post('/api/programs')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Program',
          code: existingCode,
          durationYears: 4,
        });

      expect(response.status).toBe(409);
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

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/api/programs')
        .send({
          name: 'Test Program',
          code: 'TEST001',
          durationYears: 4,
        });

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/programs/:id', () => {
    it('should update program for admin', async () => {
      const response = await request(app)
        .put(`/api/programs/${testProgramId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          description: 'Updated description',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.description).toBe('Updated description');
    });

    it('should return 404 for non-existent program', async () => {
      const response = await request(app)
        .put('/api/programs/non-existent-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'New Name' });

      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /api/programs/:id/activate', () => {
    it('should activate program for admin', async () => {
      if (testProgramId) {
        const response = await request(app)
          .patch(`/api/programs/${testProgramId}/activate`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
      }
    });

    it('should return 400 if already active', async () => {
      if (testProgramId) {
        const response = await request(app)
          .patch(`/api/programs/${testProgramId}/activate`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(400);
      }
    });
  });

  describe('PATCH /api/programs/:id/deactivate', () => {
    it('should deactivate program for admin', async () => {
      if (testProgramId) {
        const response = await request(app)
          .patch(`/api/programs/${testProgramId}/deactivate`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
      }
    });
  });

  describe('DELETE /api/programs/:id', () => {
    it('should delete program for admin', async () => {
      const createRes = await request(app)
        .post('/api/programs')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Delete Test Program',
          code: `DEL-${Date.now()}`,
          durationYears: 4,
        });
      const programId = createRes.body.data.id;

      const response = await request(app)
        .delete(`/api/programs/${programId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
    });
  });
});