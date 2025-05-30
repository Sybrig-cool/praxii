# Praxii 🌱

Praxii is a full-stack personal transformation app that combines habit tracking, journaling, and AI-powered spiritual insight. Built to help users stay mindful, retain energy, and grow emotionally, mentally, and spiritually.

---

## 🛠️ Tech Stack

- **Frontend**: Angular
- **Backend**: Spring Boot (Java)
- **Database**: MongoDB
- **Containerization**: Docker + Docker Compose
- **AI Insights**: GPT/Ollama-based integration (Coming Soon)

---

## 📁 Folder Structure

praxii/
├── backend/ # Spring Boot backend
├── frontend/ # Angular frontend
├── mongo_data/ # Local MongoDB data (ignored in Git)
├── docker-compose.yml # App-level orchestration
├── .env.example # Example environment config
└── README.md


---

## 🚀 Getting Started (Local Dev)

### 🔧 Prerequisites

- Docker & Docker Compose installed
- Java + Node + Angular CLI (for local dev builds)
- MongoDB (if running without Docker)

---

### ▶️ Quick Start with Docker

```bash
docker-compose up --build

This will:

Spin up MongoDB
Run the Spring Boot backend
Serve Angular frontend (if included in Dockerfile)

🧪 Run Frontend Locally
cd frontend
npm install
ng serve

🧪 Run Backend Locally
cd backend
./mvnw spring-boot:run


🔐 Environment Variables

Use a .env file in the root with the following:

MONGO_URL=mongodb://localhost:27017/praxii
JWT_SECRET=your-jwt-secret
PORT=8080

📌 License

MIT License


---

## 🔐 Step 2: `.env.example`

Create a file named `.env.example` in the root and paste:

```env
# MongoDB
MONGO_URL=mongodb://localhost:27017/praxii

# Spring Boot
JWT_SECRET=your-jwt-secret
PORT=8080

# Angular
API_URL=http://localhost:8080/api

