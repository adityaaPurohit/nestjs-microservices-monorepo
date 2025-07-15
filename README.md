# NestJS Microservices Monorepo

This repo contains a modular backend system using NestJS, broken into four independent microservices:

Services
--------------------------
--> Auth Service – Handles login, registration, JWT auth.

--> User Service – Manages users, roles (admin/editor/viewer), and profile actions.

--> Document Service – Manages CRUD for documents.

--> Ingestion Service – Accepts file uploads and processes them.


Built using:
--------------------------
--> NestJS, PostgreSQL, Kafka, TypeORM, Docker, Jest


Folder Sructure
--------------------------
apps/
  ├─ auth-service
  ├─ user-service
  ├─ document-service
  └─ ingestion-service

libs/            # Shared DTOs, entities, enums, utils, etc.
docker-compose.yml


************* Getting Started *************
-------------------------------------------

Prerequisites
--------------------------
--> Node.js (v18+)

--> Docker (for DB/Kafka)

--> npm or yarn


Setup the project
--------------------------

--> git clone <repo-url>
--> cd <repo>
--> npm install
--> docker-compose up -d postgres kafka zookeeper


Run Project (Chosse any one)
--------------------------
--> Option A: PowerShell script (if on Windows)
   -> .\start-local-dev.ps1 all

--> Option B: Manual (any OS)
    Open a terminal for each service:

    Auth:- cd apps/auth-service && npm install && npm run start:dev

    User:- cd apps/user-service && npm install && npm run start:dev

    Document:- cd apps/document-service && npm install && npm run start:dev

    Ingestion:- cd apps/ingestion-service && npm install && npm run start:dev


Testing
--------------------------
--> Test files :-  All test cases are in `.spec.ts` files next to the code in all the components(controller/service level)
--> For Testrunner and mocking data used JEST


Run Tests
--------------------------
--> All services: `npm run test` (from root)
--> Single service: `cd apps/<service> && npm run test`


Development Tips
--------------------------

--> Hot reload: All services use `ts-node` for live reload in dev
--> Troubleshooting: See `LOCAL_DEVELOPMENT.md` for common issues (ports, DB, Kafka)
--> Useful commands:
  - `docker-compose logs <service>` – View logs
  - `docker-compose down` – Stop all
  - `npm run lint` – Lint code
  - `npm run format` – Format code


Docker & Production
--------------------------

--> To build and run all services in Docker:
  -> docker-compose up --build
  -> Each service exposes its port (3001-3004)


I have added env-template.txt in root for env setup.