import * as request from 'supertest';

const BASE_URL = 'http://localhost:3024/';

describe('Auth routes', () => {
  const api = request(BASE_URL);

  describe('POST /api/auth/signup', () => {
    test('OK response', async () => {
      const payload = {
        firstname: 'test',
        lastname: 'test',
        username: 'test',
        phone: '0123456789',
        email: 'test@test.com',
        password: 'test1234',
      };
      const resp = await api.post('api/auth/signup').send(payload);
      expect(resp.status).toBe(201);
      expect(resp.body).toBeDefined();
      expect(resp.body).toContain('token');
    });
  });

  describe('POST /api/auth/login', () => {
    test('OK response', async () => {
      const payload = {
        username: 'test',
        password: 'test1234',
      };
      const resp = await api.post('api/auth/login').send(payload);
      expect(resp.status).toBe(201);
      expect(resp.body).toBeDefined();
      expect(resp.body).toContain('token');
    });
  });

  // describe('/api/auth/logout', async () => {
  //   const req = await api.delete('/api/auth/login');
  //   req.headers['Authorization'] = 'Token ABCD';
  //   expect(resp.status).toBe(201);
  //   expect(resp.body).toBeDefined();
  //   expect(resp.body).toContain('token');
  // });
});
