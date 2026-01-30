# 📖 API Reference - University Management System

## Base URL
```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 🔐 Authentication Endpoints

### Register New User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "full_name": "John Doe",
  "email": "john.doe@university.edu",
  "password": "SecurePass@123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Registration successful! Please check your email for OTP verification code.",
  "data": {
    "user_id": 5,
    "email": "john.doe@university.edu",
    "requires_verification": true
  }
}
```

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

---

### Verify OTP
```http
POST /auth/verify-otp
```

**Request Body:**
```json
{
  "email": "john.doe@university.edu",
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Email verified successfully!",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 5,
      "full_name": "John Doe",
      "email": "john.doe@university.edu",
      "role": "pending"
    }
  }
}
```

---

### Resend OTP
```http
POST /auth/resend-otp
```

**Request Body:**
```json
{
  "email": "john.doe@university.edu"
}
```

---

### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "admin@university.edu",
  "password": "Admin@123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "full_name": "System Administrator",
      "email": "admin@university.edu",
      "role": "admin",
      "department": null,
      "designation": null,
      "batch": null,
      "studentId": null
    }
  }
}
```

---

### Forgot Password
```http
POST /auth/forgot-password
```

**Request Body:**
```json
{
  "email": "john.doe@university.edu"
}
```

---

### Reset Password
```http
POST /auth/reset-password
```

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "new_password": "NewSecurePass@123"
}
```

---

### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "full_name": "System Administrator",
      "email": "admin@university.edu",
      "role": "admin",
      "is_verified": 1,
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

---

### Logout
```http
POST /auth/logout
Authorization: Bearer <token>
```

---

### Get All Users (Admin Only)
```http
GET /auth/users
Authorization: Bearer <admin-token>
```

**Response (200):**
```json
{
  "success": true,
  "users": [
    {
      "id": 1,
      "full_name": "System Administrator",
      "email": "admin@university.edu",
      "role": "admin",
      "is_verified": 1,
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### Update User Role (Admin Only)
```http
PUT /auth/users/:userId/role
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "role": "faculty"
}
```

**Valid Roles:** `admin`, `faculty`, `student`, `pending`

---

## 📅 Routine Endpoints

### Get All Routines
```http
GET /routines
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (default: 1) - Page number
- `limit` (default: 50) - Items per page
- `search` - Search in course name and teacher
- `department` - Filter by department
- `batch` - Filter by batch
- `day` - Filter by day (Monday, Tuesday, etc.)

**Example:**
```
GET /routines?page=1&limit=10&department=CSE&batch=D-78A&search=database
```

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "total": 25,
  "page": 1,
  "totalPages": 3,
  "data": [
    {
      "id": 1,
      "course": "Database Systems",
      "teacher": "Dr. John Smith",
      "department": "Computer Science & Engineering",
      "day": "Monday",
      "start_time": "09:00:00",
      "end_time": "10:30:00",
      "batch": "D-78A",
      "room_number": "Room 301",
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### Get Routine by ID
```http
GET /routines/:id
Authorization: Bearer <token>
```

---

### Get Routines by Day
```http
GET /routines/day/:day
Authorization: Bearer <token>
```

**Example:** `GET /routines/day/Monday`

---

### Get Routines by Department
```http
GET /routines/department/:department
Authorization: Bearer <token>
```

**Example:** `GET /routines/department/Computer Science & Engineering`

---

### Get Routines by Batch
```http
GET /routines/batch/:batch
Authorization: Bearer <token>
```

**Example:** `GET /routines/batch/D-78A`

---

### Create Routine (Faculty/Admin Only)
```http
POST /routines
Authorization: Bearer <faculty-or-admin-token>
```

**Request Body:**
```json
{
  "course": "Database Management Systems",
  "teacher": "Dr. John Smith",
  "department": "Computer Science & Engineering",
  "day": "Monday",
  "start_time": "09:00",
  "end_time": "10:30",
  "batch": "D-78A",
  "room_number": "Room 301"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Routine added successfully",
  "data": {
    "id": 10,
    "course": "Database Management Systems",
    "teacher": "Dr. John Smith",
    "department": "Computer Science & Engineering",
    "day": "Monday",
    "start_time": "09:00",
    "end_time": "10:30",
    "batch": "D-78A"
  }
}
```

---

### Update Routine (Faculty/Admin Only)
```http
PUT /routines/:id
Authorization: Bearer <faculty-or-admin-token>
```

**Request Body:** Same as Create Routine

---

### Delete Routine (Admin Only)
```http
DELETE /routines/:id
Authorization: Bearer <admin-token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Routine deleted successfully"
}
```

---

## 📚 Research Paper Endpoints

### Get All Research Papers
```http
GET /research-papers
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `search` - Search in title and author
- `department` - Filter by department
- `status` - Filter by status
- `year` - Filter by year

**Example:**
```
GET /research-papers?department=CSE&status=Published&year=2024
```

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "total": 15,
  "page": 1,
  "totalPages": 2,
  "data": [
    {
      "id": 1,
      "title": "Machine Learning in Healthcare",
      "author": "Dr. Alice Brown",
      "department": "Computer Science & Engineering",
      "year": 2024,
      "status": "Published",
      "abstract": "This paper explores...",
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-20T15:45:00.000Z"
    }
  ]
}
```

---

### Get Research Paper by ID
```http
GET /research-papers/:id
Authorization: Bearer <token>
```

---

### Get Papers by Department
```http
GET /research-papers/department/:department
Authorization: Bearer <token>
```

---

### Get Papers by Status
```http
GET /research-papers/status/:status
Authorization: Bearer <token>
```

**Valid Statuses:** `Draft`, `Under Review`, `Published`, `Rejected`

---

### Create Research Paper (Faculty/Admin Only)
```http
POST /research-papers
Authorization: Bearer <faculty-or-admin-token>
```

**Request Body:**
```json
{
  "title": "AI Applications in Education",
  "author": "Dr. Jane Smith",
  "department": "Computer Science & Engineering",
  "year": 2024,
  "status": "Draft",
  "abstract": "This paper explores the applications of artificial intelligence in modern education systems."
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Research paper added successfully",
  "data": {
    "id": 5,
    "title": "AI Applications in Education",
    "author": "Dr. Jane Smith",
    "department": "Computer Science & Engineering",
    "year": 2024,
    "status": "Draft"
  }
}
```

---

### Update Research Paper (Faculty/Admin Only)
```http
PUT /research-papers/:id
Authorization: Bearer <faculty-or-admin-token>
```

**Request Body:** Same as Create Research Paper

---

### Update Paper Status (Faculty/Admin Only)
```http
PATCH /research-papers/:id/status
Authorization: Bearer <faculty-or-admin-token>
```

**Request Body:**
```json
{
  "status": "Published"
}
```

---

### Delete Research Paper (Admin Only)
```http
DELETE /research-papers/:id
Authorization: Bearer <admin-token>
```

---

## 🏢 Hostel Endpoints

### Get All Hostel Students
```http
GET /hostel
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 50)
- `search` - Search in name, student ID, room number
- `hostel_name` - Filter by hostel
- `department` - Filter by department

**Example:**
```
GET /hostel?hostel_name=North Hall&department=CSE
```

**Response (200):**
```json
{
  "success": true,
  "count": 10,
  "total": 45,
  "page": 1,
  "totalPages": 5,
  "data": [
    {
      "id": 1,
      "student_name": "Ahmed Hassan",
      "student_id": "CS2024001",
      "hostel_name": "North Hall",
      "room_number": "101",
      "department": "Computer Science & Engineering",
      "allocated_date": "2024-01-15",
      "status": "Active",
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### Get Hostel Student by ID
```http
GET /hostel/student/:studentId
Authorization: Bearer <token>
```

---

### Get Students by Hostel
```http
GET /hostel/hostel/:hostelName
Authorization: Bearer <token>
```

---

### Get Students by Department
```http
GET /hostel/department/:department
Authorization: Bearer <token>
```

---

### Add Hostel Student (Admin Only)
```http
POST /hostel
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "student_name": "John Doe",
  "student_id": "CS2024010",
  "hostel_name": "North Hall",
  "room_number": "205",
  "department": "Computer Science & Engineering",
  "allocated_date": "2024-01-20"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Hostel student allocation added successfully",
  "data": {
    "id": 15,
    "student_name": "John Doe",
    "student_id": "CS2024010",
    "hostel_name": "North Hall",
    "room_number": "205",
    "department": "Computer Science & Engineering",
    "allocated_date": "2024-01-20"
  }
}
```

---

### Update Hostel Student (Admin Only)
```http
PUT /hostel/:id
Authorization: Bearer <admin-token>
```

**Request Body:** Same as Add Hostel Student

---

### Delete Hostel Student (Admin Only)
```http
DELETE /hostel/:id
Authorization: Bearer <admin-token>
```

---

## 🏛️ Department & Teacher Endpoints

### Get All Departments
```http
GET /departments
```

**Response (200):**
```json
{
  "success": true,
  "departments": [
    {
      "id": 1,
      "name": "Computer Science & Engineering",
      "code": "CSE",
      "description": "Department of Computer Science and Engineering",
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### Get All Teachers
```http
GET /teachers
```

**Query Parameters:**
- `department` - Filter by department

**Example:** `GET /teachers?department=Computer Science & Engineering`

---

### Get Teacher by ID
```http
GET /teachers/:id
```

---

## 📊 Activity Log Endpoints

### Get All Activity Logs (Admin Only)
```http
GET /activity-logs
Authorization: Bearer <admin-token>
```

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 50)
- `userId` - Filter by user ID
- `action` - Filter by action type
- `entity` - Filter by entity type

**Example:** `GET /activity-logs?action=CREATE&entity=ROUTINE`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 2,
      "action": "CREATE",
      "entity": "ROUTINE",
      "entity_id": 10,
      "details": "Created routine for Database Systems",
      "ip_address": "192.168.1.100",
      "created_at": "2024-01-20T14:30:00.000Z",
      "user_name": "Dr. John Smith",
      "user_email": "faculty@university.edu",
      "user_role": "faculty"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 150,
    "totalPages": 3
  }
}
```

---

### Get My Activity Logs
```http
GET /activity-logs/me
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)

---

### Get Activity Statistics (Admin Only)
```http
GET /activity-logs/stats
Authorization: Bearer <admin-token>
```

**Query Parameters:**
- `days` (default: 7) - Number of days to analyze

**Response (200):**
```json
{
  "success": true,
  "data": {
    "period": "Last 7 days",
    "actionStats": [
      { "action": "READ", "count": 450 },
      { "action": "CREATE", "count": 25 },
      { "action": "UPDATE", "count": 15 },
      { "action": "DELETE", "count": 3 }
    ],
    "entityStats": [
      { "entity": "ROUTINE", "count": 200 },
      { "entity": "RESEARCH_PAPER", "count": 150 },
      { "entity": "HOSTEL", "count": 100 }
    ],
    "userStats": [
      {
        "user_id": 1,
        "full_name": "System Administrator",
        "email": "admin@university.edu",
        "role": "admin",
        "activity_count": 150
      }
    ],
    "dailyStats": [
      { "date": "2024-01-20", "count": 85 },
      { "date": "2024-01-21", "count": 92 }
    ]
  }
}
```

---

### Cleanup Old Logs (Admin Only)
```http
DELETE /activity-logs/cleanup
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "days": 90
}
```

---

## ❌ Error Responses

All endpoints return consistent error responses:

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error message",
  "errors": ["Specific error 1", "Specific error 2"]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "No token provided. Please login."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied. Required roles: admin, faculty"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "Resource already exists"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Detailed error message (in development mode only)"
}
```

---

## 📝 Notes

1. **All timestamps** are in ISO 8601 format (UTC)
2. **Pagination** starts from page 1
3. **Time fields** use 24-hour format (HH:MM or HH:MM:SS)
4. **Dates** use YYYY-MM-DD format
5. **JWT tokens** expire after 24 hours (configurable)
6. **Rate limiting** is applied to authentication endpoints

---

Last Updated: January 31, 2026
API Version: 2.0.0
