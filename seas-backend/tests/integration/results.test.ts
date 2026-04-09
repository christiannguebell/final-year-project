import request from 'supertest';
import app from '../../src/app';

describe('Results API', () => {
  let adminToken: string;
  let candidateToken: string;
  let testApplicationId: string;
  let testResultId: string;

  beforeAll(async () => {
    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@seas.com', password: 'admin123' });
    adminToken = adminLogin.body.data?.accessToken;

    const candidateRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: `result-candidate-${Date.now()}@example.com`,
        password: 'password123',
        firstName: 'Result',
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

  describe('POST /api/results', () => {
    it('should create a result for admin', async () => {
      const response = await request(app)
        .post('/api/results')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          applicationId: testApplicationId,
        });

      expect(response.status).toBe(201);
      testResultId = response.body.data.id;
    });

    it('should return 409 if result already exists', async () => {
      const response = await request(app)
        .post('/api/results')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          applicationId: testApplicationId,
        });

      expect(response.status).toBe(409);
    });

    it('should return 403 for non-admin', async () => {
      const otherCandidateRes = await request(app)
        .post('/api/auth/register')
        .send({
          email: `other-res-${Date.now()}@example.com`,
          password: 'password123',
          firstName: 'Other',
          lastName: 'User',
        });
      const otherToken = otherCandidateRes.body.data?.accessToken;

      const response = await request(app)
        .post('/api/results')
        .set('Authorization', `Bearer ${otherToken}`)
        .send({
          applicationId: testApplicationId,
        });

      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/results/:id', () => {
    it('should return result by id', async () => {
      if (testResultId) {
        const response = await request(app)
          .get(`/api/results/${testResultId}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
      }
    });

    it('should return 404 for non-existent result', async () => {
      const response = await request(app)
        .get('/api/results/non-existent-id')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/results/application/:applicationId', () => {
    it('should return result by application id', async () => {
      const response = await request(app)
        .get(`/api/results/application/${testApplicationId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
    });
  });

  describe('PUT /api/results/:id/scores', () => {
    it('should enter scores for result', async () => {
      if (testResultId) {
        const response = await request(app)
          .put(`/api/results/${testResultId}/scores`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            scores: [
              { subject: 'Mathematics', score: 85, maxScore: 100 },
              { subject: 'English', score: 78, maxScore: 100 },
              { subject: 'Science', score: 92, maxScore: 100 },
            ],
          });

        expect(response.status).toBe(200);
        expect(response.body.data.totalScore).toBe(255);
      }
    });

    it('should return 404 for non-existent result', async () => {
      const response = await request(app)
        .put('/api/results/non-existent-id/scores')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          scores: [{ subject: 'Math', score: 100, maxScore: 100 }],
        });

      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /api/results/:id/publish', () => {
    it('should publish result', async () => {
      if (testResultId) {
        const response = await request(app)
          .patch(`/api/results/${testResultId}/publish`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.data.status).toBe('published');
      }
    });

    it('should return 404 for non-existent result', async () => {
      const response = await request(app)
        .patch('/api/results/non-existent-id/publish')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/results/my-result', () => {
    it('should return candidate result', async () => {
      const response = await request(app)
        .get('/api/results/my-result')
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(response.status).toBe(200);
    });
  });

  describe('DELETE /api/results/:id', () => {
    it('should delete result for admin', async () => {
      const newAppRes = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({ programId: (await request(app).get('/api/programs')).body.data[0]?.id });

      const resultRes = await request(app)
        .post('/api/results')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ applicationId: newAppRes.body.data.id });
      const resultId = resultRes.body.data.id;

      const response = await request(app)
        .delete(`/api/results/${resultId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
    });
  });
});

describe('Results (Admin) API', () => {
  let adminToken: string;

  beforeAll(async () => {
    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@seas.com', password: 'admin123' });
    adminToken = adminLogin.body.data?.accessToken;
  });

  describe('GET /api/results', () => {
    it('should return all results for admin', async () => {
      const response = await request(app)
        .get('/api/results')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter results by status', async () => {
      const response = await request(app)
        .get('/api/results')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ status: 'published' });

      expect(response.status).toBe(200);
    });

    it('should filter results by session', async () => {
      const response = await request(app)
        .get('/api/results')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ sessionId: 'test-session-id' });

      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/results/ranking', () => {
    it('should return results ranked by score', async () => {
      const response = await request(app)
        .get('/api/results/ranking')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ sessionId: 'test-session-id' });

      expect(response.status).toBe(200);
    });
  });

  describe('POST /api/results/publish-session', () => {
    it('should publish all results for a session', async () => {
      const response = await request(app)
        .post('/api/results/publish-session')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ sessionId: 'test-session-id' });

      expect(response.status).toBe(200);
    });
  });

  describe('POST /api/results/bulk-upload', () => {
    it('should bulk upload results', async () => {
      const response = await request(app)
        .post('/api/results/bulk-upload')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          results: [
            { applicationId: 'app1', scores: [{ subject: 'Math', score: 90, maxScore: 100 }] },
          ],
        });

      expect(response.status).toBe(200);
    });
  });
});