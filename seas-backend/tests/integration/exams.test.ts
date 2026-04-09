import request from 'supertest';
import app from '../../src/app';
import { Express } from 'express';

let adminToken: string;
let candidateToken: string;

beforeAll(async () => {
  const adminLogin = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@seas.com', password: 'admin123' });
  adminToken = adminLogin.body.data?.accessToken;

  const candidateRes = await request(app)
    .post('/api/auth/register')
    .send({
      email: `exam-candidate-${Date.now()}@example.com`,
      password: 'password123',
      firstName: 'Exam',
      lastName: 'Candidate',
    });
  candidateToken = candidateRes.body.data?.accessToken;
});

describe('Exams API', () => {
  let testSessionId: string;
  let testCenterId: string;

  describe('POST /api/exams/sessions', () => {
    it('should create exam session for admin', async () => {
      const response = await request(app)
        .post('/api/exams/sessions')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: `Test Session ${Date.now()}`,
          examDate: '2024-12-15',
          registrationStart: '2024-01-01',
          registrationEnd: '2024-11-30',
          description: 'Test exam session',
        });

      expect(response.status).toBe(201);
      testSessionId = response.body.data.id;
    });

    it('should return 403 for non-admin', async () => {
      const response = await request(app)
        .post('/api/exams/sessions')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({
          name: 'Test Session',
          examDate: '2024-12-15',
        });

      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/exams/sessions', () => {
    it('should return all exam sessions', async () => {
      const response = await request(app)
        .get('/api/exams/sessions')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('POST /api/exams/centers', () => {
    it('should create exam center for admin', async () => {
      const response = await request(app)
        .post('/api/exams/centers')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: `Test Center ${Date.now()}`,
          address: '123 Test Street',
          city: 'Test City',
          capacity: 100,
        });

      expect(response.status).toBe(201);
      testCenterId = response.body.data.id;
    });
  });

  describe('GET /api/exams/centers', () => {
    it('should return all exam centers', async () => {
      const response = await request(app)
        .get('/api/exams/centers')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
    });
  });

  describe('POST /api/exams/assign', () => {
    it('should assign candidates to exam center', async () => {
      if (testSessionId && testCenterId) {
        const response = await request(app)
          .post('/api/exams/assign')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            sessionId: testSessionId,
            centerId: testCenterId,
          });

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('assigned');
      }
    });
  });

  describe('GET /api/exams/my-assignment', () => {
    it('should return candidate exam assignment', async () => {
      const response = await request(app)
        .get('/api/exams/my-assignment')
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(response.status).toBe(200);
    });
  });
});

describe('Results API', () => {
  describe('GET /api/results/my-result', () => {
    it('should return candidate result', async () => {
      const response = await request(app)
        .get('/api/results/my-result')
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/results', () => {
    it('should return all results for admin', async () => {
      const response = await request(app)
        .get('/api/results')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
    });
  });
});

describe('Notifications API', () => {
  describe('GET /api/notifications', () => {
    it('should return user notifications', async () => {
      const response = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/notifications/unread', () => {
    it('should return unread notifications', async () => {
      const response = await request(app)
        .get('/api/notifications/unread')
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(response.status).toBe(200);
    });
  });

  describe('PATCH /api/notifications/:id/read', () => {
    it('should mark notification as read', async () => {
      const notificationsRes = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${candidateToken}`);
      const notificationId = notificationsRes.body.data[0]?.id;

      if (notificationId) {
        const response = await request(app)
          .patch(`/api/notifications/${notificationId}/read`)
          .set('Authorization', `Bearer ${candidateToken}`);

        expect(response.status).toBe(200);
      }
    });
  });

  describe('PATCH /api/notifications/read-all', () => {
    it('should mark all notifications as read', async () => {
      const response = await request(app)
        .patch('/api/notifications/read-all')
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(response.status).toBe(200);
    });
  });
});