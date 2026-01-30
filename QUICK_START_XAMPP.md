# Quick Start with XAMPP

## Prerequisites Check ✓

Before running the application:

1. **XAMPP Installed**: Download from https://www.apachefriends.org/
2. **MySQL Running**: Open XAMPP Control Panel and start MySQL
3. **Node.js Installed**: Version 14+ required

## Quick Setup (3 Steps)

### Step 1: Create Environment File

Copy `.env.example` to `.env`:

```bash
# Windows Command Prompt
copy .env.example .env

# PowerShell
Copy-Item .env.example .env
```

### Step 2: Configure Database (Optional)

Open `.env` and verify these settings (defaults work for XAMPP):

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=university_management
```

### Step 3: Run the Application

```bash
# Option A: Use the setup script (Windows)
setup-xampp.bat

# Option B: Manual start
npm install
npm start
```

## Verify Setup

1. **Check Backend**: http://localhost:3000
   - Should show "University Management System API"

2. **Check Database**: http://localhost/phpmyadmin
   - Look for `university_management` database
   - Should have 7 tables

3. **Check Frontend**: 
   ```bash
   cd frontend
   npm install
   npm start
   ```
   - Opens at http://localhost:3001

## Default Login Credentials

- **Admin**: admin@university.edu / Admin@123
- **Faculty**: faculty@university.edu / Faculty@123  
- **Student**: student@university.edu / Student@123

## Troubleshooting

**MySQL not connecting?**
- Verify MySQL is running in XAMPP Control Panel (green indicator)
- Check port 3306 is not blocked

**Database not created?**
- Open phpMyAdmin: http://localhost/phpmyadmin
- Manually create database: `CREATE DATABASE university_management;`

**Port 3000 already in use?**
- Change in `.env`: `PORT=3001`

## Full Documentation

See [XAMPP_SETUP.md](XAMPP_SETUP.md) for detailed setup instructions.
