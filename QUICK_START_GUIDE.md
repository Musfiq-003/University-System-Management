# ⚡ Quick Start Guide - University Management System

## 🚀 Get Running in 5 Minutes!

This guide will get your upgraded system running quickly.

---

## 📋 Prerequisites

- ✅ Windows OS
- ✅ XAMPP installed (download from https://www.apachefriends.org/)
- ✅ Node.js installed (v14 or higher)
- ✅ Git Bash or PowerShell

---

## 🎯 Step 1: Start XAMPP (1 minute)

1. Open **XAMPP Control Panel**
2. Click **Start** next to **Apache**
3. Click **Start** next to **MySQL**
4. Wait for green highlights

**Verify:** Open http://localhost/phpmyadmin - should show phpMyAdmin interface

---

## 🎯 Step 2: Setup Database (2 minutes)

### Method 1: Import Complete Schema (Recommended)

1. In phpMyAdmin, click **Import** tab
2. Click **Choose File**
3. Select: `database_complete_schema.sql`
4. Scroll down, click **Import**
5. Wait for success message

### Method 2: Manual Creation

1. In phpMyAdmin, click **New**
2. Database name: `university_management`
3. Click **Create**
4. Click **Import** tab
5. Import `database_complete_schema.sql`

**Verify:** Check if `university_management` database appears in left sidebar with 8 tables

---

## 🎯 Step 3: Configure Backend (30 seconds)

1. Open project root folder:
   ```
   d:\database project\University-System-Management
   ```

2. Create `.env` file (copy text below):
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=university_management

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-12345
   JWT_EXPIRES_IN=24h

   # Server Configuration
   PORT=3000
   NODE_ENV=development
   ```

3. Edit `config/db.js` - Ensure MySQL is selected:
   ```javascript
   const mysqlDb = require('./mysqlDb');
   console.log('✅ Using MySQL database (XAMPP)');
   module.exports = mysqlDb;
   ```

---

## 🎯 Step 4: Install & Run Backend (1 minute)

Open PowerShell in project root:

```powershell
# Install dependencies (first time only)
npm install

# Start server
npm run dev
```

**Expected Output:**
```
✅ Connected to MySQL database (XAMPP): university_management
✅ Database tables created successfully
======================================================
  University Management System API Server
======================================================
Server is running on port 3000
API URL: http://localhost:3000
======================================================
```

**If you see this, backend is running! ✅**

---

## 🎯 Step 5: Run Frontend (1 minute)

Open **NEW** PowerShell window:

```powershell
cd frontend
npm install  # First time only
npm start
```

**Expected Output:**
```
Compiled successfully!
You can now view the app in the browser.
  Local:            http://localhost:3001
  On Your Network:  http://192.168.x.x:3001
```

**Browser will auto-open to http://localhost:3001 ✅**

---

## 🎯 Step 6: Test the System (30 seconds)

### Login with Default Credentials:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@university.edu | Admin@123 |
| **Faculty** | faculty@university.edu | Faculty@123 |
| **Student** | student@university.edu | Student@123 |

### Quick Test Checklist:

1. ✅ Login with admin credentials
2. ✅ Navigate to **Routines** page
3. ✅ Navigate to **Research Papers** page
4. ✅ Navigate to **Hostel** page
5. ✅ Navigate to **Faculty** page
6. ✅ Navigate to **User Management** page (admin only)
7. ✅ Logout

**If all pages load correctly, system is working! 🎉**

---

## 🔥 API Testing (Optional)

Test the API directly using PowerShell:

### Test 1: Login
```powershell
$body = @{
    email = "admin@university.edu"
    password = "Admin@123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method Post -Body $body -ContentType "application/json"
$token = $response.data.token
Write-Host "Token: $token"
```

### Test 2: Get Routines (using token)
```powershell
$headers = @{
    Authorization = "Bearer $token"
}

$routines = Invoke-RestMethod -Uri "http://localhost:3000/api/routines" -Method Get -Headers $headers
$routines.data
```

---

## 🐛 Troubleshooting

### Problem: "Cannot connect to database"
**Solution:**
1. Check XAMPP MySQL is running (green light)
2. Verify database exists in phpMyAdmin
3. Check `.env` DB_PASSWORD is empty (default XAMPP)
4. Restart backend server

### Problem: "Port 3000 already in use"
**Solution:**
1. Kill existing process: `Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess`
2. OR change PORT in `.env` to 3001

### Problem: "npm install" fails
**Solution:**
1. Delete `node_modules` folder
2. Delete `package-lock.json`
3. Run `npm install` again
4. Use `npm install --force` if still fails

### Problem: Frontend shows "Network Error"
**Solution:**
1. Verify backend is running (check PowerShell window)
2. Check http://localhost:3000 shows API info
3. Check `frontend/package.json` has: `"proxy": "http://localhost:3000"`

### Problem: "Token expired"
**Solution:**
- Just re-login (tokens expire after 24 hours)

---

## 📊 What's Running?

After successful start:

| Service | URL | Purpose |
|---------|-----|---------|
| **Backend API** | http://localhost:3000 | Server & Database |
| **Frontend UI** | http://localhost:3001 | User Interface |
| **phpMyAdmin** | http://localhost/phpmyadmin | Database Management |

---

## 🎓 Next Steps

### For Development:
1. Read [API_REFERENCE.md](API_REFERENCE.md) for API documentation
2. Check [UPGRADE_DOCUMENTATION.md](UPGRADE_DOCUMENTATION.md) for detailed features
3. Explore the codebase

### For Production:
1. Change `JWT_SECRET` in `.env`
2. Set `NODE_ENV=production`
3. Build frontend: `cd frontend && npm run build`
4. Setup SSL certificate
5. Configure domain and hosting

---

## ✅ System Features

Now that your system is running, you can:

### Admin:
- ✅ Manage users and roles
- ✅ View all data across departments
- ✅ Create/edit/delete routines
- ✅ Manage research papers
- ✅ Manage hostel allocations
- ✅ View activity logs
- ✅ Access user management

### Faculty:
- ✅ View faculty dashboard
- ✅ Create/edit routines
- ✅ Manage research papers
- ✅ View department data
- ✅ View own activity logs

### Student:
- ✅ View student dashboard
- ✅ View routines for their batch
- ✅ View research papers
- ✅ View hostel information
- ✅ View faculty directory

---

## 📞 Need More Help?

### Documentation:
- 📖 **Installation Guide:** [UPGRADE_DOCUMENTATION.md](UPGRADE_DOCUMENTATION.md)
- 📖 **API Reference:** [API_REFERENCE.md](API_REFERENCE.md)
- 📖 **Complete Summary:** [PROJECT_UPGRADE_COMPLETE.md](PROJECT_UPGRADE_COMPLETE.md)

### Common Resources:
- Database Schema: `database_complete_schema.sql`
- Environment Template: `.env.example` (if exists)
- Route Protection: Check `routes/*.js` files
- Controllers: Check `controllers/*.js` files

---

## 🎉 Congratulations!

Your **University Management System** is now:
- ✅ Running locally
- ✅ Connected to MySQL (XAMPP)
- ✅ Fully functional with all features
- ✅ Ready for testing and development

**Enjoy your upgraded system! 🚀**

---

**Last Updated:** January 31, 2026
**System Version:** 2.0.0
