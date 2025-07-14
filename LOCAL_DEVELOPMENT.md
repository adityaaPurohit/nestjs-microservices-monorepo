# 🚀 Local Development Guide

This guide shows you how to run your NestJS microservices locally while keeping Docker infrastructure running in the background.

## 📋 Prerequisites

- Docker Desktop running
- Node.js 18+ installed
- npm or yarn package manager

## 🐳 Step 1: Start Docker Infrastructure

Keep your database and Kafka running in Docker:

```bash
docker-compose up -d postgres zookeeper kafka
```

This starts:
- PostgreSQL on port 5434
- Kafka on port 9092
- Zookeeper (internal)

## 🔧 Step 2: Run Services Locally

### Option A: Using the PowerShell Script (Recommended)

```powershell
# Start a specific service
.\start-local-dev.ps1 auth
.\start-local-dev.ps1 user
.\start-local-dev.ps1 document
.\start-local-dev.ps1 ingestion

# Start all services in separate windows
.\start-local-dev.ps1 all
```

### Option B: Manual Setup

For each service, open a new terminal and run:

```bash
# Auth Service (Port 3001)
cd apps/auth-service
npm install
npm run start:dev

# User Service (Port 3002)
cd apps/user-service
npm install
npm run start:dev

# Document Service (Port 3003)
cd apps/document-service
npm install
npm run start:dev

# Ingestion Service (Port 3004)
cd apps/ingestion-service
npm install
npm run start:dev
```

## 🌐 Service Endpoints

Once running, your services will be available at:

- **Auth Service**: http://localhost:3001/api/v1
- **User Service**: http://localhost:3002/api/v1
- **Document Service**: http://localhost:3003/api/v1
- **Ingestion Service**: http://localhost:3004/api/v1

## 🔍 Environment Variables

The services use these environment variables for local development:

```bash
NODE_ENV=development
PORT=3001-3004 (depending on service)
DATABASE_HOST=localhost
DATABASE_PORT=5434
DATABASE_NAME=nest_user_doc_db
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
KAFKA_BROKERS=localhost:9092
```

## 🛠️ Development Workflow

1. **Start Docker infrastructure**: `docker-compose up -d postgres zookeeper kafka`
2. **Start services locally**: Use the PowerShell script or manual commands
3. **Make changes**: Services will auto-reload on file changes
4. **Test endpoints**: Use Postman, curl, or your preferred API client

## 🐛 Troubleshooting

### Port Conflicts
- If you get port conflicts, check what's running: `netstat -ano | findstr :3001`
- Kill processes if needed or change ports in the script

### Database Connection Issues
- Ensure PostgreSQL is running: `docker-compose ps`
- Check if port 5434 is accessible: `telnet localhost 5434`

### Kafka Connection Issues
- Ensure Kafka is running: `docker-compose logs kafka`
- Check if port 9092 is accessible: `telnet localhost 9092`

### TypeScript Path Issues
- Make sure you're in the correct directory
- Check that `libs/` folder exists in the project root
- Verify `tsconfig.json` path mappings are correct

## 📝 Useful Commands

```bash
# Check Docker services
docker-compose ps

# View logs
docker-compose logs postgres
docker-compose logs kafka

# Stop all services
docker-compose down

# Restart infrastructure
docker-compose restart postgres zookeeper kafka
```

## 🎯 Benefits of Local Development

- **Fast feedback**: Hot reload on file changes
- **Easy debugging**: Use VS Code debugger
- **Better IDE support**: Full IntelliSense and refactoring
- **Faster builds**: No Docker build time
- **Resource efficient**: Uses less memory than Docker containers

Happy coding! 🎉 