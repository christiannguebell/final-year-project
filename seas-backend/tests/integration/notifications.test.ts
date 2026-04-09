import request from 'supertest';
import app from '../../src/app';

describe('Notifications API', () => {
  let candidateToken: string;
  let testNotificationId: string;

  beforeAll(async () => {
    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@seas.com', password: 'admin123' });
    adminToken = adminLogin.body.data?.accessToken;

    const candidateRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: `notif-candidate-${Date.now()}@example.com`,
        password: 'password123',
        firstName: 'Notification',
        lastName: 'User',
      });
    candidateToken = candidateRes.body.data?.accessToken;
  });

  describe('GET /api/notifications', () => {
    it('should return user notifications', async () => {
      const response = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app).get('/api/notifications');

      expect(response.status).toBe(401);
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${candidateToken}`)
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('pagination');
    });
  });

  describe('GET /api/notifications/unread', () => {
    it('should return unread notifications', async () => {
      const response = await request(app)
        .get('/api/notifications/unread')
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/notifications/:id', () => {
    it('should return notification by id', async () => {
      const notificationsRes = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${candidateToken}`);
      testNotificationId = notificationsRes.body.data[0]?.id;

      if (testNotificationId) {
        const response = await request(app)
          .get(`/api/notifications/${testNotificationId}`)
          .set('Authorization', `Bearer ${candidateToken}`);

        expect(response.status).toBe(200);
      }
    });

    it('should return 404 for non-existent notification', async () => {
      const response = await request(app)
        .get('/api/notifications/non-existent-id')
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /api/notifications/:id/read', () => {
    it('should mark notification as read', async () => {
      const notificationsRes = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${candidateToken}`);
      const notifId = notificationsRes.body.data[0]?.id;

      if (notifId) {
        const response = await request(app)
          .patch(`/api/notifications/${notifId}/read`)
          .set('Authorization', `Bearer ${candidateToken}`);

        expect(response.status).toBe(200);
        expect(response.body.data.status).toBe('read');
      }
    });

    it('should return 404 for non-existent notification', async () => {
      const response = await request(app)
        .patch('/api/notifications/non-existent-id/read')
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /api/notifications/read-all', () => {
    it('should mark all notifications as read', async () => {
      const response = await request(app)
        .patch('/api/notifications/read-all')
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('marked');
    });
  });

  describe('DELETE /api/notifications/:id', () => {
    it('should delete notification', async () => {
      const notificationsRes = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${candidateToken}`);
      const notifId = notificationsRes.body.data[0]?.id;

      if (notifId) {
        const response = await request(app)
          .delete(`/api/notifications/${notifId}`)
          .set('Authorization', `Bearer ${candidateToken}`);

        expect(response.status).toBe(200);
      }
    });

    it('should return 404 for non-existent notification', async () => {
      const response = await request(app)
        .delete('/api/notifications/non-existent-id')
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(response.status).toBe(404);
    });
  });
});

describe('Notifications (Admin) API', () => {
  let adminToken: string;

  beforeAll(async () => {
    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@seas.com', password: 'admin123' });
    adminToken = adminLogin.body.data?.accessToken;
  });

  describe('POST /api/notifications/broadcast', () => {
    it('should broadcast notification to multiple users', async () => {
      const usersRes = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`);
      const userIds = usersRes.body.data.slice(0, 3).map((u: any) => u.id);

      if (userIds.length > 0) {
        const response = await request(app)
          .post('/api/notifications/broadcast')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            type: 'system',
            title: 'Broadcast Notification',
            message: 'This is a broadcast message',
            channel: 'in_app',
            userIds,
          });

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('sent');
      }
    });

    it('should broadcast to all users', async () => {
      const response = await request(app)
        .post('/api/notifications/broadcast')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          type: 'system',
          title: 'Global Notification',
          message: 'This is a global message',
          channel: 'email',
        });

      expect(response.status).toBe(200);
    });

    it('should return 403 for non-admin', async () => {
      const candidateRes = await request(app)
        .post('/api/auth/register')
        .send({
          email: `notif-broad-${Date.now()}@example.com`,
          password: 'password123',
          firstName: 'Broadcast',
          lastName: 'User',
        });
      const token = candidateRes.body.data?.accessToken;

      const response = await request(app)
        .post('/api/notifications/broadcast')
        .set('Authorization', `Bearer ${token}`)
        .send({
          type: 'system',
          title: 'Test',
          message: 'Test',
        });

      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/notifications/all', () => {
    it('should return all notifications for admin', async () => {
      const response = await request(app)
        .get('/api/notifications/all')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter by user id', async () => {
      const usersRes = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`);
      const userId = usersRes.body.data[0]?.id;

      if (userId) {
        const response = await request(app)
          .get('/api/notifications/all')
          .set('Authorization', `Bearer ${adminToken}`)
          .query({ userId });

        expect(response.status).toBe(200);
      }
    });
  });
});