# University Management System API

A comprehensive backend system for managing university operations including class routines, research papers, and hostel allocations.

## 📋 Features

### 1. Routine Management
- Add class routines with course details, teacher, day, and time
- View all routines
- Filter routines by day

### 2. Research Paper Management
- Add research papers with title, author, department, and year
- Update research paper status (Draft, Under Review, Published, Rejected)
- View all research papers
- Filter papers by department or status

### 3. Hostel Management
- Add student hostel allocations
- View all hostel records
- Filter by hostel name or student ID

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **Packages**: 
  - mysql2 (MySQL client)
  - body-parser (Parse request bodies)
  - cors (Enable cross-origin requests)

## 📁 Project Structure

```
University System/
├── config/
│   └── db.js                    # Database connection configuration
├── controllers/
│   ├── routineController.js     # Business logic for routines
│   ├── researchPaperController.js # Business logic for research papers
│   └── hostelController.js      # Business logic for hostel
├── routes/
│   ├── routineRoutes.js         # API routes for routines
│   ├── researchPaperRoutes.js   # API routes for research papers
│   └── hostelRoutes.js          # API routes for hostel
├── database.sql                 # Database schema and sample data
├── server.js                    # Main application entry point
├── package.json                 # Project dependencies
└── README.md                    # Documentation
```

## 🚀 Getting Started

### Prerequisites

1. **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
2. **MySQL** (v5.7 or higher) - [Download](https://dev.mysql.com/downloads/)

### Installation Steps

1. **Clone or download the project**
   ```bash
   cd "e:\Downloads\University System"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   
   a. Start your MySQL server
   
   b. Open MySQL command line or MySQL Workbench
   
   c. Run the database.sql file:
   ```bash
   mysql -u root -p < database.sql
   ```
   
   Or manually execute the SQL commands in `database.sql`

4. **Configure database connection**
   
   Edit `config/db.js` and update the following with your MySQL credentials:
   ```javascript
   host: 'localhost',
   user: 'root',          // Your MySQL username
   password: '',          // Your MySQL password
   database: 'university_management'
   ```

5. **Start the server**
   ```bash
   npm start
   ```
   
   For development with auto-restart:
   ```bash
   npm run dev
   ```

6. **Verify the server is running**
   
   You should see:
   ```
   ======================================================
     University Management System API Server
   ======================================================
   Server is running on port 3000
   API URL: http://localhost:3000
   ======================================================
   ```

## 📖 API Documentation

### Base URL
```
http://localhost:3000
```

### Root Endpoint
```http
GET /
```
Returns API information and available endpoints.

---

## 🔷 Routine Management APIs

### 1. Add Class Routine
```http
POST /api/routines
```

**Request Body:**
```json
{
  "course": "Database Systems",
  "teacher": "Dr. John Smith",
  "day": "Monday",
  "start_time": "09:00:00",
  "end_time": "10:30:00"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Routine added successfully",
  "data": {
    "id": 1,
    "course": "Database Systems",
    "teacher": "Dr. John Smith",
    "day": "Monday",
    "start_time": "09:00:00",
    "end_time": "10:30:00"
  }
}
```

### 2. Get All Routines
```http
GET /api/routines
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "course": "Database Systems",
      "teacher": "Dr. John Smith",
      "day": "Monday",
      "start_time": "09:00:00",
      "end_time": "10:30:00",
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### 3. Get Routines by Day
```http
GET /api/routines/day/:day
```

**Example:**
```http
GET /api/routines/day/Monday
```

**Success Response (200):**
```json
{
  "success": true,
  "day": "Monday",
  "count": 2,
  "data": [...]
}
```

---

## 🔶 Research Paper Management APIs

### 1. Add Research Paper
```http
POST /api/research-papers
```

**Request Body:**
```json
{
  "title": "Machine Learning in Healthcare",
  "author": "Dr. Alice Brown",
  "department": "Computer Science",
  "year": 2024,
  "status": "Draft"
}
```

**Note:** `status` is optional. Default value is "Draft". Valid values: `Draft`, `Under Review`, `Published`, `Rejected`

**Success Response (201):**
```json
{
  "success": true,
  "message": "Research paper added successfully",
  "data": {
    "id": 1,
    "title": "Machine Learning in Healthcare",
    "author": "Dr. Alice Brown",
    "department": "Computer Science",
    "year": 2024,
    "status": "Draft"
  }
}
```

### 2. Update Research Paper Status
```http
PATCH /api/research-papers/:id/status
```

**Request Body:**
```json
{
  "status": "Published"
}
```

**Example:**
```http
PATCH /api/research-papers/1/status
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Research paper status updated successfully",
  "data": {
    "id": 1,
    "status": "Published"
  }
}
```

### 3. Get All Research Papers
```http
GET /api/research-papers
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [...]
}
```

### 4. Get Research Papers by Department
```http
GET /api/research-papers/department/:department
```

**Example:**
```http
GET /api/research-papers/department/Computer Science
```

### 5. Get Research Papers by Status
```http
GET /api/research-papers/status/:status
```

**Example:**
```http
GET /api/research-papers/status/Published
```

---

## 🔸 Hostel Management APIs

### 1. Add Hostel Student Allocation
```http
POST /api/hostel
```

**Request Body:**
```json
{
  "student_name": "John Doe",
  "student_id": "CS2024001",
  "hostel_name": "North Hall",
  "room_number": "101",
  "department": "Computer Science",
  "allocated_date": "2024-01-15"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Hostel student allocation added successfully",
  "data": {
    "id": 1,
    "student_name": "John Doe",
    "student_id": "CS2024001",
    "hostel_name": "North Hall",
    "room_number": "101",
    "department": "Computer Science",
    "allocated_date": "2024-01-15"
  }
}
```

### 2. Get All Hostel Students
```http
GET /api/hostel
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 10,
  "data": [...]
}
```

### 3. Get Students by Hostel Name
```http
GET /api/hostel/hostel/:hostelName
```

**Example:**
```http
GET /api/hostel/hostel/North Hall
```

### 4. Get Student by Student ID
```http
GET /api/hostel/student/:studentId
```

**Example:**
```http
GET /api/hostel/student/CS2024001
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "student_name": "John Doe",
    "student_id": "CS2024001",
    "hostel_name": "North Hall",
    "room_number": "101",
    "department": "Computer Science",
    "allocated_date": "2024-01-15",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## 🧪 Testing the APIs

### Using cURL

**Add a routine:**
```bash
curl -X POST http://localhost:3000/api/routines \
  -H "Content-Type: application/json" \
  -d '{"course":"Web Development","teacher":"Prof. Sarah","day":"Tuesday","start_time":"10:00:00","end_time":"11:30:00"}'
```

**Get all routines:**
```bash
curl http://localhost:3000/api/routines
```

### Using Postman

1. Download and install [Postman](https://www.postman.com/downloads/)
2. Create a new request
3. Set the method (GET, POST, PATCH)
4. Enter the URL (e.g., `http://localhost:3000/api/routines`)
5. For POST/PATCH requests:
   - Go to "Body" tab
   - Select "raw" and "JSON"
   - Enter the JSON data
6. Click "Send"

### Using VS Code REST Client Extension

1. Install the "REST Client" extension in VS Code
2. Create a file named `test.http`
3. Add your requests:

```http
### Get API Info
GET http://localhost:3000

### Add Routine
POST http://localhost:3000/api/routines
Content-Type: application/json

{
  "course": "Data Structures",
  "teacher": "Dr. Mike Wilson",
  "day": "Wednesday",
  "start_time": "14:00:00",
  "end_time": "15:30:00"
}

### Get All Routines
GET http://localhost:3000/api/routines
```

4. Click "Send Request" above each request

---

## ⚠️ Error Handling

All endpoints return consistent error responses:

**400 Bad Request** - Missing or invalid parameters
```json
{
  "success": false,
  "message": "All fields are required (course, teacher, day, start_time, end_time)"
}
```

**404 Not Found** - Resource not found
```json
{
  "success": false,
  "message": "Research paper not found"
}
```

**409 Conflict** - Duplicate entry
```json
{
  "success": false,
  "message": "Student ID already exists in hostel records"
}
```

**500 Internal Server Error** - Server error
```json
{
  "success": false,
  "message": "Failed to add routine",
  "error": "Error details..."
}
```

---

## 🗃️ Database Schema

### routines table
```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- course (VARCHAR(100))
- teacher (VARCHAR(100))
- day (VARCHAR(20))
- start_time (TIME)
- end_time (TIME)
- created_at (TIMESTAMP)
```

### research_papers table
```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- title (VARCHAR(255))
- author (VARCHAR(100))
- department (VARCHAR(100))
- year (INT)
- status (VARCHAR(50))
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### hostel_students table
```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- student_name (VARCHAR(100))
- student_id (VARCHAR(50), UNIQUE)
- hostel_name (VARCHAR(100))
- room_number (VARCHAR(20))
- department (VARCHAR(100))
- allocated_date (DATE)
- created_at (TIMESTAMP)
```

---

## 🔧 Troubleshooting

### Common Issues

**1. "Cannot connect to MySQL database"**
- Verify MySQL server is running
- Check database credentials in `config/db.js`
- Ensure the database `university_management` exists

**2. "Port 3000 already in use"**
- Change the port in `server.js` or set PORT environment variable:
  ```bash
  PORT=3001 npm start
  ```

**3. "Module not found"**
- Run `npm install` to install all dependencies

**4. "ER_NO_SUCH_TABLE"**
- Run the `database.sql` file to create tables

---

## 📝 Development Tips

1. **Code Organization**: The project follows MVC pattern with controllers and routes separated
2. **Database Connection**: Uses connection pooling for better performance
3. **Async/Await**: All database operations use modern async/await syntax
4. **Error Handling**: Comprehensive try-catch blocks in all controllers
5. **Validation**: Input validation on all POST/PATCH requests
6. **Comments**: Well-documented code for easy understanding

---

## 🚀 Future Enhancements

- Add authentication and authorization (JWT)
- Implement pagination for large datasets
- Add search and filtering capabilities
- Create frontend dashboard
- Add email notifications
- Implement file upload for research papers
- Add unit and integration tests

---

## 📄 License

ISC

---

## 👨‍💻 Author

University Management System API - Backend

---

## 📞 Support

For issues or questions:
- Check the troubleshooting section
- Review error messages in console
- Verify database connection and table structure

---

**Happy Coding! 🎓**
