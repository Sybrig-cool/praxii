# Praxii

This project is composed of a Spring Boot backend, an Angular frontend and a MongoDB database. Docker Compose is used to run the database and backend services while the Angular application is served using the Angular CLI.

## Starting MongoDB and Backend

1. Ensure you have Docker and Docker Compose installed.
2. From the repository root run:

```bash
docker compose up
```

This command starts two containers defined in `docker-compose.yml`:
- **mongodb** exposes port `27017` and stores its data in `./mongodb_data`.
- **backend** exposes port `8080` and connects to the MongoDB container.

Once both containers are running the backend is accessible on `http://localhost:8080`.

## Starting the Frontend

The frontend is an Angular application. To run it locally you need Node.js and the Angular CLI.

```bash
cd frontend
npm install     # only required the first time
npm start       # runs `ng serve`
```

The application will be served at `http://localhost:4200` and automatically reload when source files change.

## Running Backend Tests

JUnit tests can be executed using Maven:

```bash
cd backend
./mvnw test
```

## Running Frontend Tests

Karma/Jasmine tests can be run through the Angular CLI:

```bash
cd frontend
npm test
```

