<div align="center">
  <img src="./frontend/public/favicon.ico" alt="SmartPrep Logo" width="100" height="100">
  
  # 🚀 SmartPrep
  **The Ultimate Adaptive Study Planner & Exam Analytics Platform**

  [![Java](https://img.shields.io/badge/Java-21-orange.svg?style=flat-square&logo=openjdk)](https://openjdk.org/)
  [![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4.4-brightgreen.svg?style=flat-square&logo=springboot)](https://spring.io/projects/spring-boot)
  [![React](https://img.shields.io/badge/React-18.3-blue.svg?style=flat-square&logo=react)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite-6.0-646CFF.svg?style=flat-square&logo=vite)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC.svg?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791.svg?style=flat-square&logo=postgresql)](https://www.postgresql.org/)

  <p align="center">
    <b>Empowering students to achieve academic excellence through AI-driven planning and deep performance insights.</b>
    <br />
    <a href="#-key-features">Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-getting-started">Installation</a> •
    <a href="#-deployment">Deployment</a>
  </p>
</div>

---

## 🌟 Overview

SmartPrep is a high-performance, AI-integrated study ecosystem designed to transform how students prepare for exams. By combining **Adaptive Scheduling** with **Real-time Analytics**, SmartPrep doesn't just tell you *what* to study; it dynamically optimizes your path to mastery.

## ✨ Key Features

- 🧠 **Adaptive Study Engine**: Dynamically generates schedules based on your syllabus weightage, exam dates, and daily bandwidth.
- 📉 **Precision Analytics**: Visualize your readiness with interactive heatmaps, trend lines, and subject mastery radars.
- ⚡ **Virtual Threads (Project Loom)**: Backend optimized for high concurrency using Java 21 virtual threads.
- 🔄 **Intelligent Backlog Management**: Missed a session? The system automatically recalibrates your plan without overwhelming you.
- 🧪 **Mock Test Simulator**: Timed, subject-specific mock tests with instant feedback and AI-driven weak-point analysis.
- 🛡️ **Secure Auth**: Industry-standard security using **JWT** and **Google OAuth 2.0**.
- 🌓 **Premium UI/UX**: A responsive, high-performance interface built with **Tailwind CSS** and **Framer Motion**.

## 🛠️ Tech Stack

### Backend (Robust & Scalable)
- **Java 21**: Leveraging Virtual Threads for peak performance.
- **Spring Boot 3.4.4**: The foundation of our micro-service ready architecture.
- **Spring Security & JWT**: Stateless authentication and role-based access control.
- **PostgreSQL**: Reliable relational data storage.
- **Spring Data JPA**: Efficient database abstraction.
- **Redis (Optional)**: Support for high-speed caching (Simple cache used by default).
- **OpenAPI 3 (Swagger)**: Comprehensive API documentation.

### Frontend (Modern & Reactive)
- **React 18.3**: Modern component-based architecture.
- **Vite 6.0**: Next-generation frontend tooling.
- **Zustand**: Lightweight, high-performance state management.
- **React Query**: Powerful asynchronous state management and data fetching.
- **Framer Motion**: Smooth, cinematic UI animations.
- **Recharts**: Data-driven visualization components.
- **Lucide Icons**: Scalable vector icons.

---

## 📁 Project Structure

```text
SmartPrep/
├── backend/                   # Spring Boot Application
│   ├── src/main/java          # Business logic (Services, Controllers, Models)
│   ├── src/main/resources     # Config (application.properties)
│   └── pom.xml                # Maven configuration
│
├── frontend/                  # React Application
│   ├── src/
│   │   ├── components/        # Atomized UI components
│   │   ├── pages/             # Dashboard, Planner, Auth, etc.
│   │   ├── services/          # API & Business services
│   │   ├── store/             # Zustand state management
│   │   └── styles/            # Global CSS & Tailwind config
│   └── vite.config.js         # Build & Proxy configuration
```

---

## 🚀 Getting Started

### 📋 Prerequisites
- **JDK 21**
- **Node.js 18+**
- **Maven 3.9+**
- **PostgreSQL 15+**

### 1️⃣ Database Setup
Create a database named `smartprep_db` in your PostgreSQL instance.
```sql
CREATE DATABASE smartprep_db;
```

### 2️⃣ Backend Configuration
Update `backend/src/main/resources/application.properties` with your credentials:
```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 3️⃣ Run Application
**Start Backend:**
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

**Start Frontend:**
```bash
cd frontend
npm install
npm run dev
```

The app will be live at `http://localhost:5173` and the API at `http://localhost:8081`.

---

## 🌐 Deployment

- **Frontend**: Optimized for **Vercel** or **Netlify**. Includes `vercel.json` for SPA routing support.
- **Backend**: Container-ready. Can be deployed via **Docker** or as a standalone JAR to **AWS**, **Railway**, or **Render**.

---

<div align="center">
  <b>SmartPrep — Study Smarter, Prepare Faster, Succeed Better.</b>
  <br>
  <sub>Built with passion for the modern student.</sub>
</div>

