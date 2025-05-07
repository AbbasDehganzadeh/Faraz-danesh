import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { AuthService } from '../../src/auth/auth.service';
import * as request from 'supertest';

describe('Auth module', () => {
  let moduleFixture: TestingModule;
  let app: INestApplication;
  let authservice: AuthService;

  beforeAll(async () => {
    process.env.environment = 'test';
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    authservice = moduleFixture.get<AuthService>(AuthService);
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    process.env.environment = 'dev';
  });

  describe('Auth routes', () => {
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

      test('BAD_REQUEST response', async () => {
        // duplicate data
        // test Not Implemented
        // const payload = {
        //   firstname: 'test',
        //   lastname: 'test',
        //   username: 'test',
        //   phone: '0123456789',
        //   email: 'test@test.com',
        //   password: 'test1234',
        // };
        // const resp = await request(app.getHttpServer())
        //   .post('/api/auth/signup')
        //   .send(payload);
        // expect(resp.status).toBe(400);
        // expect(resp.body).toBeDefined();
        // expect(resp.body['message']).toBeTruthy();
      });

      test('BAD_REQUEST response1', async () => {
        // missing data
        const payload = {
          firstname: 'test',
          lastname: 'test',
          phone: '0123456789',
        };
        const resp = await request(app.getHttpServer())
          .post('/api/auth/signup')
          .send(payload);
        expect(resp.status).toBe(400);
        expect(resp.body).toBeDefined();
        expect(resp.body['message']).toBeTruthy();
      });
    });

    describe('POST /api/auth/login', () => {
      test('OK response', async () => {
        await authservice.signup({
          firstname: 'abcd',
          lastname: 'abcd',
          username: 'abcd',
          phone: '0987654321',
          email: 'abcd@test.com',
          password: 'abcd1234',
          role: 1,
        });

        const payload = {
          username: 'abcd',
          password: 'abcd1234',
        };
        const resp = await request(app.getHttpServer())
          .post('/api/auth/login')
          .send(payload);
        expect(resp.status).toBe(201);
        expect(resp.body).toBeDefined();
        expect(resp.body['access_token']).toBeTruthy();
      });

      test('BAD_REQUEST response', async () => {
        // missing data
        const payload = {};
        const resp = await request(app.getHttpServer())
          .post('/api/auth/login')
          .send(payload);
        expect(resp.status).toBe(400);
        expect(resp.body).toBeDefined();
        expect(resp.body['message']).toBeTruthy();
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
