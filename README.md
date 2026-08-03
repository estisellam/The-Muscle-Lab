# The-Muscle-Lab

The Muscle Lab is a full-stack gym management web application that combines a modern React frontend with an Express + MySQL backend. The system supports public browsing, member dashboards, class registration, membership management, and admin tools.

## Project Overview

### Main Features
- Public landing page with membership plans and authentication
- Member dashboard with class tracking, membership status, and AI coaching suggestions
- Interactive class calendar for browsing upcoming sessions
- Admin dashboard with business insights and overview metrics
- Class registration, membership purchase, profile management, and user administration

### Tech Stack
- Frontend: React, Vite, React Router, Lucide icons
- Backend: Node.js, Express, MySQL, JWT authentication
- Styling: Custom CSS modules and component-based styling

## Project Structure
- client/ — React frontend application
- server/ — Express backend and API services
- server/database/ — SQL schema and seed data
- server/uploads/ — uploaded profile images

## Setup Instructions

### 1. Install dependencies
Open two terminals:

Backend:
```bash
cd server
npm install
```

Frontend:
```bash
cd client
npm install
```

### 2. Configure the database
Make sure MySQL is installed and running, then import the database files:

```bash
mysql -u root -p
```

Inside MySQL:
```sql
CREATE DATABASE the_muscle_lab;
USE the_muscle_lab;
SOURCE server/database/schema.sql;
SOURCE server/database/seed.sql;
```

### 3. Configure environment variables
The backend expects a .env file in the server folder with values similar to:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root1234
DB_NAME=the_muscle_lab
PORT=3000
JWT_SECRET=musclelab-secret-key
```

### 4. Run the application
Backend:
```bash
cd server
npm run dev
```

Frontend:
```bash
cd client
npm run dev
```

The backend will run on http://localhost:3000 and the frontend on http://localhost:5173 (or the next available Vite port if 5173 is busy).

## Application Flow
- Visitors can browse the site and view membership plans
- Members can log in, view their dashboard, register for classes, and manage their profile
- Admins can access management pages and monitor the system overview

## Added Enhancements
- AI Coach recommendations on the member dashboard
- Interactive class calendar for planning workouts
- Admin dashboard with overview cards and performance-style metrics
- Real-time-friendly class and registration experience

## Notes
- If the frontend reports a port conflict, Vite will automatically use the next available port.
- If the backend fails to connect to MySQL, verify the database credentials and that MySQL is running.
