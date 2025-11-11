# Hello World Node.js Demo

A simple Express.js application demonstrating a basic Hello World server with common dependencies.

## Features

- Express.js web server
- Environment variable configuration with dotenv
- Multiple endpoints (root, health check, parameterized greeting)
- Development tools (nodemon, eslint, jest)

## Installation

```bash
npm install
```

## Running the Application

### Development mode (with auto-reload)
```bash
npm run dev
```

### Production mode
```bash
npm start
```

## Available Endpoints

- `GET /` - Returns a Hello World message with timestamp
- `GET /health` - Health check endpoint
- `GET /api/greet/:name` - Personalized greeting

## Scripts

- `npm start` - Start the server
- `npm run dev` - Start with nodemon for development
- `npm test` - Run tests with Jest
- `npm run lint` - Lint code with ESLint

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
