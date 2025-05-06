import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import * as request from 'supertest';

describe('Auth module', () => {
  const BASE_URL = 'http://localhost:3024/';
  let app: INestApplication;

  beforeAll(async () => {
    process.env.environment = 'test';
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    process.env.environment = 'dev';
  });

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
        const resp = await request(app.getHttpServer())
          .post('/api/auth/signup')
          .send(payload);
        expect(resp.status).toBe(201);
        expect(resp.body).toBeDefined();
        expect(resp.body['access_token']).toBeTruthy();
      });
    });

    describe('POST /api/auth/login', () => {
      test('OK response', async () => {
        const payload = {
          username: 'test',
          password: 'test1234',
        };
        const resp = await request(app.getHttpServer())
          .post('/api/auth/login')
          .send(payload);
        expect(resp.status).toBe(201);
        expect(resp.body).toBeDefined();
        expect(resp.body['access_token']).toBeTruthy();
      });
    });

    describe('/api/auth/logout', () => {
      test('UnAuthorized response', async () => {
        const resp = await request(app.getHttpServer())
          .delete('/api/auth/logout')
          .send();
        expect(resp.status).toBe(401);
        expect(resp.body).toBeDefined();
        expect(resp.body).toBeTruthy();
      });
    });
  });
});
