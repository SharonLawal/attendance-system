# Attendance System Backend

Node.js/Express API backend for the attendance management system.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   - Copy `.env.example` to `.env`
   - Update values as needed:
   ```bash
   cp .env.example .env
   ```

3. **Install MongoDB:**
   - Download and install from [mongodb.com](https://www.mongodb.com/try/download/community)
   - Start MongoDB service

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Seed database (optional):**
   ```bash
   npm run seed
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/signup` - Register
- `GET /api/auth/profile` - Get user profile (requires auth)

### Courses
- `GET /api/courses` - List courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses` - Create course (Lecturer/Admin only)

### Attendance
- `GET /api/courses/:courseId/attendance` - Get attendance records
- `POST /api/courses/:courseId/attendance` - Mark attendance (Lecturer/Admin only)
- `GET /api/courses/:courseId/attendance/stats` - Get attendance stats

## Default Test Credentials

### Student
- Email: `student.name@babcock.edu.ng`
- Password: `password123`

### Lecturer
- Email: `lecturer.name@babcock.edu.ng`
- Password: `password123`

### Admin
- Email: `admin@babcock.edu.ng`
- Password: `password123`

## Environment Variables

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/attendance-system
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```
