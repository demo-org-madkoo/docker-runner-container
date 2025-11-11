const request = require('supertest');
const app = require('../index');

describe('Express App Tests', () => {
  let server;

  beforeAll(() => {
    // Don't start the server during tests
    // We'll use supertest's request directly
  });

  afterAll((done) => {
    // Close server if it was started
    if (server) {
      server.close(done);
    } else {
      done();
    }
  });

  describe('GET /', () => {
    test('should return hello world message', async () => {
      const response = await request(app).get('/');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Hello World!');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('environment');
    });

    test('should return valid JSON', async () => {
      const response = await request(app).get('/');
      
      expect(response.type).toBe('application/json');
    });

    test('should have valid timestamp format', async () => {
      const response = await request(app).get('/');
      
      const timestamp = new Date(response.body.timestamp);
      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.toString()).not.toBe('Invalid Date');
    });
  });

  describe('GET /health', () => {
    test('should return healthy status', async () => {
      const response = await request(app).get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'healthy' });
    });
  });

  describe('GET /api/greet/:name', () => {
    test('should greet user by name', async () => {
      const name = 'Alice';
      const response = await request(app).get(`/api/greet/${name}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', `Hello, ${name}!`);
      expect(response.body).toHaveProperty('timestamp');
    });

    test('should handle different names', async () => {
      const names = ['Bob', 'Charlie', 'David'];
      
      for (const name of names) {
        const response = await request(app).get(`/api/greet/${name}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe(`Hello, ${name}!`);
      }
    });

    test('should handle special characters in name', async () => {
      const name = 'John-Doe';
      const response = await request(app).get(`/api/greet/${name}`);
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe(`Hello, ${name}!`);
    });
  });

  describe('404 Handler', () => {
    test('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/unknown-route');
      
      expect(response.status).toBe(404);
    });
  });
});
