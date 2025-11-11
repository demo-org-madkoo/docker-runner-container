# Testing Guide

This project includes comprehensive test suites to ensure code quality and functionality.

## Test Structure

```
src/
├── __tests__/
│   ├── app.test.js          # Unit tests for Express routes
│   └── integration.test.js   # Integration tests for API flows
├── index.js                  # Main application file
└── package.json              # Dependencies and scripts
```

## Running Tests

### Run all tests
```bash
cd src
npm test
```

### Run tests in watch mode
```bash
npm test -- --watch
```

### Run specific test file
```bash
npm test -- app.test.js
```

### Run integration tests only
```bash
npm test -- --testPathPattern=integration
```

### Generate coverage report
```bash
npm test -- --coverage
```

## Test Coverage

The project maintains a minimum coverage threshold of 70% for:
- Branches
- Functions
- Lines
- Statements

Coverage reports are generated in the `coverage/` directory.

## Test Types

### Unit Tests (`app.test.js`)
Tests individual endpoints and functionality:
- `GET /` - Home endpoint
- `GET /health` - Health check endpoint
- `GET /api/greet/:name` - Greeting endpoint with parameters
- 404 handling for unknown routes

### Integration Tests (`integration.test.js`)
Tests complete API flows and scenarios:
- Full API interaction flows
- Concurrent request handling
- Error handling
- Content type validation
- Performance benchmarks

## CI/CD Integration

Tests are automatically run in GitHub Actions on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches
- Manual workflow dispatch

The CI pipeline includes:
1. **Dependency Installation** - Shared across all jobs
2. **Linting** - Code quality checks
3. **Unit Tests** - Run on Node.js 16, 18, and 20
4. **Integration Tests** - Full API flow validation
5. **Build Summary** - Aggregated results

## Writing New Tests

When adding new features, ensure you:
1. Add unit tests for new endpoints/functions
2. Add integration tests for new API flows
3. Maintain coverage thresholds
4. Use descriptive test names
5. Follow the existing test patterns

Example:
```javascript
describe('New Feature', () => {
  test('should do something specific', async () => {
    const response = await request(app).get('/new-endpoint');
    expect(response.status).toBe(200);
  });
});
```

## Troubleshooting

### Port already in use
If you see `EADDRINUSE` errors, ensure no other instance of the app is running:
```bash
lsof -ti:3000 | xargs kill
```

### Module not found
Reinstall dependencies:
```bash
npm install
```

### Tests timing out
Increase Jest timeout in test files:
```javascript
jest.setTimeout(10000); // 10 seconds
```
