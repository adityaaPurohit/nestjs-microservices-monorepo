<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# NestJS User and Document Management Microservices

A comprehensive microservices architecture built with NestJS for user and document management with enterprise-grade features.

## 🏗️ Architecture Overview

This project implements a true microservices architecture with the following services:

### **Services**
- **Auth Service** (Port 3001): Authentication and authorization
- **User Service** (Port 3002): User management and profiles
- **Document Service** (Port 3003): Document CRUD operations
- **Ingestion Service** (Port 3004): Document upload and processing

### **Infrastructure**
- **PostgreSQL**: Primary database
- **Kafka**: Message broker for inter-service communication
- **Docker**: Containerization and orchestration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- npm 8+

### Installation

1. **Clone and Install Dependencies**
```bash
git clone <repository-url>
cd nest-user-doc-microservices
npm run install:all
```

2. **Environment Setup**
```bash
cp env.example .env
# Edit .env with your configuration
```

3. **Start Services with Docker**
```bash
npm run docker:up
```

### Development

**Start All Services in Development Mode**
```bash
npm run start:dev
```

**Start Individual Services**
```bash
npm run start:auth
npm run start:user
npm run start:document
npm run start:ingestion
```

## 📁 Project Structure

```
nest-user-doc-microservices/
├── apps/                          # Microservices
│   ├── auth-service/              # Authentication service
│   ├── user-service/              # User management service
│   ├── document-service/          # Document management service
│   └── ingestion-service/         # Document ingestion service
├── libs/                          # Shared libraries
│   ├── common/                    # Common utilities, DTOs, enums
│   ├── database/                  # Database entities and config
│   └── kafka/                     # Kafka configuration
├── docker-compose.yml             # Service orchestration
└── package.json                   # Workspace configuration
```

## 🔧 API Endpoints

### Auth Service (Port 3001)
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/profile` - Get user profile

### User Service (Port 3002)
- `GET /api/v1/users` - Get all users (Admin)
- `POST /api/v1/users` - Create user (Admin)
- `GET /api/v1/users/:id` - Get user by ID (Admin)
- `PUT /api/v1/users/:id` - Update user (Admin)
- `DELETE /api/v1/users/:id` - Delete user (Admin)
- `PUT /api/v1/users/:id/role` - Update user role (Admin)
- `GET /api/v1/users/profile` - Get own profile

### Document Service (Port 3003)
- `GET /api/v1/documents` - Get all documents
- `POST /api/v1/documents` - Create document
- `GET /api/v1/documents/:id` - Get document by ID
- `PUT /api/v1/documents/:id` - Update document
- `DELETE /api/v1/documents/:id` - Delete document
- `POST /api/v1/documents/:id/upload` - Upload document file

### Ingestion Service (Port 3004)
- `POST /api/v1/ingestion/upload` - Upload and process documents
- `GET /api/v1/ingestion/status/:id` - Get processing status
- `GET /api/v1/ingestion/documents` - Get processed documents

## 🔐 Authentication & Authorization

### JWT Authentication
- Access tokens (24h expiry)
- Refresh tokens (7d expiry)
- Role-based access control

### User Roles
- **VIEWER**: Read-only access to documents
- **EDITOR**: Can create and edit documents
- **ADMIN**: Full system access

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(20) DEFAULT 'VIEWER',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP
);
```

### Documents Table
```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_path VARCHAR(500),
  file_size BIGINT,
  mime_type VARCHAR(100),
  status VARCHAR(20) DEFAULT 'PENDING',
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🐳 Docker Deployment

### **Build and Run**
```bash
# Build all services
npm run docker:build

# Start all services
npm run docker:up

# View logs
npm run docker:logs

# Stop all services
npm run docker:down
```

### Service URLs
- Auth Service: http://localhost:3001
- User Service: http://localhost:3002
- Document Service: http://localhost:3003
- Ingestion Service: http://localhost:3004
- PostgreSQL: localhost:5432
- Kafka: localhost:9092

## 🧪 Testing

### Run All Tests
```bash
npm run test
```

### Run Tests for Specific Service
```bash
npm run test --workspace=auth-service
npm run test --workspace=user-service
npm run test --workspace=document-service
npm run test --workspace=ingestion-service
```

## 📊 Monitoring & Logging

- **Winston**: Structured logging
- **Health Checks**: Service health monitoring
- **Error Tracking**: Comprehensive error handling

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Role-based Access Control**: Granular permissions
- **Input Validation**: Request validation
- **CORS Protection**: Cross-origin resource sharing
- **Helmet**: Security headers
- **Rate Limiting**: API rate limiting

## 🚀 Production Deployment

### Environment Variables
```bash
# Database
DATABASE_HOST=your-db-host
DATABASE_PORT=5432
DATABASE_NAME=your-db-name
DATABASE_USERNAME=your-db-user
DATABASE_PASSWORD=your-db-password

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Kafka
KAFKA_BROKERS=your-kafka-brokers

# CORS
ALLOWED_ORIGINS=https://your-frontend-domain.com
```

### Docker Production
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy to production
docker-compose -f docker-compose.prod.yml up -d
```
