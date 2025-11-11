const request = require('supertest');
const app = require('../index');

describe('Integration Tests', () => {
  describe('API Flow Tests', () => {
    test('should complete a full API interaction flow', async () => {
      // First, check health
      const healthResponse = await request(app).get('/health');
      expect(healthResponse.status).toBe(200);
      expect(healthResponse.body.status).toBe('healthy');

      // Then, get the home page
      const homeResponse = await request(app).get('/');
      expect(homeResponse.status).toBe(200);
      expect(homeResponse.body.message).toBe('Hello World!');

      // Finally, greet a user
      const greetResponse = await request(app).get('/api/greet/TestUser');
      expect(greetResponse.status).toBe(200);
      expect(greetResponse.body.message).toBe('Hello, TestUser!');
    });
  });

  describe('Performance Tests', () => {
    test('should handle multiple concurrent requests', async () => {
      const requests = Array(10).fill(null).map((_, index) => 
        request(app).get(`/api/greet/User${index}`)
      );

      const responses = await Promise.all(requests);

      responses.forEach((response, index) => {
        expect(response.status).toBe(200);
        expect(response.body.message).toBe(`Hello, User${index}!`);
      });
    });

    test('should respond quickly to health checks', async () => {
      const startTime = Date.now();
      await request(app).get('/health');
      const endTime = Date.now();

      const responseTime = endTime - startTime;
      expect(responseTime).toBeLessThan(100); // Should respond in less than 100ms
    });
  });

  describe('Error Handling Tests', () => {
    test('should handle invalid routes gracefully', async () => {
      const invalidRoutes = [
        '/invalid',
        '/api/invalid',
        '/api/greet',
        '/health/check'
      ];

      for (const route of invalidRoutes) {
        const response = await request(app).get(route);
        expect(response.status).toBe(404);
      }
    });
  });

  describe('Content Type Tests', () => {
    test('all endpoints should return JSON', async () => {
      const endpoints = ['/', '/health', '/api/greet/Test'];

      for (const endpoint of endpoints) {
        const response = await request(app).get(endpoint);
        expect(response.type).toMatch(/json/);
      }
    });
  });
});
