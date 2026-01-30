# 🚀 XAMPP MySQL Connection - Complete Setup

Your University Management System is now configured to use **XAMPP MySQL** instead of SQLite!

## 📋 What Changed

### ✅ New Files Created
1. **`config/mysqlDb.js`** - MySQL database connection handler
2. **`.env`** - Database configuration (XAMPP defaults)
3. **`XAMPP_SETUP.md`** - Detailed setup guide
4. **`QUICK_START_XAMPP.md`** - Quick start instructions
5. **`test-mysql-connection.js`** - Connection test script
6. **`setup-xampp.bat`** - Automated setup for Windows

### ✅ Files Updated
1. **`config/db.js`** - Now uses MySQL (was SQLite)
2. **`package.json`** - Added `test-mysql` script

## 🎯 Quick Start (3 Steps)

### Step 1: Start XAMPP MySQL

1. Open **XAMPP Control Panel**
2. Click **Start** next to **MySQL** 
3. Status should show **green** and say "Running"
4. (Optional) Start **Apache** for phpMyAdmin access

### Step 2: Test Your Connection

```bash
npm run test-mysql
```

This will:
- ✅ Test connection to MySQL server
- ✅ Check if database exists
- ✅ List tables and data
- ❌ Show errors if something is wrong

### Step 3: Start the Application

```bash
# Install dependencies (first time only)
npm install

# Start the server
npm start
```

The application will automatically:
1. Connect to XAMPP MySQL
2. Create `university_management` database
3. Create all tables
4. Seed initial data (admin, faculty, student accounts)

## 🌐 Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| **Backend API** | http://localhost:3000 | REST API endpoints |
| **Frontend** | http://localhost:3001 | User interface |
| **phpMyAdmin** | http://localhost/phpmyadmin | Database management |

## 🔐 Default Login Accounts

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@university.edu | Admin@123 |
| **Faculty** | faculty@university.edu | Faculty@123 |
| **Student** | student@university.edu | Student@123 |

## 📊 Database Structure

The following tables will be created automatically:

```
university_management/
├── users              # User accounts (admin, faculty, students)
├── login_attempts     # Security tracking
├── routines          # Class schedules
├── research_papers   # Research publications
├── hostel_students   # Hostel allocations
├── departments       # Faculty departments
└── teachers          # Teacher information
```

## ⚙️ Configuration

Your `.env` file (already created):

```env
# XAMPP MySQL defaults
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=          # Empty by default
DB_NAME=university_management

# Security
JWT_SECRET=your-secret-key-change-in-production
```

**Note:** XAMPP MySQL uses **root** user with **no password** by default.

## 🔍 Verify Setup in phpMyAdmin

1. Open: http://localhost/phpmyadmin
2. Login: Username `root`, Password *(empty)*
3. Click on **`university_management`** database (left panel)
4. You should see **7 tables**
5. Click on **`users`** table to see seeded accounts

## 🛠️ Troubleshooting

### ❌ "Cannot connect to MySQL"

**Check:**
- Is XAMPP MySQL running? (green indicator)
- Port 3306 not blocked by firewall
- `.env` file has correct settings

**Fix:**
```bash
# Test connection
npm run test-mysql

# Check XAMPP logs
# Location: xampp/mysql/data/mysql_error.log
```

### ❌ "Access denied for user 'root'"

**Fix:**
```env
# In .env file, ensure password is empty
DB_PASSWORD=
```

### ❌ "Port 3306 already in use"

**Check:**
- Another MySQL instance running (stop it)
- Other database services (PostgreSQL, MongoDB)

**Fix:** Stop conflicting services in Task Manager

### ❌ "Database not creating"

**Manual fix in phpMyAdmin:**
```sql
CREATE DATABASE university_management;
```

### ❌ Frontend not connecting to backend

**Check:**
```bash
cd frontend
# Verify package.json has:
"proxy": "http://localhost:3000"
```

## 🔄 Switch Back to SQLite

If you want to use SQLite instead:

1. Edit `config/db.js`:
```javascript
// Comment out MySQL
// const mysqlDb = require('./mysqlDb');
// module.exports = mysqlDb;

// Uncomment SQLite
const sqliteDb = require('./sqliteDb');
module.exports = sqliteDb;
```

2. Restart server

## 📚 Additional Resources

- **Detailed Setup**: See [XAMPP_SETUP.md](XAMPP_SETUP.md)
- **Quick Start**: See [QUICK_START_XAMPP.md](QUICK_START_XAMPP.md)
- **API Documentation**: See [README.md](README.md)

## 🎉 You're Ready!

Run the application:

```bash
# Backend
npm start

# Frontend (in new terminal)
cd frontend
npm start
```

Visit http://localhost:3001 and login with admin credentials!

---

## 💾 Database Backup

**Export from phpMyAdmin:**
1. Select `university_management` database
2. Click **Export** tab
3. Choose **Quick** export method
4. Format: **SQL**
5. Click **Go**

**Import:**
1. Click **Import** tab
2. Choose your `.sql` file
3. Click **Go**

## 🔒 Security Recommendations

1. **Set MySQL root password:**
   - phpMyAdmin → User accounts → root → Change password
   - Update `.env` with new password

2. **Change JWT secret:**
   ```env
   JWT_SECRET=use-a-long-random-string-here
   ```

3. **For production:**
   - Use environment-specific `.env` files
   - Enable SSL for MySQL connections
   - Set up automated backups

## 📞 Support

If issues persist:
1. Check XAMPP MySQL logs
2. Verify phpMyAdmin access works
3. Run connection test: `npm run test-mysql`
4. Check `.env` configuration

Happy coding! 🚀
