# University Management System - Database Setup

## Option 1: Use Mock Database (Current Setup)
The application will automatically use an in-memory mock database if MySQL is not configured. This is perfect for development and testing without database installation.

**No setup required!** Just run the application.

---

## Option 2: Use MySQL Database (Recommended for Production)

### Prerequisites
- MySQL Server 5.7+ or MariaDB 10.2+
- Node.js and npm installed

### Step 1: Install MySQL (if not already installed)

#### Windows
Download and install from: https://dev.mysql.com/downloads/installer/

#### macOS
```bash
brew install mysql
brew services start mysql
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
```

### Step 2: Create Database and User

Open MySQL command line:
```bash
mysql -u root -p
```

Run these commands:
```sql
CREATE DATABASE university_management;
CREATE USER 'uni_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON university_management.* TO 'uni_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 3: Create Environment File

Create a `.env` file in the project root:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=uni_user
DB_PASSWORD=your_secure_password
DB_NAME=university_management
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Email Configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# Server Configuration
PORT=3000
NODE_ENV=development
```

### Step 4: Run Database Schema

```bash
# Navigate to project directory
cd c:\Users\DELL\Downloads\University-System-Management-main

# Run the auth schema
mysql -u uni_user -p university_management < database_auth.sql

# Run the main schema
mysql -u uni_user -p university_management < database.sql

# Run the seed data
mysql -u uni_user -p university_management < database_seed.sql
```

**Or run all at once:**
```bash
mysql -u uni_user -p university_management < database_auth.sql && mysql -u uni_user -p university_management < database.sql && mysql -u uni_user -p university_management < database_seed.sql
```

### Step 5: Install Dependencies (if not done)

```bash
npm install
```

### Step 6: Start the Application

```bash
npm start
```

You should see:
```
✅ MySQL Database Connected Successfully
   Host: localhost
   Database: university_management
```

---

## Database Tables

### users
Stores user authentication and profile data
- Roles: admin, faculty, student
- Includes password hashing, OTP verification, account lockout

### routines
Class schedule and timetable information

### research_papers
Research papers with status tracking

### hostel_students
Hostel allocation and room assignments

### login_attempts
Security logging for failed login attempts

### sessions (optional)
Alternative to JWT for session management

---

## Default Login Credentials

### Admin Account
- **Email:** admin@university.edu
- **Password:** Admin@123

### Faculty Accounts
- **Email:** based123@gmail.com | **Password:** Faculty@123
- **Email:** shahmeem.cse@diu.ac | **Password:** Faculty@123
- **Email:** baruasraboni@yahoo.com | **Password:** Faculty@123

### Student Accounts
- **Email:** ahmed.hassan@student.diu.ac | **Password:** Student@123
- **Email:** fatima.rahman@student.diu.ac | **Password:** Student@123
- **Email:** karim.abdullah@student.diu.ac | **Password:** Student@123

---

## Troubleshooting

### Connection Failed
If you see "MySQL Connection Failed", check:
1. MySQL service is running
2. Database credentials in `.env` are correct
3. Database `university_management` exists
4. User has proper permissions

### Auto-Fallback
The application will automatically fall back to mock database if MySQL connection fails. No manual intervention needed.

### Reset Database
```sql
DROP DATABASE university_management;
CREATE DATABASE university_management;
```
Then re-run the schema and seed files.

---

## Switching Between Mock and MySQL

The application automatically detects and uses MySQL if available. To force mock database:
1. Stop MySQL service, OR
2. Use incorrect credentials in `.env`, OR
3. Comment out `.env` file

No code changes needed - the fallback is automatic!

---

## Production Deployment

For production:
1. ✅ Use strong passwords
2. ✅ Set unique `JWT_SECRET`
3. ✅ Configure email service
4. ✅ Enable SSL for database connections
5. ✅ Use environment variables (never commit `.env`)
6. ✅ Set `NODE_ENV=production`
7. ✅ Configure proper backup strategy

---

## Database Backup

```bash
# Backup
mysqldump -u uni_user -p university_management > backup_$(date +%Y%m%d).sql

# Restore
mysql -u uni_user -p university_management < backup_20240129.sql
```
